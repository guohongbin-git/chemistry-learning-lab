
    "use strict";
    const KNOWLEDGE = { id:"CH1_2_002", title:"电解质导电原因", core:"存在自由移动的离子" };
    const ANIMATION = { id:"ION_NACL_001", states:["crystal","water","conduct"] };
    const QUESTIONS = [
      { id:"Q_CH1_020", text:"固体 NaCl 不能导电，最关键的原因是什么？", options:["固体中没有 Na⁺ 和 Cl⁻","Na⁺ 和 Cl⁻ 不能自由移动","NaCl 不是电解质"], answer:1, errors:{0:"晶体中有离子，只是它们被束缚在晶格位置。",2:"NaCl 是电解质；要区分物质类别和当前状态能否导电。"} },
      { id:"Q_CH1_021", text:"NaCl 水溶液接通电路后，什么在定向迁移？", options:["Na⁺ 和 Cl⁻","水分子","NaCl 分子"], answer:0, errors:{1:"水是溶剂；这里主要由溶液中的离子承担导电。",2:"NaCl 溶于水后，形成分散的 Na⁺ 和 Cl⁻。"} },
      { id:"Q_CH1_022", text:"把 NaCl 换成 KCl 水溶液，最合理的预测是？", options:["不能导电，因为没有 Na⁺","能导电，因为有自由移动的 K⁺ 和 Cl⁻","只能在固态导电"], answer:1, errors:{0:"关键是自由移动的离子，不要求一定是 Na⁺。",2:"固体离子通常不能自由移动；水溶液中的离子可以。"} }
    ];
    const STORAGE_KEY = "chemistry-lab-ch1-ion-v0.1";
    const $ = id => document.getElementById(id);
    const state = { page:"dashboard", predict:null, scene:"crystal", seen:new Set(), quizIndex:0, answers:[], complete:false, mastery:50 };
    const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = $("ion-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [], frame = 0, animationId = null;

    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mastery:state.mastery, complete:state.complete, completedAt:state.complete ? new Date().toISOString() : null })); } catch (_) { /* Private browsing may block storage. */ }
    }
    function load() {
      try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (data && Number.isFinite(data.mastery)) { state.mastery = Math.max(0,Math.min(100,data.mastery)); state.complete = !!data.complete; } } catch (_) { /* Continue without saved data. */ }
      updateDashboard();
    }
    function updateDashboard() {
      $("dashboard-mastery").textContent = state.mastery + "%";
      $("dashboard-bar").style.width = state.mastery + "%";
      $("dashboard-status").textContent = state.complete ? "已完成本节。你可以再次练习。" : "完成本节后会更新。";
    }
    const PAGE_ORDER = ["predict","lab","explain","quiz","result"];
    function show(page) {
      state.page = page;
      $("dashboard").classList.toggle("active",page === "dashboard");
      $("lesson").hidden = page === "dashboard";
      PAGE_ORDER.forEach(id => $(id).classList.toggle("active",id === page));
      [...$("steps").children].forEach((node,index) => { node.className = "step" + (PAGE_ORDER[index] === page ? " active" : PAGE_ORDER.indexOf(page) > index ? " done" : ""); });
      [...$("nav-list").children].forEach((node,index) => node.classList.toggle("active", index === (page === "dashboard" ? 0 : page === "predict" || page === "lab" ? 1 : page === "explain" ? 2 : 3)));
      if (page === "lab") { resizeCanvas(); startAnimation(); } else stopAnimation();
      window.scrollTo({top:0,behavior:prefersReducedMotion ? "instant" : "smooth"});
    }
    function resetLesson() {
      state.predict = null; state.scene = "crystal"; state.seen = new Set(); state.quizIndex = 0; state.answers = [];
      [...$("predict-options").children].forEach(b => b.classList.remove("selected"));
      $("predict-feedback").hidden = true; $("to-lab").disabled = true;
      $("add-water").disabled = false; $("connect-circuit").disabled = true; $("to-explain").disabled = true;
      setScene("crystal");
      show("predict");
    }
    $("start-btn").addEventListener("click",resetLesson);
    $("restart").addEventListener("click",resetLesson);
    $("home").addEventListener("click",() => { updateDashboard(); show("dashboard"); });
    $("predict-options").addEventListener("click",event => {
      const button = event.target.closest("button[data-predict]"); if (!button) return;
      state.predict = button.dataset.predict;
      [...$("predict-options").children].forEach(b => b.classList.toggle("selected",b === button));
      const note = state.predict === "yes" ? "你的预测抓住了“有离子”，接下来观察这些离子能否移动。" : state.predict === "no" ? "很好。接下来用实验检验“能否移动”是不是关键。" : "不确定很正常。接下来亲手观察三种状态。";
      $("predict-feedback").textContent = note; $("predict-feedback").hidden = false; $("to-lab").disabled = false;
    });
    $("to-lab").addEventListener("click",() => { state.seen.add("crystal"); updateLab(); show("lab"); });
    $("reset-lab").addEventListener("click",() => setScene("crystal"));
    $("add-water").addEventListener("click",() => setScene("water"));
    $("connect-circuit").addEventListener("click",() => setScene("conduct"));
    $("to-explain").addEventListener("click",() => show("explain"));
    $("back-to-lab").addEventListener("click",() => show("lab"));
    $("to-quiz").addEventListener("click",() => { state.quizIndex = 0; state.answers = []; renderQuestion(); show("quiz"); });

    function setScene(scene) {
      state.scene = scene; state.seen.add(scene);
      if (scene === "crystal") { $("connect-circuit").disabled = true; $("add-water").disabled = false; }
      else { $("connect-circuit").disabled = scene === "conduct"; $("add-water").disabled = true; }
      const labels = {
        crystal:["晶体：Na⁺、Cl⁻ 有序排列，不能自由移动。","晶体中有离子，但离子被束缚在晶格位置。灯泡不亮。"],
        water:["溶于水：Na⁺、Cl⁻ 分散并自由移动。","加水后晶格解离，离子在溶液中能够自由移动。现在试着接通电路。"],
        conduct:["接通电路：离子定向迁移，灯泡亮起。","Na⁺ 趋向负极，Cl⁻ 趋向正极；移动的离子传递电荷。"]
      };
      $("canvas-caption").textContent = labels[scene][0];
      $("lab-readout").innerHTML = "<strong>观察结果</strong>" + labels[scene][1];
      canvas.setAttribute("aria-label",labels[scene][0]);
      updateLab(); seedParticles(); draw();
    }
    function updateLab() {
      const n = state.seen.size;
      $("lab-bar").style.width = Math.round(n / 3 * 100) + "%";
      $("lab-progress").textContent = "已观察 " + n + " / 3 个状态";
      $("to-explain").disabled = !["crystal","water","conduct"].every(x => state.seen.has(x));
    }
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect(); if (!rect.width) return;
      const ratio = Math.min(devicePixelRatio || 1,2);
      canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0); seedParticles(); draw();
    }
    function seedParticles() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      particles = Array.from({length:16},(_,i) => {
        const row = Math.floor(i / 4), col = i % 4;
        const x = w * (.25 + col * .17), y = h * (.25 + row * .17);
        return { type:(row+col)%2 ? "Cl⁻" : "Na⁺", x, y, vx:((i*17)%7-3)*.28, vy:((i*11)%5-2)*.25, homeX:x, homeY:y };
      });
    }
    function roundRect(x,y,w,h,r,fill) { ctx.fillStyle=fill; ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill(); }
    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      ctx.clearRect(0,0,w,h); ctx.fillStyle = state.scene === "crystal" ? "#142348" : "#102b53"; ctx.fillRect(0,0,w,h);
      if (state.scene !== "crystal") {
        ctx.fillStyle="#77bdff10";
        for (let i=0;i<18;i++) { const x=(i*83+22)%w, y=(i*57+34)%h; ctx.beginPath(); ctx.arc(x,y,8+(i%3)*3,0,Math.PI*2); ctx.fill(); }
      }
      if (state.scene === "conduct") {
        ctx.strokeStyle="#80afe988"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(30,18); ctx.lineTo(30,h-18); ctx.moveTo(w-30,18); ctx.lineTo(w-30,h-18); ctx.stroke();
        roundRect(w-76,17,48,26,8,"#ffd985"); ctx.fillStyle="#634713"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center"; ctx.fillText("亮",w-52,35);
        ctx.fillStyle="#b3ccf1"; ctx.fillText("−",31,37); ctx.fillText("+",w-30,37);
      }
      for (const p of particles) {
        const isNa=p.type==="Na⁺"; ctx.beginPath(); ctx.arc(p.x,p.y,20,0,Math.PI*2);
        ctx.fillStyle=isNa ? "#6da7ff" : "#a990fa"; ctx.fill();
        ctx.fillStyle="#fff"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(p.type,p.x,p.y+1);
      }
      if (state.scene === "crystal") { ctx.fillStyle="#d9e6ff"; ctx.font="bold 13px sans-serif"; ctx.textAlign="left"; ctx.textBaseline="alphabetic"; ctx.fillText("离子固定在晶格位置",17,h-18); }
      else if (state.scene === "water") { ctx.fillStyle="#d9e6ff"; ctx.font="bold 13px sans-serif"; ctx.textAlign="left"; ctx.textBaseline="alphabetic"; ctx.fillText("离子自由移动",17,h-18); }
      else { ctx.fillStyle="#d9e6ff"; ctx.font="bold 13px sans-serif"; ctx.textAlign="left"; ctx.textBaseline="alphabetic"; ctx.fillText("离子定向迁移",17,h-18); }
    }
    function animate() {
      if (state.page !== "lab") return;
      frame++;
      if (!prefersReducedMotion && state.scene !== "crystal") {
        const w=canvas.clientWidth, h=canvas.clientHeight;
        for (const p of particles) {
          if (state.scene === "conduct") p.x += p.type === "Na⁺" ? -.7 : .7;
          else { p.x += p.vx; p.y += p.vy; }
          if (p.x < 55) p.x=w-55; if (p.x > w-55) p.x=55;
          if (p.y < 48 || p.y > h-48) p.vy *= -1;
        }
        draw();
      }
      animationId=requestAnimationFrame(animate);
    }
    function startAnimation() { stopAnimation(); animationId=requestAnimationFrame(animate); }
    function stopAnimation() { if (animationId !== null) cancelAnimationFrame(animationId); animationId=null; }
    window.addEventListener("resize",() => { if (state.page === "lab") resizeCanvas(); });

    function renderQuestion() {
      const q=QUESTIONS[state.quizIndex];
      $("quiz-count").textContent="第 " + (state.quizIndex+1) + " / " + QUESTIONS.length + " 题";
      $("quiz-question").textContent=q.text;
      $("quiz-options").replaceChildren(...q.options.map((label,index) => {
        const b=document.createElement("button"); b.className="option"; b.textContent=String.fromCharCode(65+index)+". "+label; b.dataset.answer=String(index); return b;
      }));
      $("quiz-feedback").hidden=true; $("quiz-next").disabled=true;
      $("quiz-next").textContent=state.quizIndex === QUESTIONS.length-1 ? "查看结果 →" : "下一题 →";
    }
    $("quiz-options").addEventListener("click",event => {
      const b=event.target.closest("button[data-answer]"); if (!b || state.answers[state.quizIndex] !== undefined) return;
      const q=QUESTIONS[state.quizIndex], chosen=Number(b.dataset.answer), correct=chosen === q.answer;
      state.answers[state.quizIndex]=correct;
      [...$("quiz-options").children].forEach((button,index) => { button.disabled=true; if (index === q.answer) button.classList.add("correct"); else if (index === chosen) button.classList.add("incorrect"); });
      $("quiz-feedback").textContent=correct ? "答对了。你抓住了“自由移动的离子”这个条件。" : "再想一步：" + q.errors[chosen] + " 正确答案是 " + String.fromCharCode(65+q.answer) + "。";
      $("quiz-feedback").className="feedback " + (correct ? "good" : "warn");
      $("quiz-feedback").hidden=false; $("quiz-next").disabled=false;
    });
    $("quiz-next").addEventListener("click",() => {
      if (state.answers[state.quizIndex] === undefined) return;
      if (state.quizIndex < QUESTIONS.length-1) { state.quizIndex++; renderQuestion(); return; }
      const correct=state.answers.filter(Boolean).length;
      state.mastery=Math.min(100,50+correct*15+(state.predict === "no" ? 5 : 0));
      state.complete=true; save(); updateDashboard();
      $("result-score").textContent=state.mastery+"%"; $("result-bar").style.width=state.mastery+"%";
      $("result-summary").textContent="本次练习答对 " + correct + " / " + QUESTIONS.length + " 题。" + (correct === QUESTIONS.length ? "你已能把模型迁移到 KCl。" : "再练一次，重点区分“有离子”与“离子能移动”。");
      const review=new Date(); review.setDate(review.getDate()+1);
      $("review-date").textContent="建议明天（" + new Intl.DateTimeFormat("zh-CN",{month:"numeric",day:"numeric"}).format(review) + "）再回忆一次这个判断句。";
      show("result");
    });
    load();
