(() => {
  "use strict";
  const course = window.CHEMISTRY_SHORT_COURSE;
  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
  const stepIds = ["intro","map","compare","worked","memory","q1","q2","q3","summary"];
  const labels = ["提出问题","沿原图定位","比较样品","跟着示范","记忆卡","第 1 题 · 定义","第 2 题 · 反例","第 3 题 · 迁移","本节小结"];
  const findLesson = (id) => course.lessons.find((lesson) => lesson.id === id);
  const reviewDate = (time) => new Intl.DateTimeFormat("zh-CN", {month:"long",day:"numeric"}).format(new Date(time));

  window.createChemistryCoursePlayer = ({ root, getData, save, openGlossary, goHome, goNext, showSimulation, askTutor, onStep }) => {
    let lesson = null;
    let step = "home";
    let sampleIndex = 0;
    let mapLevel = 0;
    let memoryHidden = false;
    let returningTo = null;

    function record() {
      const data = getData();
      const existing = data.lessons[lesson.id];
      if (existing && typeof existing === "object") {
        existing.visited ||= [];
        existing.answers ||= {};
        existing.drafts ||= {};
        existing.help ||= {};
        existing.skipped ||= {};
        return existing;
      }
      return data.lessons[lesson.id] = { step:"home", visited:[], answers:{}, drafts:{}, help:{}, skipped:{}, memorySaved:false, review:null };
    }
    function saveRecord() {
      record().step = step;
      getData().lastLesson = lesson.id;
      save();
    }
    function renderNav() {
      const r = record();
      return `<nav class="sc-nav" aria-label="本节步骤"><button type="button" data-sc-go="home" class="${step === "home" ? "active" : ""}">本节首页</button>${stepIds.map((id,index) => `<button type="button" data-sc-go="${id}" aria-current="${step === id ? "step" : "false"}" class="${step === id ? "active" : ""}">${r.visited.includes(id) ? "✓ " : ""}${labels[index]}</button>`).join("")}<button type="button" data-sc-go="lecture" class="${step === "lecture" ? "active" : ""}">完整讲义</button></nav>`;
    }
    function source() {
      const ref = lesson.examRef;
      return `<p class="sc-source">本课三道交互题均为课程原创。<a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ref.label)}</a>用于核对命题方向；下方另列已核对题号的历年题。</p>`;
    }
    function examEvidence() {
      const cases = lesson.examCases || [];
      return `<section class="sc-exam" aria-label="历年高考题对应"><h3>真实高考题怎样考</h3><p class="sc-small">只概述考点，不把课程题冒充原题。“相关”表示可迁移，但原题没有直接问本课定义。</p>${cases.map((item) => `<div class="sc-exam-item"><p><strong><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a></strong> · ${escapeHtml(item.fit)} · ${escapeHtml(item.source)}</p><p>原题情境：${escapeHtml(item.topic)}</p><dl><dt>考点</dt><dd>${escapeHtml(item.point)}</dd><dt>记忆方法</dt><dd>${escapeHtml(item.remember)}</dd><dt>举一反三</dt><dd>${escapeHtml(item.transfer)}</dd></dl></div>`).join("")}${lesson.examGap ? `<p class="sc-note">${escapeHtml(lesson.examGap)}</p>` : ""}</section>`;
    }
    function image() {
      if (!lesson.image) return `<div class="sc-relation" role="note"><strong>本课文字关系</strong><p>${escapeHtml(lesson.map)}</p></div>`;
      return `<figure class="sc-image"><button type="button" data-sc-image aria-label="放大查看本课原课件图"><img src="/assets/${escapeHtml(lesson.image)}.png" alt="${escapeHtml(lesson.title)}相关原课件图，可点击放大"></button><figcaption>用户提供的课件原图，保持完整比例。图加载失败时可读下方文字关系。</figcaption></figure><p class="sc-relation">${escapeHtml(lesson.map)}</p>`;
    }
    function termButtons() {
      const glossary = window.CHEMISTRY_PRODUCT_V1.glossary;
      return `<div class="sc-terms"><strong>遇到词不会，随时查：</strong>${lesson.terms.map((id) => {
        const item = glossary.find((term) => term.id === id);
        return item ? `<button type="button" data-sc-term="${escapeHtml(id)}">${escapeHtml(item.term)}</button>` : "";
      }).join("")}</div>`;
    }
    function card(title, body, badge = "") {
      return `<article class="sc-card"><div class="sc-card-top"><span class="sc-eyebrow">学习一个问题 ${badge}</span><span class="sc-count">${stepIds.includes(step) ? `${stepIds.indexOf(step)+1} / 9` : ""}</span></div><h2>${title}</h2>${body}</article>`;
    }
    function footer() {
      const index = stepIds.indexOf(step);
      if (index < 0) return "";
      const prev = index === 0 ? "home" : stepIds[index-1];
      const next = index === stepIds.length-1 ? "home" : stepIds[index+1];
      return `<div class="sc-footer"><button type="button" class="sc-button secondary" data-sc-go="${prev}">← ${prev === "home" ? "本节首页" : "上一步"}</button><button type="button" class="sc-button" data-sc-go="${next}">${next === "home" ? "回本节首页" : "继续下一步 →"}</button></div>`;
    }
    function home() {
      const r = record();
      const hasVisit = r.visited.some((id) => stepIds.includes(id) && id !== "summary");
      return `<section class="sc-hero"><span class="sc-eyebrow">${escapeHtml(course.groups.find((g) => g.id === lesson.group)?.title || "")} · 约 ${lesson.minutes} 分钟</span><h1>${escapeHtml(lesson.question)}</h1><p>${escapeHtml(lesson.intro)}</p><div class="sc-actions"><button type="button" class="sc-button" data-sc-go="${hasVisit ? escapeHtml(r.lastRead || "intro") : "intro"}">${hasVisit ? "回到上次阅读位置 →" : "按步骤开始 →"}</button><button type="button" class="sc-button secondary" data-sc-go="lecture">看完整讲义</button><button type="button" class="sc-button quiet" data-sc-go="q1">直接练三题</button></div><p class="sc-small">可以随时跳步、查词、看解析。读过与会独立做题分别记录。</p></section><article class="sc-card"><span class="sc-eyebrow">本课带走什么</span><h2>${escapeHtml(lesson.definition)}</h2><p>${escapeHtml(lesson.mnemonic)}</p>${termButtons()}${source()}${examEvidence()}</article>`;
    }
    function intro() {
      return card(escapeHtml(lesson.question), `<p class="sc-lead">${escapeHtml(lesson.intro)}</p><div class="sc-note"><strong>忘了初中基础？</strong><p>${escapeHtml(lesson.prior)}</p></div><button type="button" class="sc-button secondary" data-sc-go="lecture">也可以直接读完整讲义</button>`);
    }
    function map() {
      const first = mapLevel === 0;
      return card("先在原图上找到这一课", `<p class="sc-lead">先看知识属于哪一个分支，再用文字关系读清判据。</p>${image()}<div class="sc-segment"><button type="button" data-sc-map="0" aria-pressed="${first}">看原图与关系</button><button type="button" data-sc-map="1" aria-pressed="${!first}">要注意的边界</button></div><div class="sc-relation" aria-live="polite">${escapeHtml(first ? lesson.map : lesson.boundary)}</div>`);
    }
    function compare() {
      const selected = lesson.samples[sampleIndex] || lesson.samples[0];
      return card("换一份样品，结论会变吗？", `<p class="sc-lead">切换样品，注意条件、组成和结论怎样一起改变。</p><div class="sc-sample-grid">${lesson.samples.map((s,index) => `<button type="button" class="sc-sample" data-sc-sample="${index}" aria-pressed="${index === sampleIndex}"><strong>${escapeHtml(s[0])}</strong><span>看组成与判断 →</span></button>`).join("")}</div><div class="sc-relation" aria-live="polite"><strong>${escapeHtml(selected[0])}</strong><p>${escapeHtml(selected[1])}</p><p>${escapeHtml(selected[2])}</p></div>${termButtons()}`);
    }
    function worked() {
      const simulation = ["b1","b2"].includes(lesson.id) ? "conductivity" : ["b3","b4"].includes(lesson.id) ? "precipitation" : null;
      return card("老师怎样一步步判断？", `<p class="sc-lead">示范先给完整推理。你可以逐条核对，也可以直接进入练习。</p><ol class="sc-steps">${lesson.worked.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol><div class="sc-note"><strong>改变条件再想一次</strong><p>${escapeHtml(lesson.boundary)}</p></div>${examEvidence()}${simulation ? `<button type="button" class="sc-button secondary" data-sc-simulation="${simulation}">打开相关粒子模拟 →</button>` : ""}${lesson.history ? `<details class="sc-extra"><summary>${escapeHtml(lesson.history.title)}</summary><p>${escapeHtml(lesson.history.body)}</p><a href="${escapeHtml(lesson.history.url)}" target="_blank" rel="noopener noreferrer">资料：${escapeHtml(lesson.history.label)}</a></details>` : ""}${lesson.life ? `<details class="sc-extra"><summary>${escapeHtml(lesson.life.title)}</summary><p>${escapeHtml(lesson.life.body)}</p><a href="${escapeHtml(lesson.life.url)}" target="_blank" rel="noopener noreferrer">资料：${escapeHtml(lesson.life.label)}</a></details>` : ""}`);
    }
    function memory() {
      const r = record();
      return card("把判断依据记下来", `<p class="sc-lead">先能说出定义和关键词，再用新题检查。</p><div class="sc-memory"><strong>${escapeHtml(lesson.mnemonic)}</strong><p>${memoryHidden ? "先遮住答案，在心里复述本课必记句。" : escapeHtml(lesson.definition)}</p></div><div class="sc-actions"><button type="button" class="sc-button secondary" data-sc-action="toggle-memory">${memoryHidden ? "显示定义" : "遮住，自行回想"}</button><button type="button" class="sc-button quiet" data-sc-action="save-memory">${r.memorySaved ? "已收藏记忆卡 ✓" : "收藏记忆卡"}</button></div><p class="sc-small">遮住回想不计分。答不出可立即显示，再决定是否练习。</p>`);
    }
    function question(index) {
      const id = `q${index+1}`;
      const q = lesson.questions[index];
      const r = record();
      const answer = r.answers[id];
      const draft = r.drafts[id];
      const choices = q.options.map((option,i) => `<button type="button" class="sc-option" data-sc-choice="${i}" aria-pressed="${draft === i}" ${answer ? "disabled" : ""}>${escapeHtml(option)}</button>`).join("");
      let content = `<p class="sc-source">本题为课程原创 · ${escapeHtml(q.role)}。相关考查方向见本课首页来源说明。</p><p class="sc-stem">${escapeHtml(q.stem)}</p><div class="sc-options">${choices}</div>`;
      if (answer) {
        const correct = answer.choice === q.answer;
        content += `<div class="sc-feedback ${correct ? "" : "wrong"}" aria-live="polite"><strong>${answer.revealed ? "已直接看解析" : correct ? "首次判断正确" : "首次判断需要修正"}</strong><p>正确结论：${escapeHtml(q.options[q.answer])}。${escapeHtml(q.why)}</p><dl><dt>考什么</dt><dd>${escapeHtml(q.point)}</dd><dt>要记什么</dt><dd>${escapeHtml(q.remember)}</dd><dt>怎样变形</dt><dd>${escapeHtml(q.change)}</dd></dl>${!correct && !answer.revealed ? `<p><strong>可能的卡点：</strong>${escapeHtml(q.wrong)} <button type="button" class="sc-link-button" data-sc-action="mark-slip">${answer.selfCorrection ? "已标记：只是看错题" : "我只是看错题"}</button></p>` : ""}<p class="sc-small">${answer.helped || answer.revealed ? "本题在回答前看过提示或解析，不计为无提示首答。" : "这只说明这一题的首次表现，尚未证明整个知识点掌握。"}</p><button type="button" class="sc-button secondary" data-sc-go="compare">回到样品对照</button></div>`;
      } else {
        content += `<div class="sc-actions"><button type="button" class="sc-button" data-sc-action="submit" ${draft === undefined ? "disabled" : ""}>提交本题</button><button type="button" class="sc-button quiet" data-sc-action="hint">${r.help[id] ? "提示已展开" : "看一条提示"}</button><button type="button" class="sc-button quiet" data-sc-action="reveal">直接看答案</button><button type="button" class="sc-button quiet" data-sc-action="skip">先跳过</button></div>${r.help[id] ? `<div class="sc-note">先确认题目要判断的对象，再找对应判据：${escapeHtml(lesson.mnemonic)}</div>` : ""}`;
      }
      return card(escapeHtml(q.role) + " · " + escapeHtml(lesson.title), content, "· 第 " + (index+1) + " 题");
    }
    function summary() {
      const r = record();
      const read = ["intro","map","compare","worked","memory"].filter((id) => r.visited.includes(id)).length;
      const answers = Object.values(r.answers);
      const independent = answers.filter((a) => a.correct && !a.helped && !a.revealed).length;
      const reviewed = answers.filter((a) => a.revealed).length;
      const review = r.review;
      const reviewPlan = review?.lastAttempt
        ? `<div class="sc-review-plan"><strong>本节未见复习题已用过</strong><p>已记录这一次间隔表现。同题不能再次充当新的独立证据；需要继续验证时请使用教师审定的新题。</p></div>`
        : `<div class="sc-review-plan"><strong>给这节安排一次新题复习</strong><p>${review?.dueAt ? `当前安排：${reviewDate(review.dueAt)}。可以随时改日期。` : "目前没有安排；不自动生成待办。"}</p><div class="sc-actions"><button type="button" data-sc-days="1">明天</button><button type="button" data-sc-days="3">3 天后</button><button type="button" data-sc-days="7">7 天后</button>${review?.dueAt ? '<button type="button" data-sc-action="cancel-review">取消安排</button>' : ""}</div></div>`;
      return card("这节读了什么，还要怎样验证？", `<div class="sc-status"><div><strong>讲解</strong><p>看过 ${read} / 5 个讲解步骤。</p></div><div><strong>练习</strong><p>提交 ${answers.filter((a) => !a.revealed).length} / 3 题；${independent} 题无提示首答正确。${reviewed ? `另有 ${reviewed} 题直接看了解析。` : ""}</p></div><div><strong>间隔后验证</strong><p>${review?.lastAttempt ? `最近一次：${review.lastAttempt.correct ? "本题独立答对" : "本题需要复看"}。` : "尚无间隔后的新题表现。"}不显示“已掌握”。</p></div></div><div class="sc-memory"><strong>本课必记</strong><p>${escapeHtml(lesson.definition)}</p></div><p>下一短课可以继续，也可自由回看。复习日期由你自己决定。</p><div class="sc-actions"><button type="button" class="sc-button secondary" data-sc-go="map">回看原图</button><button type="button" class="sc-button secondary" data-sc-go="q1">补做三题</button><button type="button" class="sc-button" data-sc-action="next-lesson">下一短课 →</button></div>${reviewPlan}${source()}`);
    }
    function lecture() {
      return `<article class="sc-card sc-lecture"><span class="sc-eyebrow">自主阅读 · ${escapeHtml(lesson.title)}</span><h2>${escapeHtml(lesson.question)}</h2><p>${escapeHtml(lesson.intro)}</p><h3>基础回顾</h3><p>${escapeHtml(lesson.prior)}</p><h3>原图与关系</h3>${image()}<h3>正例、反例与条件</h3><div class="sc-sample-grid">${lesson.samples.map((s) => `<div class="sc-sample static"><strong>${escapeHtml(s[0])}</strong><p>${escapeHtml(s[1])}</p><p>${escapeHtml(s[2])}</p></div>`).join("")}</div><h3>完整示范</h3><ol class="sc-steps">${lesson.worked.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol><h3>必须记住</h3><div class="sc-memory"><p>${escapeHtml(lesson.definition)}</p><p>${escapeHtml(lesson.mnemonic)}</p></div><p class="sc-note">${escapeHtml(lesson.boundary)}</p>${termButtons()}${examEvidence()}${source()}<div class="sc-actions"><button type="button" class="sc-button" data-sc-go="${escapeHtml(record().lastRead || "intro")}">回到分步讲解</button><button type="button" class="sc-button secondary" data-sc-go="q1">开始三题训练</button></div></article>`;
    }
    function review() {
      const r = record();
      const q = lesson.review;
      const result = r.review?.lastAttempt;
      return card("间隔后，用新题检验一次", `<p class="sc-lead">本题为课程原创复习题。提交后记录这一题的表现，不推断整节永久掌握。</p><p class="sc-stem">${escapeHtml(q.stem)}</p><div class="sc-options">${q.options.map((o,i) => `<button type="button" class="sc-option" data-sc-review="${i}" ${result ? "disabled" : ""}>${escapeHtml(o)}</button>`).join("")}</div>${result ? `<div class="sc-feedback ${result.correct ? "" : "wrong"}"><strong>${result.correct ? "本次独立回答正确" : "本次需要复看"}</strong><p>${escapeHtml(q.why)}</p><p class="sc-small">下次若需要再次验证，应使用另一道未见题；此处不会重复记为新的独立证据。</p></div>` : ""}<div class="sc-actions"><button type="button" class="sc-button secondary" data-sc-go="summary">回本节小结</button></div>`);
    }
    function render() {
      if (!lesson) return;
      const views = {home, intro, map, compare, worked, memory, q1:() => question(0), q2:() => question(1), q3:() => question(2), summary, lecture, review};
      root.innerHTML = `<div class="sc-breadcrumb"><button type="button" data-sc-action="product-home">全部课程</button> / ${escapeHtml(lesson.title)}</div><div class="sc-layout"><aside class="sc-rail">${renderNav()}</aside><div class="sc-main" id="sc-main" role="region" aria-label="本节学习内容" tabindex="-1">${views[step]?.() || home()}${footer()}<details class="sc-extra sc-tutor"><summary>有疑问时再问 AI 导师（可选）</summary><p>导师回答由已连接的模型生成，请用本课定义和解析核对。提问会发送给模型服务；在题目中提问会标记为使用帮助。</p><label for="sc-tutor-question">我的问题（可留空）</label><textarea id="sc-tutor-question" maxlength="300" placeholder="例如：为什么这个反例不满足定义？"></textarea><div class="sc-actions"><button type="button" class="sc-button secondary" data-sc-tutor="explain">直接讲清楚</button><button type="button" class="sc-button secondary" data-sc-tutor="hint">给一点提示</button><button type="button" class="sc-button secondary" data-sc-tutor="example">换个例子</button></div><div id="sc-tutor-answer" role="status" aria-live="polite"></div></details></div></div>`;
    }
    function mount(lessonId, options = {}) {
      lesson = findLesson(lessonId);
      if (!lesson) return false;
      const r = record();
      step = options.step && (stepIds.includes(options.step) || ["home","lecture","review"].includes(options.step)) ? options.step : r.step || "home";
      sampleIndex = 0; mapLevel = 0; memoryHidden = false;
      saveRecord(); render();
      return true;
    }
    function navigate(next, options = {}) {
      if (!lesson || !(stepIds.includes(next) || ["home","lecture","review"].includes(next))) return;
      step = next;
      const r = record();
      if (stepIds.includes(next) && !r.visited.includes(next)) r.visited.push(next);
      if (["intro","map","compare","worked","memory"].includes(next)) r.lastRead = next;
      saveRecord(); render();
      onStep?.(lesson.id, next);
      if (options.focus !== false) byId("sc-main")?.focus({preventScroll:true});
      window.scrollTo({top:0,behavior:"smooth"});
    }
    function showReview(lessonId) {
      if (!mount(lessonId, {step:"review"})) return false;
      navigate("review");
      return true;
    }
    root.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !lesson) return;
      const r = record();
      if (button.dataset.scGo) { navigate(button.dataset.scGo); return; }
      if (button.dataset.scTerm) { openGlossary(button.dataset.scTerm, button); return; }
      if (button.dataset.scSimulation) { showSimulation(button.dataset.scSimulation); return; }
      if (button.dataset.scImage !== undefined) {
        returningTo = button;
        const dialog = byId("course-image-dialog");
        dialog.querySelector("img").src = `/assets/${lesson.image}.png`;
        dialog.querySelector("img").alt = `${lesson.title}原课件完整图`;
        dialog.showModal();
        return;
      }
      if (button.dataset.scSample !== undefined) { sampleIndex = Number(button.dataset.scSample); render(); return; }
      if (button.dataset.scMap !== undefined) { mapLevel = Number(button.dataset.scMap); render(); return; }
      if (button.dataset.scChoice !== undefined && /^q[123]$/.test(step) && !r.answers[step]) {
        r.drafts[step] = Number(button.dataset.scChoice); saveRecord(); render(); return;
      }
      if (button.dataset.scDays !== undefined) {
        if (r.review?.lastAttempt) return;
        const days = Number(button.dataset.scDays);
        r.review = {dueAt:Date.now()+days*86400000,scheduledAt:Date.now(),intervalDays:days,lastAttempt:null};
        saveRecord(); render(); return;
      }
      if (button.dataset.scReview !== undefined && step === "review" && !r.review?.lastAttempt) {
        const choice = Number(button.dataset.scReview);
        r.review ||= {};
        r.review.lastAttempt = {choice,correct:choice === lesson.review.answer,at:Date.now(),contentRevision:course.revision};
        r.review.dueAt = null;
        getData().attempts.push({unitId:lesson.id,itemId:`${lesson.id}:review`,choice,correct:r.review.lastAttempt.correct,delayed:true,helpUsed:false,contentRevision:course.revision,occurredAt:r.review.lastAttempt.at});
        saveRecord(); render(); return;
      }
      const action = button.dataset.scAction;
      if (action === "product-home") { goHome(); return; }
      if (button.dataset.scTutor) {
        const question = byId("sc-tutor-question")?.value.trim() || `请解释“${lesson.title}”的当前步骤。`;
        const output = byId("sc-tutor-answer");
        if (/^q[123]$/.test(step) && !r.answers[step]) { r.help[step] = true; saveRecord(); }
        button.disabled = true; output.textContent = "导师正在回答……";
        askTutor(lesson, question, button.dataset.scTutor).then((answer) => { if (output.isConnected) output.textContent = answer; }).catch((error) => { if (output.isConnected) output.textContent = error.message || "导师暂时不可用。"; }).finally(() => { if (button.isConnected) button.disabled = false; });
        return;
      }
      if (action === "next-lesson") { goNext(lesson.id); return; }
      if (action === "toggle-memory") { memoryHidden = !memoryHidden; render(); return; }
      if (action === "save-memory") { r.memorySaved = !r.memorySaved; saveRecord(); render(); return; }
      if (action === "cancel-review") { r.review = null; saveRecord(); render(); return; }
      if (!/^q[123]$/.test(step) || r.answers[step]) {
        if (action === "mark-slip" && /^q[123]$/.test(step) && r.answers[step]) { r.answers[step].selfCorrection = true; saveRecord(); render(); }
        return;
      }
      if (action === "hint") { r.help[step] = true; saveRecord(); render(); return; }
      if (action === "skip") { r.skipped[step] = true; saveRecord(); navigate(step === "q3" ? "summary" : `q${Number(step[1])+1}`); return; }
      if (action === "submit" && r.drafts[step] !== undefined) {
        const question = lesson.questions[Number(step[1])-1];
        const choice = r.drafts[step];
        const answer = {choice,correct:choice === question.answer,helped:Boolean(r.help[step]),revealed:false,at:Date.now(),contentRevision:course.revision};
        r.answers[step] = answer;
        getData().attempts.push({unitId:lesson.id,itemId:`${lesson.id}:${step}`,choice,correct:answer.correct,helpUsed:answer.helped,firstForItem:true,contentRevision:course.revision,occurredAt:answer.at});
        saveRecord(); render(); return;
      }
      if (action === "reveal") {
        r.answers[step] = {choice:null,correct:false,helped:true,revealed:true,at:Date.now(),contentRevision:course.revision};
        saveRecord(); render();
      }
    });
    byId("course-image-dialog-close").addEventListener("click", () => byId("course-image-dialog").close());
    byId("course-image-dialog").addEventListener("close", () => { if (returningTo?.isConnected) returningTo.focus(); });
    return { mount, navigate, showReview, current:() => lesson?.id || null };
  };
})();
