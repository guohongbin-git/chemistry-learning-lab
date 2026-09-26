
    "use strict";
    const KNOWLEDGE = { id:"CH1_2_002", title:"电解质导电原因", core:"存在自由移动的离子" };
    const ANIMATION = { id:"ION_NACL_001", states:["crystal","water","conduct"] };
    const CASES = [
      { name:"干燥 NaCl 晶体", category:"盐 · 固态", prompt:"Na⁺、Cl⁻ 在晶格中有序排列", conducts:false, why:"固体里有离子，但离子被束缚，不能自由移动。" },
      { name:"KCl 水溶液", category:"盐 · 水溶液", prompt:"把氯化钾溶于水", conducts:true, why:"K⁺ 和 Cl⁻ 在水中能够自由移动。判断方法可以从 NaCl 迁移到 KCl。" },
      { name:"HCl 气体", category:"酸的对照 · 气态", prompt:"尚未溶于水的氯化氢气体", conducts:false, why:"在通常的课堂条件下，HCl 气体主要是中性分子，没有足量自由移动的离子。" },
      { name:"盐酸 HCl(aq)", category:"酸 · 水溶液", prompt:"HCl 溶于水形成盐酸", conducts:true, why:"盐酸中有能够自由移动的水合氢离子和 Cl⁻，所以能导电。严格分类时，HCl 是电解质，盐酸是它的水溶液。" },
      { name:"稀硫酸 H₂SO₄(aq)", category:"酸 · 水溶液", prompt:"硫酸与水配成的稀溶液", conducts:true, why:"稀硫酸中有能够自由移动的离子，如水合氢离子、HSO₄⁻ 和 SO₄²⁻。这里讨论的是稀硫酸水溶液。" },
      { name:"蔗糖水溶液", category:"反例 · 分子溶质", prompt:"蔗糖溶于水，但主要仍是中性分子", conducts:false, why:"蔗糖溶解不等于电离。普通课堂灯泡装置中通常不会因蔗糖而明显导电。" },
      { name:"KNO₃ 水溶液", category:"盐 · 水溶液", prompt:"把硝酸钾溶于水", conducts:true, why:"K⁺ 和 NO₃⁻ 在水中能够自由移动。导电条件不依赖某一种特定离子。" },
      { name:"NaOH 水溶液", category:"碱 · 水溶液", prompt:"氢氧化钠溶于水", conducts:true, why:"Na⁺ 和 OH⁻ 可以自由移动。碱的水溶液也可能导电。" },
      { name:"铜丝", category:"金属 · 固态", prompt:"把一段铜丝接入电路", conducts:true, why:"铜由自由电子导电。能导电并不代表它是电解质；铜是单质。" },
      { name:"熔融 NaCl", category:"盐 · 熔融态", prompt:"氯化钠加热熔化后的状态", conducts:true, why:"熔融后 Na⁺ 和 Cl⁻ 能自由移动，因此不靠水也能导电。" }
    ];
    const QUESTIONS = [
      { id:"Q_CH1_020", text:"固体 NaCl 不能导电，最关键的原因是什么？", options:["固体中没有 Na⁺ 和 Cl⁻","Na⁺ 和 Cl⁻ 不能自由移动","NaCl 不是电解质"], answer:1, errors:{0:"晶体中有离子，只是它们被束缚在晶格位置。",2:"NaCl 是电解质；要区分物质类别和当前状态能否导电。"} },
      { id:"Q_CH1_021", text:"NaCl 水溶液接通电路后，什么在定向迁移？", options:["Na⁺ 和 Cl⁻","水分子","NaCl 分子"], answer:0, errors:{1:"水是溶剂；这里主要由溶液中的离子承担导电。",2:"NaCl 溶于水后，形成分散的 Na⁺ 和 Cl⁻。"} },
      { id:"Q_CH1_022", text:"把 NaCl 换成 KCl 水溶液，最合理的预测是？", options:["不能导电，因为没有 Na⁺","能导电，因为有自由移动的 K⁺ 和 Cl⁻","只能在固态导电"], answer:1, errors:{0:"关键是自由移动的离子，不要求一定是 Na⁺。",2:"固体离子通常不能自由移动；水溶液中的离子可以。"} },
      { id:"Q_CH1_023", text:"把 NaCl 加热至熔融，接通电路后会怎样？", options:["不能导电，因为没有水","能导电，因为离子能够自由移动","不能导电，因为离子消失了"], answer:1, errors:{0:"水可以帮助 NaCl 晶体解离，但熔融也能让离子自由移动。",2:"熔融时 Na⁺ 和 Cl⁻ 仍然存在，并能移动。"} },
      { id:"Q_CH1_024", text:"HCl 气体与盐酸（HCl 水溶液）相比，哪一种说法正确？", options:["两者在通常条件下都靠 HCl 分子导电","盐酸能导电；HCl 气体通常不能，因为状态不同","HCl 气体能导电；盐酸不能"], answer:1, errors:{0:"盐酸中的可移动离子传递电荷，不是中性 HCl 分子。",2:"HCl 溶于水后形成可移动离子；通常条件下气态 HCl 没有足量自由离子。"} },
      { id:"Q_CH1_025", text:"稀硫酸水溶液能导电吗？", options:["能，其中有自由移动的离子","不能，因为它不是盐","只能在无水状态下导电"], answer:0, errors:{1:"酸的水溶液也能通过离子导电，导电不局限于盐。",2:"本题指定的是稀硫酸水溶液，其中存在可移动离子。"} },
      { id:"Q_CH1_026", text:"蔗糖水溶液与铜丝的判断，哪项正确？", options:["都属于电解质","蔗糖水溶液通常不明显导电；铜丝能由电子导电","蔗糖溶于水就一定强烈导电"], answer:1, errors:{0:"蔗糖是非电解质；铜是单质，也不属于电解质。",2:"溶解不等于电离。蔗糖主要以中性分子存在。"} },
      { id:"Q_CH1_027", text:"所谓“电解质水”里的“电解质”，通常指什么？", options:["能给身体像电池一样供电的能量","水中溶解的 Na⁺、K⁺、Cl⁻ 等离子","只有糖分子"], answer:1, errors:{0:"这些离子参与体液平衡和神经、肌肉功能，不是电池。",2:"糖可提供能量，但与钠、钾等离子的作用不同。"} },
      { id:"Q_CH1_028", text:"30 分钟普通活动后与长时间大量出汗后，关于补给哪句更合理？", options:["两者都必须买电解质水","前者通常喝水即可；后者可能需要补充电解质","后者无限量喝白水即可"], answer:1, errors:{0:"短时间普通活动通常喝水就足够；要结合实际出汗量。",2:"大量出汗后除了水还可能需要补充损失的离子，也不应无限量饮水。"} }
    ];
    const STORAGE_KEY = "chemistry-lab-ch1-ion-v0.4";
    const $ = id => document.getElementById(id);
    const state = { page:"dashboard", predict:null, scene:"crystal", seen:new Set(), sportAnswered:new Set(), sportCorrect:0, caseIndex:0, caseAnswered:false, caseCorrect:0, quizIndex:0, answers:[], complete:false, mastery:0 };
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
      $("dashboard-mastery").textContent = state.complete ? state.mastery + "%" : "—";
      $("dashboard-bar").style.width = state.mastery + "%";
      $("dashboard-status").textContent = state.complete ? "已完成本节。你可以再次练习。" : "完成本节后会更新。";
    }
    const PAGE_ORDER = ["predict","lab","explain","sport","compare","quiz","result"];
    function show(page) {
      state.page = page;
      $("dashboard").classList.toggle("active",page === "dashboard");
      $("lesson").hidden = page === "dashboard";
      PAGE_ORDER.forEach(id => $(id).classList.toggle("active",id === page));
      [...$("steps").children].forEach((node,index) => { node.className = "step" + (PAGE_ORDER[index] === page ? " active" : PAGE_ORDER.indexOf(page) > index ? " done" : ""); });
      [...$("nav-list").children].forEach((node,index) => node.classList.toggle("active", index === (page === "dashboard" ? 0 : page === "predict" || page === "lab" ? 1 : page === "explain" || page === "sport" || page === "compare" ? 2 : 3)));
      if (page === "lab") { resizeCanvas(); startAnimation(); } else stopAnimation();
      window.scrollTo({top:0,behavior:prefersReducedMotion ? "instant" : "smooth"});
    }
    function resetLesson() {
      state.predict = null; state.scene = "crystal"; state.seen = new Set(); state.sportAnswered.clear(); state.sportCorrect=0; state.caseIndex = 0; state.caseAnswered = false; state.caseCorrect = 0; state.quizIndex = 0; state.answers = [];
      [...$("predict-options").children].forEach(b => b.classList.remove("selected"));
      $("predict-feedback").hidden = true; $("to-lab").disabled = true;
      $("add-water").disabled = false; $("connect-circuit").disabled = true; $("to-explain").disabled = true;
      document.querySelectorAll(".sport-practice").forEach(card => { card.querySelectorAll("button").forEach(button => { button.disabled=false; button.className="option"; }); card.querySelector(".feedback").hidden=true; });
      $("to-compare").disabled=true;
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
    $("to-sport").addEventListener("click",() => show("sport"));
    const SPORT_ANSWERS={sweat:{answer:"no",explanation:"汗液带走水，也带走 Na⁺、Cl⁻ 和较少的 K⁺。"},choice:{answer:"different",explanation:"短时间普通运动通常喝水即可；长时间、炎热且大量出汗时，可能还需要补充钠等离子。是否需要取决于实际情境。"}};
    document.querySelectorAll(".sport-practice").forEach(card => card.addEventListener("click",event => {
      const button=event.target.closest("button[data-answer]");if(!button || state.sportAnswered.has(card.dataset.sport))return;
      const item=SPORT_ANSWERS[card.dataset.sport],correct=button.dataset.answer===item.answer;
      state.sportAnswered.add(card.dataset.sport);if(correct)state.sportCorrect++;
      card.querySelectorAll("button").forEach(option => { option.disabled=true; option.classList.toggle("correct",option.dataset.answer===item.answer); option.classList.toggle("incorrect",option===button && !correct); });
      const feedback=card.querySelector(".feedback");feedback.textContent=(correct?"判断正确。":"值得修正：")+item.explanation;feedback.className="feedback "+(correct?"good":"warn");feedback.hidden=false;
      if(state.sportAnswered.size===2)$("to-compare").disabled=false;
    }));
    $("to-compare").addEventListener("click",() => { state.caseIndex = 0; state.caseAnswered = false; state.caseCorrect = 0; renderCase(); show("compare"); });
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
        const crystalX = w * (.25 + col * .17), crystalY = h * (.25 + row * .17);
        const x = state.scene === "crystal" ? crystalX : 55 + ((i * 103 + 37) % Math.max(1,w - 110));
        const y = state.scene === "crystal" ? crystalY : 50 + ((i * 71 + 19) % Math.max(1,h - 100));
        return { type:(row+col)%2 ? "Cl⁻" : "Na⁺", x, y, vx:((i*17)%7-3)*.28, vy:((i*11)%5-2)*.25 };
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

    function renderCase() {
      const example = CASES[state.caseIndex];
      state.caseAnswered = false;
      $("case-count").textContent = "例子 " + (state.caseIndex + 1) + " / " + CASES.length;
      $("case-category").textContent = example.category;
      $("case-name").textContent = example.name;
      $("case-prompt").textContent = example.prompt;
      [...$("case-options").children].forEach(button => { button.disabled = false; button.className = "option"; });
      $("case-feedback").hidden = true;
      $("case-next").disabled = true;
      $("case-next").hidden = false;
      $("case-rule").hidden = true;
    }
    $("case-options").addEventListener("click",event => {
      const button = event.target.closest("button[data-case]");
      if (!button || state.caseAnswered) return;
      const example = CASES[state.caseIndex];
      const correct = (button.dataset.case === "yes") === example.conducts;
      state.caseAnswered = true;
      if (correct) state.caseCorrect++;
      [...$("case-options").children].forEach(b => { b.disabled = true; b.classList.toggle("selected",b === button); });
      $("case-feedback").textContent = (correct ? "判断正确。" : "这次预测需要修正。") + example.why;
      $("case-feedback").className = "feedback " + (correct ? "good" : "warn");
      $("case-feedback").hidden = false;
      if (state.caseIndex === CASES.length - 1) {
        $("case-next").hidden = true;
        $("case-rule").hidden = false;
      } else $("case-next").disabled = false;
    });
    $("case-next").addEventListener("click",() => {
      if (!state.caseAnswered || state.caseIndex >= CASES.length - 1) return;
      state.caseIndex++;
      renderCase();
    });

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
      $("quiz-feedback").textContent=correct ? "答对了。你依据物质状态和载流粒子作出了判断。" : "再想一步：" + q.errors[chosen] + " 正确答案是 " + String.fromCharCode(65+q.answer) + "。";
      $("quiz-feedback").className="feedback " + (correct ? "good" : "warn");
      $("quiz-feedback").hidden=false; $("quiz-next").disabled=false;
    });
    $("quiz-next").addEventListener("click",() => {
      if (state.answers[state.quizIndex] === undefined) return;
      if (state.quizIndex < QUESTIONS.length-1) { state.quizIndex++; renderQuestion(); return; }
      const correct=state.answers.filter(Boolean).length;
      state.mastery=Math.round(correct / QUESTIONS.length * 100);
      state.complete=true; save(); updateDashboard();
      $("result-score").textContent=state.mastery+"%"; $("result-bar").style.width=state.mastery+"%";
      const acidNeedsReview = [4,5].some(index => state.answers[index] === false);
      const boundaryNeedsReview = state.answers[6] === false;
      const sportNeedsReview=[7,8].some(index=>state.answers[index]===false);
      const advice = correct === QUESTIONS.length ? "你能把导电条件迁移到盐、酸和运动补水情境。" : sportNeedsReview ? "建议回看电解质水：离子不是给身体供电的电池，补给要结合出汗情境。" : acidNeedsReview ? "建议回看 HCl 气体、盐酸和稀硫酸的对比，先明确状态再判断。" : boundaryNeedsReview ? "建议再比较蔗糖水溶液与铜丝：溶解不等于电离，金属依靠电子导电。" : "建议回看晶体、水溶液和熔融态之间的离子运动差别。";
      $("result-summary").textContent="运动情境首次判断 " + state.sportCorrect + " / 2；对比例子首次预测 " + state.caseCorrect + " / " + CASES.length + " 个正确；迁移练习答对 " + correct + " / " + QUESTIONS.length + " 题。" + advice;
      const review=new Date(); review.setDate(review.getDate()+1);
      $("review-date").textContent="建议明天（" + new Intl.DateTimeFormat("zh-CN",{month:"numeric",day:"numeric"}).format(review) + "）不看答案，解释 KNO₃ 水溶液、盐酸和铜丝各由谁导电，再说说哪种运动情境需要额外补充电解质。";
      show("result");
    });
    load();
  