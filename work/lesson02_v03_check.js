
    "use strict";
    const $ = id => document.getElementById(id);
    const stages = ["observe","solubility","write","split","cancel","check","transfer","result"];
    const state = { stage:"dashboard", selectedSplit:new Set(), selectedCancel:new Set(), graded:{}, completed:{}, practiceAnswered:new Set(), practiceCorrect:0, best:0 };
    const STORAGE_KEY = "chemistry-lab-ch1-ionic-equation-v0.1";
    try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (stored && Number.isInteger(stored.best)) state.best = Math.max(0,Math.min(5,stored.best)); } catch (_) {}
    function show(stage) {
      state.stage = stage;
      $("dashboard").classList.toggle("active",stage === "dashboard");
      $("lesson").hidden = stage === "dashboard";
      stages.forEach(id => $(id).classList.toggle("active",id === stage));
      const current = stages.indexOf(stage);
      [...$("steps").children].forEach((node,index) => node.className = "step" + (index === current ? " active" : index < current ? " done" : ""));
      const sideStage={observe:1,solubility:2,write:3,split:4,cancel:5,check:6,transfer:6,result:6};
      [...$("side-list").children].forEach((node,index) => node.className = index === 0 ? (stage === "dashboard" ? "active" : "done") : index === sideStage[stage] ? "active" : index < (sideStage[stage] || 0) ? "done" : "");
      window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    }
    function note(id,message,good) { const box=$(id+"-feedback"); box.textContent=message; box.className="feedback "+(good ? "good" : "warn"); box.hidden=false; }
    function scoreFirst(id,correct) { if (!(id in state.graded)) state.graded[id]=!!correct; }
    function reset() {
      state.selectedSplit.clear(); state.selectedCancel.clear(); state.graded={}; state.completed={}; state.practiceAnswered.clear(); state.practiceCorrect=0;
      for (const id of ["observe","write","check","transfer"]) { [...$(id+"-options").children].forEach(b => { b.disabled=false; b.className="option"; }); $(id+"-feedback").hidden=true; }
      for (const id of ["split","cancel"]) { [...$(id+"-options").children].forEach(b => { b.className="option"; b.setAttribute("aria-pressed","false"); }); $(id+"-feedback").hidden=true; }
      for (const card of document.querySelectorAll(".practice-card")) { card.querySelectorAll("button").forEach(b => { b.disabled=false; b.className="option"; }); card.querySelector(".practice-feedback").hidden=true; }
      $("practice-summary").hidden=true;
      for (const id of ["to-write","to-write-from-solubility","to-split","to-cancel","to-check","to-transfer","to-result"]) $(id).disabled=true;
      show("observe");
    }
    $("start").addEventListener("click",reset); $("restart").addEventListener("click",reset);
    $("observe-options").addEventListener("click",event => {
      const b=event.target.closest("button[data-choice]"); if (!b || state.completed.observe) return;
      [...$("observe-options").children].forEach(x => x.classList.toggle("selected",x===b));
      note("observe",b.dataset.choice === "barium" ? "你的预测正确。Ba²⁺ 与 SO₄²⁻ 结合形成难溶的 BaSO₄。" : "先记下这个预测：白色沉淀是难溶的 BaSO₄，稍后会用方程式验证。",b.dataset.choice === "barium");
      state.completed.observe=true; $("to-write").disabled=false;
    });
    const practiceAnswers={
      silver:{correct:"agcl",message:"AgCl 难溶，形成白色沉淀；NaNO₃ 属于可溶的硝酸盐。"},
      none:{correct:"none",message:"Na⁺、K⁺、Cl⁻、NO₃⁻ 在本例中都留在溶液里；没有沉淀生成，也没有这类净离子反应。"},
      carbonate:{correct:"caco3",message:"CaCO₃ 难溶，形成白色沉淀；NaCl 可溶，留在溶液中。"}
    };
    document.querySelectorAll(".practice-card").forEach(card => card.addEventListener("click",event => {
      const button=event.target.closest("button[data-answer]"); if(!button || state.practiceAnswered.has(card.dataset.practice)) return;
      const answer=practiceAnswers[card.dataset.practice], correct=button.dataset.answer===answer.correct;
      state.practiceAnswered.add(card.dataset.practice); if(correct)state.practiceCorrect++;
      card.querySelectorAll("button").forEach(b => { b.disabled=true; b.classList.toggle("correct",b.dataset.answer===answer.correct); b.classList.toggle("wrong",b===button && !correct); });
      const feedback=card.querySelector(".practice-feedback");feedback.textContent=(correct?"判断正确。":"再看一次规律：")+answer.message;feedback.className="practice-feedback "+(correct?"good":"warn");feedback.hidden=false;
      if(state.practiceAnswered.size===3){$("practice-summary").textContent="三组已完成，首次判断正确 "+state.practiceCorrect+" / 3。接下来用同一规律写本题的方程式。";$("practice-summary").hidden=false;$("to-write-from-solubility").disabled=false;}
    }));
    function choiceStage(id,correctIndex,explainWrong,nextButton) {
      $(id+"-options").addEventListener("click",event => {
        const b=event.target.closest("button[data-answer]"); if (!b || state.completed[id]) return;
        const choice=Number(b.dataset.answer), correct=choice===correctIndex;
        scoreFirst(id,correct);
        [...$(id+"-options").children].forEach((x,index) => { x.classList.toggle("selected",x===b); x.classList.toggle("correct",correct && x===b); x.classList.toggle("wrong",!correct && x===b); });
        note(id,correct ? ({write:"正确。系数 2 保证两边 Na、Cl 的原子数相等。",check:"正确。原子数与电荷总数都守恒。",transfer:"正确。Na⁺ 和 NO₃⁻ 没有参加沉淀生成。"})[id] : explainWrong[choice],correct);
        if (correct) { state.completed[id]=true; [...$(id+"-options").children].forEach(x=>x.disabled=true); $(nextButton).disabled=false; }
      });
    }
    choiceStage("write",1,{0:"右侧 NaCl 需要系数 2，才能与左侧 2 个 Na 和 2 个 Cl 对应。",2:"BaCl₂ 不会成为新沉淀；Ba²⁺ 与 SO₄²⁻ 结合形成 BaSO₄。"},"to-split");
    choiceStage("check",0,{1:"左侧电荷 +2 与 −2 相加为 0，右侧中性沉淀的电荷也是 0。",2:"Ba、S、O 的原子数在两侧也完全相同。"},"to-transfer");
    choiceStage("transfer",0,{1:"AgNO₃ 在水中可溶；难溶的白色沉淀是 AgCl。",2:"这仍是完整离子反应的思路；Na⁺ 与 NO₃⁻ 是旁观离子，应从两侧删去。"},"to-result");
    function toggleSelection(id,set) { $(id+"-options").addEventListener("click",event => { const b=event.target.closest("button[data-item]"); if (!b || state.completed[id]) return; const value=b.dataset.item; if (set.has(value)) set.delete(value); else set.add(value); b.classList.toggle("selected",set.has(value)); b.setAttribute("aria-pressed",String(set.has(value))); }); }
    toggleSelection("split",state.selectedSplit); toggleSelection("cancel",state.selectedCancel);
    function sameSet(a,expected) { return a.size===expected.length && expected.every(x=>a.has(x)); }
    $("check-split").addEventListener("click",() => {
      if (state.completed.split) return;
      const correct=sameSet(state.selectedSplit,["bacl2","na2so4","nacl"]); scoreFirst("split",correct);
      if (correct) { state.completed.split=true; note("split","正确。BaCl₂、Na₂SO₄ 和 NaCl 都是本例的可溶性强电解质；BaSO₄ 是沉淀，应保留化学式。","good"); $("to-cancel").disabled=false; }
      else note("split",state.selectedSplit.has("baso4") ? "BaSO₄ 是难溶沉淀，不能拆成游离离子。取消它，再检查其他三种物质。" : "检查两侧的物质：本例中所有标注 (aq) 的可溶性强电解质都应拆开。",false);
    });
    $("check-cancel").addEventListener("click",() => {
      if (state.completed.cancel) return;
      const correct=sameSet(state.selectedCancel,["cl","na"]); scoreFirst("cancel",correct);
      if (correct) { state.completed.cancel=true; note("cancel","正确。Na⁺ 和 Cl⁻ 在两侧都保持不变；留下 Ba²⁺ 与 SO₄²⁻ 形成沉淀。",true); $("to-check").disabled=false; }
      else note("cancel",state.selectedCancel.has("ba") || state.selectedCancel.has("so4") ? "Ba²⁺ 和 SO₄²⁻ 结合成沉淀，实际参与了反应，不能删去。" : "找出在方程式两侧都出现、数量和电荷都不变的离子。",false);
    });
    const transitions=[["to-write","solubility"],["to-write-from-solubility","write"],["to-split","split"],["to-cancel","cancel"],["to-check","check"],["to-transfer","transfer"]];
    transitions.forEach(([button,page]) => $(button).addEventListener("click",() => show(page)));
    $("to-result").addEventListener("click",() => {
      const earned=Object.values(state.graded).filter(Boolean).length;
      state.best=Math.max(state.best,earned);
      try { localStorage.setItem(STORAGE_KEY,JSON.stringify({best:state.best,completedAt:new Date().toISOString()})); } catch (_) {}
      $("score").textContent=earned+" / 5"; $("score-bar").style.width=(earned*20)+"%";
      $("result-summary").textContent=earned===5 ? "五个关键步骤都在首次判断中完成。你已经能把方法迁移到另一种沉淀反应。" : "你完成了整条推理链。首次判断正确 "+earned+" 步；建议再练一次，留意拆分与旁观离子的选择。";
      show("result");
    });
  