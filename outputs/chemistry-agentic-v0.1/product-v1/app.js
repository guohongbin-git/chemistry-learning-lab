(() => {
  "use strict";

  const PRODUCT = window.CHEMISTRY_PRODUCT_V1;
  const COURSE = window.CHEMISTRY_SHORT_COURSE;
  const DATA_PREFIX = "chemistry-learning-product-v1:";
  const PROFILES_KEY = "chemistry-learning-product-v1:profiles";
  const ACTIVE_PROFILE_KEY = "chemistry-learning-product-v1:active-profile";
  const byId = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
  const blankData = () => ({ version: 1, attempts: [], progress: {}, reviews: {}, lessons: {}, examCases: [], simulation: {}, lastUnit: null, lastLesson: null, activeRoute: null });
  const defaultSimulation = () => ({ sample:"nacl-aq", amount:1, playing:false, mix:"baso4", mixed:false });
  function readProfiles() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILES_KEY) || "null");
      if (Array.isArray(saved) && saved.length && saved.every((profile) => profile.id && profile.label)) return saved;
      const initial = [{ id:"learner-1", label:"学习者 1" }];
      localStorage.setItem(PROFILES_KEY, JSON.stringify(initial));
      return initial;
    } catch { return [{ id:"learner-1", label:"学习者 1" }]; }
  }
  function readActiveProfileId() {
    try { return localStorage.getItem(ACTIVE_PROFILE_KEY); }
    catch { return null; }
  }
  let profiles = readProfiles();
  const savedProfileId = readActiveProfileId();
  let activeProfileId = profiles.some((profile) => profile.id === savedProfileId)
    ? savedProfileId
    : profiles[0].id;
  let KEY = `${DATA_PREFIX}${activeProfileId}`;
  let data = loadData();
  let activeView = "home";
  let activeUnit = null;
  let precheckChoice = null;
  let precheckExpanded = false;
  let practiceChoice = null;
  let transferChoice = null;
  let practiceReason = "";
  let transferReason = "";
  let activeHint = false;
  let itemSupportUsed = false;
  let tutorSessionId = null;
  let shortTutorSession = { key:null, id:null };
  let simState = {...defaultSimulation(),...data.simulation,playing:false};
  let simulationReturnLesson = null;
  let toastTimer = 0;
  let coursePlayer = null;
  let restoringHistory = false;
  let glossaryReturnFocus = null;
  let examDraftFile = null;
  let examPreviewUrl = null;
  let examDetailUrl = null;
  let examEditingId = null;

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!stored || stored.version !== 1 || !Array.isArray(stored.attempts)) return blankData();
      return { ...blankData(), ...stored, progress: stored.progress || {}, reviews: stored.reviews || {}, lessons: stored.lessons || {}, examCases: stored.examCases || [] };
    } catch { return blankData(); }
  }

  function saveData() {
    data.attempts = data.attempts.slice(-1800);
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { showToast("浏览器暂时无法保存进度；本次页面仍可继续学习。"); }
    renderHomeIfVisible();
    renderNav();
  }

  function saveSimulationState() {
    const {sample,amount,mix,mixed} = simState;
    data.simulation = {sample,amount,mix,mixed};
    saveData();
  }

  function persistRoute(route) {
    data.activeRoute = route;
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { showToast("暂时无法记住离开时的位置；仍可继续阅读。"); }
    if (!restoringHistory && JSON.stringify(history.state?.chemistryRoute) !== JSON.stringify(route)) {
      history.pushState({chemistryRoute:route}, "", location.href);
    }
  }

  function showToast(message) {
    const toast = byId("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function unitById(id) { return PRODUCT.units.find((unit) => unit.id === id); }
  function progressFor(id) { return data.progress[id] ||= {}; }
  function firstAttemptFor(unitId, itemId) { return data.attempts.find((attempt) => attempt.unitId === unitId && attempt.itemId === itemId) || null; }
  function attemptsFor(unitId) { return data.attempts.filter((attempt) => attempt.unitId === unitId); }
  function reviewQuestions(unit) { return unit.reviewQuestions || (unit.review ? [unit.review] : []); }
  function nextReviewQuestion(unit) {
    const questions = reviewQuestions(unit);
    if (!questions.length) return null;
    const questionIds = new Set(questions.map((question) => question.id));
    const completed = attemptsFor(unit.id).filter((attempt) => attempt.delayed && questionIds.has(attempt.itemId)).length;
    return questions[completed % questions.length];
  }
  function localDate(timestamp) { return new Intl.DateTimeFormat("zh-CN", { month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" }).format(new Date(timestamp)); }

  function nextRecommendation() {
    const now = Date.now();
    const dueLesson = COURSE.lessons.find((lesson) => {
      const review = data.lessons[lesson.id]?.review;
      return review?.dueAt && !review.lastAttempt && review.dueAt <= now;
    });
    if (dueLesson) return { type:"lesson-review", label:`到期新题：${dueLesson.title}`, detail:"用一题新表述检验间隔后的回忆；你可以先复看讲解。", lessonId:dueLesson.id };
    if (data.lastLesson) {
      const lesson = COURSE.lessons.find((item) => item.id === data.lastLesson);
      if (lesson) {
        const step = data.lessons[lesson.id]?.step || "home";
        return { type:"lesson", label:`回到「${lesson.title}」`, detail:`上次停在“${step === "home" ? "本节首页" : step === "lecture" ? "完整讲义" : step}”。可以继续，也可在目录换一节。`, lessonId:lesson.id };
      }
    }
    const firstLesson = COURSE.lessons[0];
    if (firstLesson) return { type:"lesson", label:`从「${firstLesson.title}」开始`, detail:"先读课件原图和定义，再决定要不要做三题；无须先考试。", lessonId:firstLesson.id };
    const due = PRODUCT.units.filter((unit) => data.reviews[unit.id]?.dueAt && data.reviews[unit.id].dueAt <= now);
    if (due.length) return { type:"review", label:"先复测到期内容", detail:`${due[0].title} 已到复测时间。独立做一题，看看经过间隔后还能否回忆。`, unitId:due[0].id };
    const latestAttempt = data.attempts[data.attempts.length - 1];
    if (latestAttempt && (!latestAttempt.correct || latestAttempt.helpUsed)) {
      const unit = unitById(latestAttempt.unitId);
      if (unit) {
        const diagnosis = latestAttempt.errorType ? `这次可能卡在“${latestAttempt.errorType}”：${latestAttempt.misconception}` : `最近的作答显示“${latestAttempt.skill}”还值得巩固。`;
        return { type:"unit", label:`复看「${unit.title}」中的一个关键判断`, detail:`${diagnosis}建议先看对比例子，再试新题。`, unitId:unit.id };
      }
    }
    const pending = PRODUCT.units.find((unit) => !progressFor(unit.id).completedAt);
    if (pending) return { type:"unit", label:`继续学习：${pending.title}`, detail:"先检查必要基础，再从教材图示和正反例开始。理由可选择填写，导师也可跳过。", unitId:pending.id };
    return { type:"review", label:"查看你的复习安排", detail:"四个单元都已完成本轮练习。你可以查看已到期的复测和接下来安排的回忆任务。", unitId:null };
  }

  function renderRecommendation() {
    const rec = nextRecommendation();
    const card = byId("recommendation");
    card.replaceChildren();
    const copy = document.createElement("div");
    const label = document.createElement("div"); label.className = "reason-label"; label.textContent = "根据当前学习记录给出的建议";
    const title = document.createElement("div"); title.className = "recommendation-title"; title.textContent = rec.label;
    const detail = document.createElement("p"); detail.textContent = rec.detail;
    copy.append(label, title, detail);
    const button = document.createElement("button"); button.type = "button"; button.className = "button"; button.textContent = rec.type === "review" ? "查看复习安排 →" : "现在开始 →";
    button.addEventListener("click", () => rec.type === "lesson-review" ? openLessonReview(rec.lessonId) : rec.type === "lesson" ? openLesson(rec.lessonId) : rec.type === "review" ? renderReview() : openUnit(rec.unitId));
    card.append(copy, button);
  }

  function renderProfileControl() {
    const select = byId("profile-select");
    select.replaceChildren();
    profiles.forEach((profile) => {
      const option = document.createElement("option");
      option.value = profile.id; option.textContent = profile.label;
      option.selected = profile.id === activeProfileId;
      select.append(option);
    });
  }

  function switchProfile(profileId) {
    if (!profiles.some((profile) => profile.id === profileId)) return;
    activeProfileId = profileId;
    KEY = `${DATA_PREFIX}${activeProfileId}`;
    try { localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId); } catch {}
    data = loadData();
    simState = {...defaultSimulation(),...data.simulation,playing:false};
    activeUnit = null; tutorSessionId = null;
    examDraftFile = null; examEditingId = null;
    if (examPreviewUrl) { URL.revokeObjectURL(examPreviewUrl); examPreviewUrl = null; }
    if (examDetailUrl) { URL.revokeObjectURL(examDetailUrl); examDetailUrl = null; }
    openHome();
  }

  function createProfile() {
    const profile = { id:`learner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`, label:`学习者 ${profiles.length + 1}` };
    profiles.push(profile);
    try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); }
    catch { profiles.pop(); showToast("无法创建档案；请检查浏览器本地存储空间。"); return; }
    renderProfileControl();
    switchProfile(profile.id);
  }

  async function clearCurrentProfile() {
    const profile = profiles.find((item) => item.id === activeProfileId);
    const label = profile?.label || "当前学习者";
    if (!window.confirm(`清空${label}的所有答题记录、理由和复习安排？此操作无法撤销。`)) return;
    try { await window.ChemistryExamFiles.removeProfile(activeProfileId); }
    catch { showToast("本机试卷图片未能清除，档案数据仍保留；请检查浏览器存储。"); return; }
    try { localStorage.removeItem(KEY); }
    catch { showToast("浏览器无法清除本机记录。"); return; }
    data = blankData();
    simState = defaultSimulation();
    activeUnit = null; tutorSessionId = null;
    openHome();
    showToast("当前档案记录已清空。");
  }

  function statusFor(unit) {
    const attempts = attemptsFor(unit.id);
    const first = attempts.filter((attempt) => attempt.firstForItem && !attempt.delayed && !attempt.itemId.endsWith(":transfer"));
    const done = progressFor(unit.id).completedAt;
    if (!first.length && !done) return { text:"未开始", cls:"" };
    if (done && data.reviews[unit.id]?.doneAt) return { text:"已完成一次延迟复测", cls:"done" };
    if (done) return { text:"本轮练习已完成", cls:"done" };
    return { text:`已留 ${first.length} 条首答记录`, cls:"" };
  }

  function renderHome() {
    renderProfileControl();
    renderRecommendation();
    renderShortCourseList();
    const list = byId("unit-cards"); list.replaceChildren();
    for (const unit of PRODUCT.units) {
      const article = document.createElement("article"); article.className = "unit-card";
      const index = document.createElement("span"); index.className = "unit-index"; index.textContent = unit.number;
      const main = document.createElement("div"); main.className = "unit-card-main";
      const top = document.createElement("div"); top.className = "unit-card-top";
      const heading = document.createElement("h3"); heading.textContent = unit.title;
      const status = statusFor(unit); const label = document.createElement("span"); label.className = `unit-status ${status.cls}`; label.textContent = status.text;
      top.append(heading, label);
      const desc = document.createElement("p"); desc.textContent = `${unit.subtitle} · ${unit.duration}`;
      const start = document.createElement("button"); start.type = "button"; start.className = "unit-start"; start.textContent = "打开单元 →"; start.addEventListener("click", () => openUnit(unit.id));
      const bar = document.createElement("div"); bar.className = "unit-progress"; bar.setAttribute("aria-label", "三道主练习的首答进度");
      const fill = document.createElement("span"); const answered = unit.practice.filter((q) => firstAttemptFor(unit.id, q.id)).length; fill.style.width = `${Math.round(answered / unit.practice.length * 100)}%`; bar.append(fill);
      main.append(top, desc, start, bar); article.append(index, main); list.append(article);
    }
  }

  function renderHomeIfVisible() { if (activeView === "home") renderHome(); }

  function renderShortCourseList() {
    const host = byId("short-course-list");
    host.replaceChildren();
    for (const group of COURSE.groups) {
      const heading = document.createElement("h3");
      heading.className = "short-course-group";
      heading.textContent = group.title;
      const grid = document.createElement("div");
      grid.className = "short-lesson-grid";
      for (const lesson of COURSE.lessons.filter((item) => item.group === group.id)) {
        const state = data.lessons[lesson.id];
        const answered = Object.keys(state?.answers || {}).length;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "short-lesson-card";
        button.innerHTML = `<strong>${esc(lesson.title)}</strong><span>${esc(lesson.question)}</span><br><span>${state?.visited?.length ? `已浏览 ${state.visited.length} 步 · ` : "未开始 · "}${answered} / 3 题有记录</span>`;
        button.addEventListener("click", () => openLesson(lesson.id));
        grid.append(button);
      }
      host.append(heading, grid);
    }
    const note = document.createElement("p"); note.className = "short-course-note";
    note.textContent = "题目均为课程原创；课稿和考法参照仍待独立教师审校。原有综合单元保留在下方，供继续查看已有模拟与较长练习。";
    host.append(note);
  }

  function renderNav() {
    const nav = byId("unit-nav"); nav.replaceChildren();
    COURSE.lessons.forEach((lesson, index) => {
      const button = document.createElement("button"); button.type = "button";
      button.className = `nav-unit${activeView === "lesson" && coursePlayer?.current() === lesson.id ? " active" : ""}`;
      const num = document.createElement("span"); num.className = "nav-number"; num.textContent = String(index+1).padStart(2,"0");
      const label = document.createElement("span"); label.className = "nav-label"; label.textContent = lesson.title;
      button.append(num, label);
      if (data.lessons[lesson.id]?.visited?.includes("summary")) { const check = document.createElement("span"); check.className = "nav-check"; check.textContent = "✓"; check.setAttribute("aria-label","看过本节小结"); button.append(check); }
      button.addEventListener("click", () => openLesson(lesson.id)); nav.append(button);
    });
  }

  function setView(view, crumb) {
    activeView = view;
    byId("home-view").hidden = view !== "home";
    byId("unit-view").hidden = view !== "unit";
    byId("lesson-view").hidden = view !== "lesson";
    byId("simulation-view").hidden = !view.startsWith("simulation");
    byId("review-view").hidden = view !== "review";
    byId("records-view").hidden = view !== "records";
    byId("exam-view").hidden = view !== "exam";
    byId("breadcrumb").innerHTML = `${esc(crumb)} <span>·</span> ${esc(PRODUCT.metadata.curriculum)}`;
    document.querySelector(".sidebar").classList.remove("open");
    byId("mobile-menu").setAttribute("aria-expanded", "false");
    window.scrollTo({ top:0, behavior:"smooth" });
    renderNav();
  }

  function openHome() { activeUnit = null; persistRoute({view:"home"}); setView("home", "新版学习原型"); renderHome(); }

  function openLesson(lessonId, options = {}) {
    const lesson = COURSE.lessons.find((item) => item.id === lessonId);
    if (!lesson || !coursePlayer) return;
    activeUnit = null;
    const step = options.step || data.lessons[lessonId]?.step || "home";
    persistRoute({view:"lesson",id:lessonId,step});
    setView("lesson", lesson.title);
    coursePlayer.mount(lessonId, {...options,step});
    renderNav();
  }

  function openLessonReview(lessonId) {
    const lesson = COURSE.lessons.find((item) => item.id === lessonId);
    if (!lesson || !coursePlayer) return;
    persistRoute({view:"lesson",id:lessonId,step:"review"});
    setView("lesson", `${lesson.title} · 复习`);
    coursePlayer.showReview(lessonId);
    renderNav();
  }

  function openNextLesson(currentId) {
    const index = COURSE.lessons.findIndex((item) => item.id === currentId);
    if (index < 0 || index === COURSE.lessons.length - 1) { openHome(); return; }
    openLesson(COURSE.lessons[index + 1].id);
  }

  function openUnit(unitId) {
    const unit = unitById(unitId); if (!unit) return;
    activeUnit = unit; tutorSessionId = null; precheckChoice = null; precheckExpanded = false; practiceChoice = null; transferChoice = null; practiceReason = ""; transferReason = ""; activeHint = false; itemSupportUsed = false;
    data.lastUnit = unit.id; saveData();
    persistRoute({view:"unit",id:unit.id});
    setView("unit", unit.title); renderUnit();
  }

  function topicLinks() {
    return `<div class="term-chips"><button class="term-chip" type="button" data-open-term="${esc(activeUnit.id === "classification" ? "pure" : activeUnit.id === "conductivity" ? "electrolyte" : activeUnit.id === "ionic" ? "precipitate" : "redox")}">查核心术语</button><button class="term-chip" type="button" data-open-glossary>打开完整词典</button></div>`;
  }

  function getPrerequisiteState() { return progressFor(activeUnit.id).prerequisite || null; }
  function renderPrecheck() {
    const state = getPrerequisiteState();
    const check = activeUnit.prerequisiteCheck;
    const answered = precheckChoice !== null;
    const correct = answered && precheckChoice === check.answer;
    const result = answered
      ? `<div class="feedback-box${correct ? "" : " warn"}"><strong>${correct ? "自测判断正确" : "对照一下判据"}</strong><p>${esc(check.why)}</p></div><button type="button" class="button button-secondary" data-action="enter-after-precheck">记下这次自愿回顾</button>`
      : state?.answered || state?.skipped
        ? `<p class="muted">${state.skipped ? "上次选择跳过" : "上次自愿做过基础回顾"}。回顾不计入本单元练习成绩。</p><button type="button" class="button-quiet" data-action="reset-precheck">重新自测</button>`
        : `<strong>${esc(check.stem)}</strong><div class="precheck-options">${check.options.map((option, i) => `<button class="option-button" type="button" data-action="precheck-answer" data-choice="${i}">${esc(option)}</button>`).join("")}</div><button type="button" class="button-quiet" data-action="skip-precheck">跳过这道自测</button>`;
    return `<details class="content-card precheck precheck-optional" ${precheckExpanded ? "open" : ""}><summary><span class="eyebrow">初中基础回顾 · 自选，不计成绩</span><span class="precheck-summary-status">${state?.answered ? "已回顾" : state?.skipped ? "已跳过" : "展开讲解与自测"}</span></summary><div class="precheck-body"><p>${esc(activeUnit.prerequisite)}</p><p class="muted">可以先学本节内容，再按需展开回顾；这里的自测不作为进入课程的门槛。</p>${result}</div></details>`;
  }

  function renderGuidedLesson(unit) {
    if (!unit.guidedLesson) return "";
    return `<section class="guided-lesson" aria-labelledby="guided-lesson-title"><div class="guided-lesson-heading"><span class="eyebrow">老师带读 · 先理解，再练习</span><h2 id="guided-lesson-title">${esc(unit.guidedLesson.title)}</h2><p>${esc(unit.guidedLesson.intro)}</p></div>${unit.guidedLesson.steps.map((step, index) => `<article class="guided-step"><span class="guided-step-number" aria-label="第 ${index + 1} 步">${index + 1}</span><div class="guided-step-content"><span class="eyebrow">原图阅读顺序</span><h3>${esc(step.title)}</h3><p class="guided-read"><strong>看图：</strong>${esc(step.read)}</p><p>${esc(step.explain)}</p><div class="guided-example-list">${step.examples.map((example) => `<p>${esc(example)}</p>`).join("")}</div><div class="guided-takeaway"><strong>这一层记住：</strong>${esc(step.takeaway)}</div></div></article>`).join("")}</section>`;
  }

  function unitPracticeProgress(unit) {
    const ids = unit.practice.flatMap((q) => [q.id, `${q.id}:transfer`]);
    const completed = ids.filter((id) => firstAttemptFor(unit.id, id)).length;
    return { completed, total:ids.length, done:completed === ids.length };
  }

  function currentPractice(unit) {
    return unit.practice.find((question) => !firstAttemptFor(unit.id, question.id) || !firstAttemptFor(unit.id, `${question.id}:transfer`)) || null;
  }

  function assessmentGuide(question, isTransfer = false) {
    const guide = PRODUCT.assessmentGuides?.[question.id];
    const criteria = PRODUCT.reasonRubrics?.[question.id]?.[isTransfer ? "transfer" : "main"] || [];
    if (!guide) return { pattern:question.point, errorType:"未归类错因", misconception:"回看题目条件与本单元核心判据。", criteria };
    return isTransfer
      ? { pattern:guide.pattern, errorType:guide.transferErrorType, misconception:guide.transferMisconception, criteria }
      : { pattern:guide.pattern, errorType:guide.mainErrorType, misconception:guide.mainMisconception, criteria };
  }

  function optionsFor(question) { return question.options || ["正确", "不正确"]; }

  function evidenceSummary(unit) {
    const mains = unit.practice.map((q) => firstAttemptFor(unit.id, q.id)).filter(Boolean);
    const transfers = unit.practice.map((q) => firstAttemptFor(unit.id, `${q.id}:transfer`)).filter(Boolean);
    const clean = (items) => items.filter((attempt) => attempt.correct && !attempt.helpUsed && attempt.firstForItem);
    return { mainIndependent:clean(mains).length, transferIndependent:clean(transfers).length, helped:[...mains, ...transfers].filter((attempt) => attempt.helpUsed).length, mainTotal:mains.length, transferTotal:transfers.length };
  }

  function renderPractice(unit) {
    const question = currentPractice(unit);
    const progress = unitPracticeProgress(unit);
    if (!question) {
      const summary = evidenceSummary(unit);
      const interval = summary.mainIndependent === 3 && summary.transferIndependent === 3 ? 3 : 1;
      return `<div class="unit-finish"><h3>本轮练习已完成</h3><p>每道主练习与迁移题都已记录首次回答。答题后的课程解析不改变当时的首答记录。</p><ul class="evidence-list"><li><span>辨认与解释题的无提示正确首答</span><span class="evidence-tag">${summary.mainIndependent} / 3</span></li><li><span>换情境迁移题的无提示正确首答</span><span class="evidence-tag">${summary.transferIndependent} / 3</span></li><li><span>本次使用过线索</span><span class="evidence-tag helped">${summary.helped} 题</span></li><li><span>延迟复测</span><span class="evidence-tag unknown">尚无结果</span></li></ul><p>本次记录说明这组题的表现，不代表整个知识点已经掌握。建议 ${interval} 天后再做一道新题；你可在复习页调整时间。</p><div class="unit-actions"><button class="button" type="button" data-action="back-home">回到学习总览</button><button class="button button-secondary" type="button" data-action="next-unit">继续下一个单元 →</button></div></div>`;
    }
    const index = unit.practice.indexOf(question);
    const mainRecord = firstAttemptFor(unit.id, question.id);
    const transferRecord = firstAttemptFor(unit.id, `${question.id}:transfer`);
    const mainChoice = practiceChoice;
    const transferQ = question.transfer;
    const transferOptions = optionsFor(transferQ);
    const mainGuide = assessmentGuide(question);
    const transferGuide = assessmentGuide(question, true);
    const rows = unit.practice.map((q, qIndex) => {
      const answered = !!firstAttemptFor(unit.id, q.id);
      const moved = !!firstAttemptFor(unit.id, `${q.id}:transfer`);
      return `<li><span>${qIndex + 1}. ${esc(q.role)}</span><span class="evidence-tag${answered && moved ? "" : " unknown"}">${answered ? (moved ? "已完成" : "继续迁移题") : "未完成"}</span></li>`;
    }).join("");
    const supportLabel = (used) => used ? "使用过提示或导师" : "回答前未用提示或导师";
    const mainStage = mainRecord ? `<div class="question-feedback"><strong>${mainRecord.correct ? "首次判断正确" : "首次判断需要修正"} · ${supportLabel(mainRecord.helpUsed)}</strong>${mainRecord.reason ? `<p class="student-reason"><strong>你写的理由：</strong>${esc(mainRecord.reason)}</p>` : ""}<p><strong>参考思路：</strong>${esc(question.why)}</p><p><strong>考点：</strong>${esc(question.point)}</p><p><strong>考法能力：</strong>${esc(mainGuide.pattern)}（考法模式参考，不是历年原题）</p><p><strong>解释自查：</strong>${esc(mainGuide.criteria.join("；"))}（只作自我对照，不自动评分）</p>${!mainRecord.correct ? `<p><strong>这次可能卡在：</strong>${esc(mainRecord.errorType || mainGuide.errorType)}。${esc(mainRecord.misconception || mainGuide.misconception)}</p>` : ""}<p><strong>要记住：</strong>${esc(unit.remember)}</p></div>` : `<div class="practice-meta"><span class="step-pill">第 ${index + 1} / ${unit.practice.length} 题 · ${esc(question.role)}</span><button class="button-quiet" type="button" data-action="show-hint">${activeHint ? "线索已展开" : "先看一条线索（记为辅助练习）"}</button></div>${activeHint ? `<div class="hint-panel">先用“${esc(unit.skill)}”判断，再检查题目里给的对象和条件。</div>` : ""}<p class="practice-pattern"><strong>本题考法能力：</strong>${esc(mainGuide.pattern)} <span>（课程自编的考法模式练习，不对应某一道历年真题）</span></p><p><strong>${esc(question.stem)}</strong></p><div class="answer-options">${question.options.map((option, i) => `<button class="option-button${mainChoice === i ? " selected" : ""}" type="button" data-action="choose-main" data-choice="${i}">${esc(option)}</button>`).join("")}</div><label class="reason-label" for="main-reason">可选：写一句你的判断理由，提交后对照参考思路</label><textarea id="main-reason" class="reason-input" maxlength="240" placeholder="我根据……判断，因为……">${esc(practiceReason)}</textarea><button class="button" type="button" data-action="submit-main" ${mainChoice === null ? "disabled" : ""}>提交首答 →</button>`;
    const transferStage = !mainRecord ? "" : transferRecord ? `<div class="transfer-box"><h3>举一反三 · ${transferQ.role}</h3><p>${esc(transferQ.stem)}</p><div class="question-feedback"><strong>${transferRecord.correct ? "迁移题首答正确" : "迁移题需要修正"} · ${supportLabel(transferRecord.helpUsed)}</strong>${transferRecord.reason ? `<p class="student-reason"><strong>你写的理由：</strong>${esc(transferRecord.reason)}</p>` : ""}<p><strong>参考思路：</strong>${esc(transferQ.why)}</p><p><strong>迁移考法能力：</strong>${esc(transferGuide.pattern)}（考法模式参考，不是历年原题）</p><p><strong>解释自查：</strong>${esc(transferGuide.criteria.join("；"))}（只作自我对照，不自动评分）</p>${!transferRecord.correct ? `<p><strong>这次可能卡在：</strong>${esc(transferRecord.errorType || transferGuide.errorType)}。${esc(transferRecord.misconception || transferGuide.misconception)}</p>` : ""}</div></div>` : `<div class="transfer-box"><h3>举一反三 · 换个情境试试看</h3><p class="practice-pattern"><strong>迁移能力：</strong>${esc(transferGuide.pattern)} <span>（练习为课程自编）</span></p><p>${esc(transferQ.stem)}</p><button class="button-quiet" type="button" data-action="show-transfer-hint">${activeHint ? "线索已展开" : "查看线索"}</button>${activeHint ? `<div class="hint-panel">先找出变化的物质、条件或分类对象，再判断本节规则是否仍适用。</div>` : ""}<div class="answer-options">${transferOptions.map((option, i) => `<button class="option-button${transferChoice === i ? " selected" : ""}" type="button" data-action="choose-transfer" data-choice="${i}">${esc(option)}</button>`).join("")}</div><label class="reason-label" for="transfer-reason">可选：说明这次换情境后，判断依据有没有变化</label><textarea id="transfer-reason" class="reason-input" maxlength="240" placeholder="新情境中改变的是……">${esc(transferReason)}</textarea><button class="button button-secondary" type="button" data-action="submit-transfer" ${transferChoice === null ? "disabled" : ""}>提交迁移判断</button></div>`;
    return `<div class="unit-layout"><div><article class="content-card"><span class="eyebrow">三类练习 · ${progress.completed} / ${progress.total} 条记录</span><h2>先自己判断，再看解释</h2><p class="muted">答题理由可以写也可以不写。线索由你选择；使用后仍可学习，只把本次记录为辅助完成。</p><div class="practice-question"><div class="practice-meta"><span class="step-pill">${esc(question.role)}</span><span class="muted">${esc(question.skill)}</span></div><p class="muted">${esc(question.point)}</p>${mainStage}${transferStage}</div><p class="source-inline">${esc(PRODUCT.examPatternNote)} ${esc(PRODUCT.metadata.examNote)}</p></article>${progress.done ? renderPractice(unit) : ""}</div><aside><article class="side-card"><span class="eyebrow">本单元任务</span><h3>从会辨认到能迁移</h3><ul class="evidence-list">${rows}</ul><p class="muted">每题都说明考点、训练的命题能力、错因与记忆规则。</p></article><article class="side-card"><span class="eyebrow">随时查看</span><h3>相关术语</h3>${topicLinks()}<details class="tutor-panel"><summary>需要时再问 AI 导师</summary><p class="muted">直接写你想问的问题，或让导师解释当前题。使用导师会标记为辅助学习。</p><textarea id="tutor-question" maxlength="300" placeholder="例如：为什么干燥 NaCl 晶体不导电？"></textarea><button class="button button-secondary" type="button" data-action="ask-tutor">向导师提问</button><div id="tutor-result" class="tutor-result" hidden></div></details></article></aside></div>`;
  }

  function renderUnit() {
    if (!activeUnit) return;
    const progress = unitPracticeProgress(activeUnit);
    const imageNames = activeUnit.images || (activeUnit.image ? [activeUnit.image] : []);
    const image = imageNames.map((imageName, index) => `<figure class="lesson-image"><img src="/assets/${esc(imageName)}.png" alt="${esc(activeUnit.title)}教材原图 ${index + 1}。保留原图版式，并在正文中解释阅读顺序。"><figcaption>课程原图 ${imageNames.length > 1 ? `${index + 1} / ${imageNames.length}` : ""} · 先看图中的分类与关系，再读下方解释。</figcaption></figure>`).join("");
    const simulationButton = activeUnit.id === "ionic"
      ? `<button class="button button-secondary" type="button" data-action="open-simulation" data-sim="precipitation">打开沉淀生成模拟 →</button>`
      : activeUnit.id === "conductivity"
        ? `<button class="button button-secondary" type="button" data-action="open-simulation" data-sim="conductivity">打开导电粒子模拟 →</button>`
        : "";
    const activityLabel = simulationButton ? "互动观察" : "跟着教材关系图学习";
    const activityHeading = activeUnit.id === "classification" ? "沿着分类树看判断顺序" : "对照原图追踪化合价与电子";
    const guidedLesson = renderGuidedLesson(activeUnit);
    const activityCard = activeUnit.id === "classification" ? "" : `<article class="content-card precheck" style="margin-top:14px"><span class="eyebrow">${activityLabel}</span><h2>${simulationButton ? "把粒子过程看清楚" : activityHeading}</h2><p>${esc(activeUnit.activity)}</p>${simulationButton}</article>`;
    byId("unit-view").innerHTML = `
      <div class="unit-header">
        <div><span class="eyebrow">${esc(PRODUCT.metadata.curriculum)} · 学习单元 ${esc(activeUnit.number)}</span><h1>${esc(activeUnit.title)}</h1><p>${esc(activeUnit.objective)}</p></div>
        <div class="unit-number-large" aria-hidden="true">${esc(activeUnit.number)}</div>
      </div>
      ${renderPrecheck()}
      <article class="content-card" style="margin-top:14px">
        <span class="eyebrow">核心概念 · ${esc(activeUnit.duration)}</span>
        <h2>${esc(activeUnit.subtitle)}</h2>
        ${guidedLesson ? "" : `<p>${esc(activeUnit.explanation)}</p>`}
        ${image}
        ${guidedLesson}
        <div class="memory-box"><strong>必须记住</strong>${esc(activeUnit.remember)}</div>
        <div class="example-grid">
          <article class="example-box"><h3>正例</h3>${activeUnit.positive.map((text) => `<p>${esc(text)}</p>`).join("")}</article>
          <article class="example-box counter"><h3>反例与边界</h3>${activeUnit.counterexample.map((text) => `<p>${esc(text)}</p>`).join("")}</article>
        </div>
        <div class="term-chips">
          <button class="term-chip" type="button" data-open-term="${activeUnit.id === "classification" ? "pure" : activeUnit.id === "conductivity" ? "electrolyte" : activeUnit.id === "ionic" ? "solubility" : "redox"}">解释核心术语</button>
          <button class="term-chip" type="button" data-open-glossary>查其他术语</button>
        </div>
        <p class="source-inline">${esc(activeUnit.source)}</p>
      </article>
      ${activityCard}
      <div class="unit-actions">
        <button class="button" type="button" data-action="open-practice">${progress.completed ? `查看练习记录（${progress.completed}/${progress.total}） →` : "开始本单元三类练习 →"}</button>
        <button class="button button-secondary" type="button" data-action="back-home">回到学习总览</button>
      </div>
      <div id="practice-slot">${progress.completed ? renderPractice(activeUnit) : ""}</div>`;
  }

  function recordAnswer(itemId, skill, choice, answer, helpUsed, reason, guide) {
    const previous = attemptsFor(activeUnit.id).some((attempt) => attempt.itemId === itemId);
    const correct = choice === answer;
    const record = { unitId:activeUnit.id, itemId, skill, choice, correct, helpUsed, reason:reason.trim(), contentRevision:PRODUCT.metadata.contentRevision, errorType:correct ? null : guide?.errorType || null, misconception:correct ? null : guide?.misconception || null, firstForItem:!previous, occurredAt:Date.now() };
    data.attempts.push(record);
    return record;
  }

  function maybeCompleteUnit(unit) {
    if (!unitPracticeProgress(unit).done) return;
    const current = progressFor(unit.id);
    if (!current.completedAt) {
      current.completedAt = Date.now();
      const evidence = evidenceSummary(unit);
      const days = evidence.mainIndependent === 3 && evidence.transferIndependent === 3 ? 3 : 1;
      data.reviews[unit.id] = { dueAt:Date.now() + days * 86400000, intervalDays:days, scheduledAt:Date.now(), doneAt:null, lastOutcome:null };
    }
  }

  function enterUnitStudy() {
    const p = progressFor(activeUnit.id);
    p.prerequisite = { answered:true, skipped:false, correct:precheckChoice === activeUnit.prerequisiteCheck.answer, occurredAt:Date.now() };
    precheckChoice = null;
    precheckExpanded = false;
    saveData(); renderUnit();
  }

  function skipPrecheck() {
    const p = progressFor(activeUnit.id); p.prerequisite = { answered:false, skipped:true, occurredAt:Date.now() }; precheckExpanded = false; saveData(); renderUnit();
  }

  function showSimulation(kind) {
    simState.playing = false;
    const previous = data.activeRoute;
    simulationReturnLesson = previous?.view === "lesson" ? previous.id : previous?.view?.startsWith("simulation-") ? previous.returnLesson || null : null;
    if (kind === "conductivity") { activeView = "simulation-conductivity"; persistRoute({view:activeView,returnLesson:simulationReturnLesson}); setView(activeView, "导电粒子模拟"); renderConductivitySimulation(); }
    else { activeView = "simulation-precipitation"; persistRoute({view:activeView,returnLesson:simulationReturnLesson}); setView(activeView, "沉淀生成模拟"); renderPrecipitationSimulation(); }
  }

  function addSimulationReturn(view) {
    if (!simulationReturnLesson) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary";
    button.dataset.goLesson = simulationReturnLesson;
    button.textContent = "回到刚才的短课 →";
    view.querySelector(".sim-header")?.append(button);
  }

  const conductivitySamples = [
    { id:"nacl-solid", label:"NaCl 晶体 (s)", kind:"fixed-ion", conducts:false, carriers:["Na⁺","Cl⁻"], explanation:"晶体中有离子，但它们被束缚在晶格位置，不能自由迁移。" },
    { id:"nacl-aq", label:"NaCl 水溶液 (aq)", kind:"ion", conducts:true, carriers:["Na⁺","Cl⁻"], explanation:"水中有可移动的 Na⁺ 和 Cl⁻；阳离子移向阴极，阴离子移向阳极。" },
    { id:"nacl-melt", label:"熔融 NaCl (l)", kind:"ion", conducts:true, carriers:["Na⁺","Cl⁻"], explanation:"熔融后离子可以移动；导电不要求必须有水。" },
    { id:"sugar-aq", label:"蔗糖水溶液 (aq)", kind:"molecule", conducts:false, carriers:["C₁₂H₂₂O₁₁"], explanation:"蔗糖溶解后主要仍是中性分子，不会因溶解就产生大量离子。" },
    { id:"hcl-gas", label:"HCl 气体 (g)", kind:"molecule", conducts:false, carriers:["HCl"], explanation:"常见条件下，HCl 气体主要是中性分子；盐酸中的离子不能套用到气态 HCl。" },
    { id:"hcl-aq", label:"盐酸 HCl (aq)", kind:"ion", conducts:true, carriers:["H₃O⁺","Cl⁻"], explanation:"HCl 溶于水后形成水合氢离子和 Cl⁻ 等可移动离子。盐酸是溶液混合物。" },
    { id:"pure-water", label:"极高纯度水", kind:"trace-ion", conducts:"tiny", carriers:["H₃O⁺","OH⁻"], explanation:"水极微弱自电离；电导率很低但不为零。普通课堂小灯泡通常不明显发亮。" },
    { id:"copper", label:"铜丝 Cu (s)", kind:"electron", conducts:true, carriers:["e⁻"], explanation:"金属铜通过自由电子导电。铜是单质，不属于电解质。" }
  ];

  function particleHtml(sample, amount) {
    const count = sample.kind === "fixed-ion" ? 12 : sample.kind === "trace-ion" ? 4 : sample.kind === "molecule" ? 10 : sample.kind === "electron" ? 14 : 8 + amount * 4;
    const symbols = sample.kind === "electron" ? ["e⁻"] : sample.carriers;
    let result = "";
    for (let i = 0; i < count; i++) {
      const symbol = symbols[i % symbols.length];
      const classes = ["particle"];
      if (sample.kind === "electron") classes.push("electron", "mobile", "to-cathode");
      else if (sample.kind === "molecule") classes.push("molecule");
      else if (sample.kind === "fixed-ion") classes.push(i % 2 ? "anion" : "cation");
      else if (sample.kind === "trace-ion") classes.push(i % 2 ? "anion" : "cation", "mobile", i % 2 ? "to-anode" : "to-cathode");
      else {
        const anion = i % 2 === 1;
        classes.push(anion ? "anion" : "cation", "mobile", anion ? "to-anode" : "to-cathode");
      }
      const x = 9 + ((i * 37 + 7) % 80); const y = 19 + ((i * 43 + 3) % 64);
      result += `<span class="${classes.join(" " )}" style="left:${x}%;top:${y}%">${esc(symbol)}</span>`;
    }
    return result;
  }

  function renderConductivitySimulation() {
    const view = byId("simulation-view");
    const sample = conductivitySamples.find((item) => item.id === simState.sample) || conductivitySamples[1];
    const light = sample.conducts === true && (sample.kind !== "ion" || simState.amount > 0) ? "on" : "";
    const conductivityText = sample.conducts === true ? (sample.kind === "ion" ? "可观察到导电；滑动浓度只在同种电解质溶液内作定性比较。" : "能够导电。") : sample.conducts === "tiny" ? "极微弱导电；小灯泡通常不亮，灵敏仪器仍可检测。" : "普通课堂电路中通常不能明显导电。";
    const amountControls = sample.kind === "ion" ? `<div class="control-group slider-row"><label class="control-label" for="concentration-range">同种溶液的粒子浓度（定性示意）</label><input id="concentration-range" type="range" min="0" max="3" step="1" value="${simState.amount}" aria-valuetext="等级 ${simState.amount + 1}"><div class="choice-row"><span class="muted">较稀</span><span class="muted" style="text-align:right">较浓</span></div></div>` : "";
    view.innerHTML = `<div class="sim-header"><div><span class="eyebrow">互动模型 · 预测、观察、解释</span><h1>导电从哪里来？</h1><p class="lead">选择物质与状态，先看载流粒子，再启动迁移示意。黄色表示阳离子，蓝色表示阴离子，紫色表示电子；形状和文字标记帮助区分。</p></div><button type="button" class="button button-secondary" data-action="back-home">返回学习总览</button></div><div class="sim-layout"><section class="sim-stage" aria-label="导电粒子模型"><div class="sim-toolbar"><span class="sim-material">${esc(sample.label)}</span><button class="button button-secondary" type="button" data-action="toggle-simulation">${simState.playing ? "暂停粒子示意" : "播放迁移示意"}</button></div><div class="circuit-row"><span class="electrode anode"></span><span class="bulb ${light}">${light ? "亮" : "—"}</span><span class="electrode cathode"></span></div><div class="sim-beaker${simState.playing ? " animating" : ""}" aria-label="${esc(conductivityText)}">${particleHtml(sample, simState.amount)}</div><p class="sim-state">${esc(conductivityText)} 载流粒子：${esc(sample.carriers.join("、"))}。</p><p class="sim-disclaimer">模型说明：粒子颜色、大小、数量与移动速度均为示意，不按比例绘制，也不用于计算真实电流。</p></section><aside class="sim-controls"><article class="side-card"><span class="eyebrow">选择样品</span><h3>状态会改变离子能否移动</h3><div class="control-group">${conductivitySamples.map((item) => `<button type="button" class="control-choice" aria-pressed="${item.id === sample.id}" data-action="select-sample" data-sample="${esc(item.id)}">${esc(item.label)}</button>`).join("")}</div></article><article class="side-card sim-explanation"><strong>你要观察什么？</strong>${esc(sample.explanation)}${amountControls}<p style="margin:8px 0 0">铜丝用自由电子导电；溶液和熔融盐用可移动离子导电。</p><button type="button" class="term-chip" data-open-term="electrolyte">查“电解质”</button></article><button type="button" class="button button-secondary" data-go-unit="conductivity">回到导电与电解质单元</button></aside></div>`;
    addSimulationReturn(view);
    const range = byId("concentration-range"); if (range) range.addEventListener("input", () => {
      simState.amount = Number(range.value);
      saveSimulationState();
      range.setAttribute("aria-valuetext", `等级 ${simState.amount + 1}`);
      const current = conductivitySamples.find((item) => item.id === simState.sample) || conductivitySamples[1];
      const beaker = byId("simulation-view").querySelector(".sim-beaker");
      if (beaker) { beaker.innerHTML = particleHtml(current, simState.amount); beaker.classList.toggle("animating", simState.playing); }
    });
  }

  const precipitationPairs = {
    baso4:{ label:"BaCl₂(aq) + Na₂SO₄(aq)", ions:["Ba²⁺","2Cl⁻","2Na⁺","SO₄²⁻"], precipitate:"BaSO₄", equation:"Ba²⁺ + SO₄²⁻ → BaSO₄(s)", spectators:"Na⁺ 和 Cl⁻ 留在溶液中；它们是旁观离子。", why:"BaSO₄ 难溶，在本题常见定性条件下生成白色沉淀。" },
    agcl:{ label:"AgNO₃(aq) + NaCl(aq)", ions:["Ag⁺","NO₃⁻","Na⁺","Cl⁻"], precipitate:"AgCl", equation:"Ag⁺ + Cl⁻ → AgCl(s)", spectators:"Na⁺ 和 NO₃⁻ 留在溶液中；它们是旁观离子。", why:"AgCl 难溶，Ag⁺ 与 Cl⁻ 结合形成沉淀。" },
    caco3:{ label:"CaCl₂(aq) + Na₂CO₃(aq)", ions:["Ca²⁺","2Cl⁻","2Na⁺","CO₃²⁻"], precipitate:"CaCO₃", equation:"Ca²⁺ + CO₃²⁻ → CaCO₃(s)", spectators:"Na⁺ 和 Cl⁻ 留在溶液中；它们是旁观离子。", why:"CaCO₃ 难溶，Ca²⁺ 与 CO₃²⁻ 结合形成沉淀。" },
    none:{ label:"NaCl(aq) + KNO₃(aq)", ions:["Na⁺","Cl⁻","K⁺","NO₃⁻"], precipitate:null, equation:"无净离子反应", spectators:"Na⁺、Cl⁻、K⁺、NO₃⁻ 都留在溶液中。", why:"假想产物 NaNO₃ 和 KCl 都易溶；没有沉淀、气体或水生成，通常无净离子反应。" }
  };

  function renderPrecipitationSimulation() {
    const view = byId("simulation-view");
    const pair = precipitationPairs[simState.mix] || precipitationPairs.baso4;
    const tokens = pair.ions.map((ion, i) => `<span class="ion-token${ion.includes("⁺") ? " cation" : ""}" style="left:${7 + (i * 21)}%;top:${16 + ((i * 29) % 51)}%">${esc(ion)}</span>`).join("");
    const precipitateIons = pair.precipitate === "BaSO₄" ? ["Ba²⁺", "SO₄²⁻"] : pair.precipitate === "AgCl" ? ["Ag⁺", "Cl⁻"] : ["Ca²⁺", "CO₃²⁻"];
    const solid = simState.mixed && pair.precipitate ? `<div class="solid-lattice growing" role="img" aria-label="${esc(pair.precipitate)} 沉淀形成示意">${Array.from({length:8}, (_,i)=>`<span>${precipitateIons[i%2]}</span>`).join("")}</div>` : "";
    view.innerHTML = `<div class="sim-header"><div><span class="eyebrow">互动模型 · 混合离子溶液</span><h1>沉淀怎样形成？</h1><p class="lead">选择两种水溶液并混合，追踪生成固体的离子和留在水中的旁观离子。</p></div><button type="button" class="button button-secondary" data-action="back-home">返回学习总览</button></div><div class="sim-layout"><section class="sim-stage" aria-label="沉淀形成粒子模型"><div class="sim-toolbar"><span class="sim-material">${esc(pair.label)}</span><button class="button" type="button" data-action="mix-solutions">${simState.mixed ? "重置这次混合" : "混合溶液 →"}</button></div><div class="mixing-beaker" role="img" aria-label="${simState.mixed ? (pair.precipitate ? `${pair.precipitate} 沉淀形成，其他离子留在溶液中` : "混合后所有离子仍留在溶液中") : "两种溶液中的离子示意图"}">${tokens}${solid}</div><p class="sim-state">${simState.mixed ? esc(pair.why + " " + pair.spectators) : "观察：固体是由哪两种离子组成？哪些离子没有参与反应？"}</p><div class="ion-equation">${simState.mixed ? esc(pair.equation) : "先预测混合后会发生什么"}</div><p class="sim-disclaimer">离子数量和沉淀颗粒为示意图，非真实比例。是否形成可见沉淀取决于给定溶解性、浓度和实验条件；“难溶”不等于绝对不溶。</p></section><aside class="sim-controls"><article class="side-card"><span class="eyebrow">改变反应物</span><h3>比较沉淀与无反应</h3><div class="control-group">${Object.entries(precipitationPairs).map(([id,item])=>`<button type="button" class="control-choice" aria-pressed="${simState.mix === id}" data-action="select-pair" data-pair="${id}">${esc(item.label)}</button>`).join("")}</div></article><article class="side-card sim-explanation"><strong>判断顺序</strong><p>列出混合前的离子 → 重新配对 → 查常见溶解性 → 预测沉淀 → 写净离子式 → 检查物态与守恒。</p><p>初学时先记常见规律和高频例外；题目给出的条件优先。</p><button type="button" class="term-chip" data-open-term="solubility">查“溶解性”</button><button type="button" class="term-chip" data-open-term="netionic">查“旁观离子”</button></article><button type="button" class="button button-secondary" data-go-unit="ionic">回到沉淀与离子反应单元</button></aside></div>`;
    addSimulationReturn(view);
  }

  function renderReview() {
    persistRoute({view:"review"});
    setView("review", "到期复测");
    const now = Date.now(); const view = byId("review-view");
    const lessonEntries = COURSE.lessons.map((lesson) => ({ lesson, review:data.lessons[lesson.id]?.review })).filter((item) => item.review?.dueAt && !item.review.lastAttempt);
    const entries = PRODUCT.units.map((unit) => ({ unit, review:data.reviews[unit.id] })).filter((item) => item.review);
    if (!entries.length && !lessonEntries.length) {
      view.innerHTML = `<span class="eyebrow">检验间隔后的回忆</span><h1>到期复测</h1><p class="lead">读完短课后，可在小结中自行安排一次未见题复习；没有安排时不会虚构到期任务。</p><article class="empty-state" style="margin-top:18px">目前没有待做的复测。做过的复测可在学习记录中查看；如需继续检验，应使用新的题目。</article><div class="unit-actions"><button class="button button-secondary" data-action="back-home">回到学习总览</button></div>`;
      return;
    }
    view.innerHTML = `<span class="eyebrow">检验间隔后的回忆</span><h1>到期复测</h1><p class="lead">每节短课可安排一次新题。做完只记录那道题的表现；你可调整日期或先回课。</p><div id="review-list">${lessonEntries.map(({lesson,review}) => {
      const due = review.dueAt <= now;
      return `<article class="review-item${due ? " review-ready" : ""}"><span class="eyebrow">第一章短课 · ${esc(lesson.group.toUpperCase())}</span><h2>${esc(lesson.title)}</h2><p>安排日期：${localDate(review.dueAt)}${due ? " · 已到期" : ""}</p><div class="unit-actions"><button type="button" class="button" data-action="start-lesson-review" data-lesson="${lesson.id}">${due ? "做新题复测 →" : "现在自主复测 →"}</button><button type="button" class="button button-secondary" data-action="open-lesson-from-review" data-lesson="${lesson.id}">先复看讲解</button><button type="button" class="button button-secondary" data-action="delay-lesson-review" data-lesson="${lesson.id}" data-days="3">改为 3 天后</button></div></article>`;
    }).join("")}${entries.map(({unit,review})=>{
      const due = review.dueAt <= now;
      const completed = !!review.doneAt;
      const status = due ? `复测已到期${completed ? ` · 上次${review.lastOutcome === "correct" ? "答对" : "需再练"}（${localDate(review.doneAt)}）` : ""}` : completed ? `最近一次延迟复测：${review.lastOutcome === "correct" ? "首答正确" : "需要再练"} · ${localDate(review.doneAt)}` : `建议复测时间：${localDate(review.dueAt)}。`;
      return `<article class="review-item${due ? " review-ready" : ""}"><span class="eyebrow">${esc(unit.number)} · ${esc(unit.skill)}</span><h2>${esc(unit.title)}</h2><p>${status}</p><div class="unit-actions">${due ? `<button type="button" class="button" data-action="start-review" data-unit="${unit.id}">开始无提示复测 →</button>` : `<button type="button" class="button button-secondary" data-action="move-review" data-unit="${unit.id}" data-days="1">改为明天</button><button type="button" class="button button-secondary" data-action="move-review" data-unit="${unit.id}" data-days="3">改为 3 天后</button><button type="button" class="button button-secondary" data-action="move-review" data-unit="${unit.id}" data-days="7">改为 7 天后</button>`}</div><div class="source-row">复测计划是本原型的可调整规则，不代表适用于每位学生的最佳间隔。</div></article>`;
    }).join("")}</div><div class="unit-actions"><button class="button button-secondary" data-action="back-home">回到学习总览</button></div>`;
  }

  function startReview(unitId) {
    const unit = unitById(unitId); const review = data.reviews[unitId];
    if (!unit || !review || review.dueAt > Date.now()) return;
    const question = nextReviewQuestion(unit);
    if (!question) return;
    review.currentQuestionId = question.id;
    byId("review-view").innerHTML = `<span class="eyebrow">延迟复测 · 新题</span><h1>${esc(unit.title)}</h1><p class="lead">独立作答，不提供提示。完成后会显示固定解析。</p><article class="content-card" style="margin-top:18px"><p><strong>${esc(question.stem)}</strong></p><div class="answer-options">${question.options.map((option,i)=>`<button class="option-button" type="button" data-action="choose-review" data-unit="${unit.id}" data-choice="${i}">${esc(option)}</button>`).join("")}</div><div id="review-feedback"></div><div class="unit-actions"><button class="button button-secondary" data-action="back-review-list">回到复测安排</button></div></article>`;
  }

  function renderGlossary(query = "") {
    const list = byId("glossary-list"); list.replaceChildren();
    const normalized = query.trim().toLocaleLowerCase();
    const entries = PRODUCT.glossary.filter((item) => !normalized || [item.term, ...item.aliases, item.definition].join(" ").toLocaleLowerCase().includes(normalized));
    if (!entries.length) { const empty = document.createElement("div"); empty.className="empty-state"; empty.textContent="没有找到这个词。可以试试化学式、中文名或符号。"; list.append(empty); return; }
    for (const item of entries) {
      const article = document.createElement("article"); article.className="glossary-entry";
      const heading=document.createElement("h3");heading.textContent=item.term;
      const definition=document.createElement("p");definition.innerHTML=`<strong>解释：</strong>${esc(item.definition)}`;
      const example=document.createElement("p");example.innerHTML=`<strong>正例：</strong>${esc(item.examples.join("；"))}`;
      const counter=document.createElement("p");counter.innerHTML=`<strong>反例：</strong>${esc(item.counterexamples.join("；"))}`;
      const boundary=document.createElement("p");boundary.innerHTML=`<strong>边界：</strong>${esc(item.boundary)}`;
      article.append(heading,definition,example,counter,boundary);list.append(article);
    }
  }

  function openGlossary(search = "", trigger = null) {
    glossaryReturnFocus = trigger || document.activeElement;
    const item = PRODUCT.glossary.find((term) => term.id === search);
    const query = item ? item.term : search;
    byId("glossary-dialog").showModal(); byId("term-search").value = query; renderGlossary(query); byId("term-search").focus();
  }

  async function askTutor() {
    if (window.CHEMISTRY_STATIC_SITE) { showToast("AI 导师需在本机版连接服务后使用。"); return; }
    const question = byId("tutor-question").value.trim(); const result = byId("tutor-result");
    if (!question) { showToast("先写下你想问的问题。"); return; }
    result.hidden = false; result.textContent = "正在向你选择的本地导师请求解释……";
    try {
      if (!tutorSessionId) {
        const started = await fetch("/api/start", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ lessonId:activeUnit.id }) });
        if (!started.ok) throw new Error("当前导师服务没有连接；固定课程解析仍可使用。");
        tutorSessionId = (await started.json()).sessionId;
      }
      const response = await fetch("/api/ask", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ sessionId:tutorSessionId, question }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "导师暂时不可用；课程固定解析仍可使用。");
      itemSupportUsed = true;
      result.textContent = `AI 导师回复（可选参考）\n${body.answer}\n\n你可以想一想：${body.checkQuestion}\n\n课程固定解析仍是本课的核对依据。`;
    } catch (error) { result.textContent = `${error.message}\n\n你仍可查术语、阅读固定解析并继续学习。`; }
  }

  async function askShortTutor(lesson, question, mode) {
    if (window.CHEMISTRY_STATIC_SITE) throw new Error("AI 导师需在本机版连接服务后使用。");
    const mappedUnit = lesson.group === "redox" ? "redox" : lesson.group === "ionic" ? (["b1","b2"].includes(lesson.id) ? "conductivity" : "ionic") : "classification";
    if (shortTutorSession.key !== `${activeProfileId}:${mappedUnit}` || !shortTutorSession.id) {
      const started = await fetch("/api/start", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lessonId:mappedUnit})});
      if (!started.ok) throw new Error("导师服务暂时不可用；可继续读固定讲解。");
      shortTutorSession = {key:`${activeProfileId}:${mappedUnit}`,id:(await started.json()).sessionId};
    }
    const style = {explain:"请直接讲清楚，先给判断依据，再用一个例子核对。",hint:"只给一条帮助判断的线索，暂不说出题目答案。",example:"换一个正例和反例来解释，并点出变化的条件。"}[mode] || "请讲解。";
    const response = await fetch("/api/ask", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:shortTutorSession.id,question:`在“${lesson.title}”短课中，${style}学生的问题：${question}`})});
    const body = await response.json();
    if (!response.ok) { shortTutorSession.id = null; throw new Error(body.error || "导师暂时不可用；可继续读固定讲解。"); }
    return `AI 导师的解释：${body.answer}${body.checkQuestion ? `\n想一想：${body.checkQuestion}` : ""}\n请用本课定义和固定解析核对。`;
  }

  function onAction(event) {
    const target = event.target.closest("button"); if (!target) return;
    const mainReason = byId("main-reason");
    const transferReasonField = byId("transfer-reason");
    if (mainReason) practiceReason = mainReason.value;
    if (transferReasonField) transferReason = transferReasonField.value;
    if (target.matches("[data-open-glossary]")) { openGlossary(); return; }
    if (target.dataset.openTerm) { openGlossary(unitTermSearch(target.dataset.openTerm)); return; }
    if (target.dataset.go === "review") { renderReview(); return; }
    if (target.dataset.go === "records") { renderRecords(); return; }
    if (target.dataset.go === "exam") { renderExam(); return; }
    if (target.dataset.go?.startsWith("simulation-")) { showSimulation(target.dataset.go.replace("simulation-", "")); return; }
    if (target.dataset.goLesson) { openLesson(target.dataset.goLesson); return; }
    if (target.dataset.goUnit) { openUnit(target.dataset.goUnit); return; }
    if (target.dataset.action === "back-home") { openHome(); return; }
    if (target.dataset.action === "back-review-list") { renderReview(); return; }
    if (target.dataset.action === "start-lesson-review") { openLessonReview(target.dataset.lesson); return; }
    if (target.dataset.action === "open-lesson-from-review") { openLesson(target.dataset.lesson); return; }
    if (target.dataset.action === "delay-lesson-review") {
      const state = data.lessons[target.dataset.lesson];
      if (state?.review && !state.review.lastAttempt) { state.review.dueAt = Date.now() + Number(target.dataset.days)*86400000; saveData(); renderReview(); }
      return;
    }
    if (target.dataset.action === "export-records") { exportRecords(); return; }
    if (target.dataset.action === "open-exam-case") { showExamCase(target.dataset.case); return; }
    if (target.dataset.action === "edit-exam-case") { examEditingId = target.dataset.case; renderExam(); byId("exam-form")?.scrollIntoView({behavior:"smooth"}); return; }
    if (target.dataset.action === "delete-exam-case") {
      const id = target.dataset.case;
      const item = data.examCases.find((entry) => entry.id === id);
      if (!item || !window.confirm(`删除“${item.title}”及其本机图片？此操作无法撤销。`)) return;
      window.ChemistryExamFiles.remove(activeProfileId, id).then(() => {
        data.examCases = data.examCases.filter((entry) => entry.id !== id);
        saveData(); renderExam();
      }).catch(() => showToast("本机图片未能删除，题目记录仍保留。"));
      return;
    }
    if (target.dataset.action === "cancel-exam-edit") { examEditingId = null; examDraftFile = null; renderExam(); return; }
    if (target.dataset.action === "next-unit") { const index = PRODUCT.units.findIndex((unit) => unit.id === activeUnit.id); openUnit(PRODUCT.units[(index+1)%PRODUCT.units.length].id); return; }
    if (target.dataset.action === "skip-precheck") { skipPrecheck(); return; }
    if (target.dataset.action === "precheck-answer") { precheckChoice = Number(target.dataset.choice); precheckExpanded = true; renderUnit(); return; }
    if (target.dataset.action === "enter-after-precheck" || target.dataset.action === "start-study") { enterUnitStudy(); return; }
    if (target.dataset.action === "reset-precheck") { const p=progressFor(activeUnit.id);delete p.prerequisite;precheckChoice=null;precheckExpanded=true;saveData();renderUnit();return; }
    if (target.dataset.action === "open-practice") { document.getElementById("practice-slot").innerHTML=renderPractice(activeUnit); document.getElementById("practice-slot").scrollIntoView({behavior:"smooth",block:"start"});return; }
    if (target.dataset.action === "show-hint" || target.dataset.action === "show-transfer-hint") { activeHint=true; itemSupportUsed=true; const slot=byId("practice-slot");slot.innerHTML=renderPractice(activeUnit);return; }
    if (target.dataset.action === "choose-main") { practiceChoice=Number(target.dataset.choice); const slot=byId("practice-slot");slot.innerHTML=renderPractice(activeUnit);return; }
    if (target.dataset.action === "submit-main") { submitMain();return; }
    if (target.dataset.action === "choose-transfer") { transferChoice=Number(target.dataset.choice);const slot=byId("practice-slot");slot.innerHTML=renderPractice(activeUnit);return; }
    if (target.dataset.action === "submit-transfer") { submitTransfer();return; }
    if (target.dataset.action === "ask-tutor") { askTutor();return; }
    if (target.dataset.action === "open-simulation") { showSimulation(target.dataset.sim);return; }
    if (target.dataset.action === "toggle-simulation") { simState.playing=!simState.playing;renderConductivitySimulation();return; }
    if (target.dataset.action === "select-sample") { simState.sample=target.dataset.sample;simState.playing=false;saveSimulationState();renderConductivitySimulation();return; }
    if (target.dataset.action === "select-pair") { simState.mix=target.dataset.pair;simState.mixed=false;saveSimulationState();renderPrecipitationSimulation();return; }
    if (target.dataset.action === "mix-solutions") { simState.mixed=!simState.mixed;saveSimulationState();renderPrecipitationSimulation();return; }
    if (target.dataset.action === "start-review") { startReview(target.dataset.unit);return; }
    if (target.dataset.action === "move-review") { moveReview(target.dataset.unit,Number(target.dataset.days));return; }
    if (target.dataset.action === "choose-review") { answerReview(target.dataset.unit,Number(target.dataset.choice));return; }
  }

  function unitTermSearch(id) { return PRODUCT.glossary.find((item) => item.id === id)?.term || ""; }

  function submitMain() {
    const question = currentPractice(activeUnit); if (!question || practiceChoice === null) return;
    const record = recordAnswer(question.id, question.skill, practiceChoice, question.answer, activeHint || itemSupportUsed, practiceReason, assessmentGuide(question));
    practiceChoice=null;practiceReason="";activeHint=false;itemSupportUsed=false;saveData();
    const slot=byId("practice-slot");slot.innerHTML=renderPractice(activeUnit);
    if (!record.correct) showToast("已记录这次首答。看完解析后，再用迁移题检查思路。");
  }

  function submitTransfer() {
    const question=currentPractice(activeUnit);if(!question||transferChoice===null)return;
    const record=recordAnswer(`${question.id}:transfer`, question.skill, transferChoice, question.transfer.answer, activeHint || itemSupportUsed, transferReason, assessmentGuide(question, true));
    practiceChoice=null;transferChoice=null;practiceReason="";transferReason="";activeHint=false;itemSupportUsed=false;maybeCompleteUnit(activeUnit);saveData();
    const slot=byId("practice-slot");slot.innerHTML=renderPractice(activeUnit);
    if (!record.correct) showToast("迁移题已记录。解析会指出哪项条件改变了判断。");
  }

  function moveReview(unitId, days) {
    const review=data.reviews[unitId];if(!review)return;
    review.dueAt=Date.now()+days*86400000;review.intervalDays=days;review.doneAt=null;saveData();renderReview();
  }

  function answerReview(unitId, choice) {
    const unit=unitById(unitId);const review=data.reviews[unitId];if(!unit||!review||review.dueAt>Date.now())return;
    const question=reviewQuestions(unit).find((item)=>item.id===review.currentQuestionId)||nextReviewQuestion(unit);if(!question)return;
    const correct=choice===question.answer;const now=Date.now();
    data.attempts.push({unitId,itemId:question.id,skill:unit.skill,choice,correct,helpUsed:false,firstForItem:true,delayed:true,contentRevision:PRODUCT.metadata.contentRevision,occurredAt:now});
    review.doneAt=now;review.lastOutcome=correct?"correct":"incorrect";review.dueAt=now+(correct?7:1)*86400000;review.intervalDays=correct?7:1;
    saveData();
    const output=byId("review-feedback");output.className=`feedback-box${correct?"":" warn"}`;output.textContent=`${correct?"这次延迟首答正确。":"这次需要重新看一下关键判据。"} ${question.why} 结果只说明这道复测题的表现。`;
    document.querySelectorAll('[data-action="choose-review"]').forEach((button)=>{button.disabled=true;button.classList.toggle("correct",Number(button.dataset.choice)===question.answer);button.classList.toggle("incorrect",Number(button.dataset.choice)===choice&&!correct);});
  }

  function renderRecords() {
    persistRoute({view:"records"});
    setView("records", "学习记录");
    const cards = COURSE.lessons.map((lesson) => {
      const state = data.lessons[lesson.id];
      const answers = Object.values(state?.answers || {});
      const independent = answers.filter((answer) => answer.correct && !answer.helped && !answer.revealed).length;
      const read = ["intro","map","compare","worked","memory"].filter((step) => state?.visited?.includes(step)).length;
      const delayed = state?.review?.lastAttempt;
      return `<article class="review-item"><span class="eyebrow">${esc(lesson.title)} · ${read} / 5 个讲解步骤</span><h2>${esc(lesson.question)}</h2><p>本节三题：${answers.length} 题有记录，其中 ${independent} 题无提示首答正确。${delayed ? `间隔后新题：${delayed.correct ? "答对" : "需复看"}（${localDate(delayed.at)}）。` : "间隔后尚无新题表现。"}</p><button type="button" class="button button-secondary" data-go-lesson="${lesson.id}">打开本节与逐题反馈 →</button></article>`;
    }).join("");
    const oldCount = data.attempts.filter((item) => PRODUCT.units.some((unit) => unit.id === item.unitId)).length;
    byId("records-view").innerHTML = `<span class="eyebrow">当前本机学习者</span><h1>学习记录</h1><p class="lead">“看过”“首次回答”“提示后回答”“间隔后新题”分开呈现；一次正确不等于长期掌握。</p><p class="source-note">旧四个综合单元另有 ${oldCount} 条答题记录，可从首页专题入口查看。试卷复盘题干与核对状态存于本机；原图存在本机浏览器的图片库中，不随 JSON 导出。</p><div class="unit-actions"><button type="button" class="button button-secondary" data-action="export-records">导出当前档案 JSON</button><button type="button" class="button button-secondary" data-action="back-home">回课程首页</button></div>${cards}`;
  }

  function exportRecords() {
    const contents = JSON.stringify({ exportedAt:new Date().toISOString(), profileId:activeProfileId, courseRevision:COURSE.revision, data }, null, 2);
    const url = URL.createObjectURL(new Blob([contents], {type:"application/json"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = `chemistry-learning-${activeProfileId}.json`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderExam() {
    persistRoute({view:"exam"});
    setView("exam", "试卷复盘");
    const view = byId("exam-view");
    const topics = COURSE.lessons.map((lesson) => `<option value="${esc(lesson.id)}">${esc(lesson.title)}</option>`).join("");
    const cases = data.examCases.map((item) => `<article class="review-item"><span class="eyebrow">${item.confirmed ? "题干已人工核对" : "题干待核对"} · ${localDate(item.createdAt)}</span><h2>${esc(item.title)}</h2><p>${esc(item.questionText.slice(0,110))}${item.questionText.length > 110 ? "…" : ""}</p><button type="button" class="button button-secondary" data-action="open-exam-case" data-case="${esc(item.id)}">查看原图、文字和相关短课 →</button></article>`).join("");
    view.innerHTML = `<span class="eyebrow">本机试卷复盘</span><h1>先核对题，再找知识缺口</h1><p class="lead">照片留在此浏览器的本机图片库；题目文字由你核对。这里没有自动 OCR 或自动判分，未确认的内容不会变成学习结论。</p><div class="exam-workspace"><article class="content-card"><h2>${examEditingId ? "修改题目记录" : "添加一道题"}</h2><form id="exam-form"><label class="reason-label" for="exam-title">题目名称</label><input id="exam-title" class="search-input" name="title" maxlength="100" required placeholder="例如：本次考试第 8 题"><label class="reason-label" for="exam-file">试卷图片（可选，本机保存）</label><input id="exam-file" name="image" type="file" accept="image/*,.heic,.heif"><p class="muted">如果浏览器无法预览 HEIC，可手动录入题干；原文件仍可在本机图片库保存。</p><div id="exam-new-preview"></div><label class="reason-label" for="exam-question">题干与关键条件（人工核对）</label><textarea id="exam-question" class="reason-input" name="questionText" maxlength="4000" placeholder="把需要复盘的题干与关键条件写在这里"></textarea><label class="reason-label" for="exam-answer">我的作答</label><textarea id="exam-answer" class="reason-input" name="studentAnswer" maxlength="1500"></textarea><label class="reason-label" for="exam-reference">核对依据或参考答案（如已核实）</label><textarea id="exam-reference" class="reason-input" name="referenceAnswer" maxlength="1500" placeholder="未核实可留空；系统不会猜答案"></textarea><label class="reason-label" for="exam-topic">相关短课</label><select id="exam-topic" class="search-input" name="topic"><option value="">暂不确定</option>${topics}</select><label class="exam-checkbox"><input type="checkbox" name="confirmed" value="yes"> 我已对照原图核对题干和答案条件</label><div class="unit-actions"><button type="submit" class="button">保存本机复盘</button>${examEditingId ? '<button type="button" class="button button-secondary" data-action="cancel-exam-edit">取消修改</button>' : ""}</div></form></article><aside id="exam-case-detail" class="content-card"><h2>从试题回到课程</h2><p>保存题目后，在这里对照照片与文字。题目有依据时再决定补哪节课；看错题也可以自己标注。</p></aside></div><div class="section-heading"><div><span class="eyebrow">本机记录</span><h2>已保存的题</h2></div></div>${cases || '<div class="empty-state">还没有题目。可先录入题干和相关知识，不上传任何文件。</div>'}`;
    if (examEditingId) {
      const item = data.examCases.find((entry) => entry.id === examEditingId);
      if (item) {
        const form = byId("exam-form");
        form.elements.title.value = item.title;
        form.elements.questionText.value = item.questionText;
        form.elements.studentAnswer.value = item.studentAnswer;
        form.elements.referenceAnswer.value = item.referenceAnswer;
        form.elements.topic.value = item.topic || "";
        form.elements.confirmed.checked = Boolean(item.confirmed);
      }
    }
  }

  async function saveExamCase(form) {
    const fields = new FormData(form);
    const title = String(fields.get("title") || "").trim();
    const questionText = String(fields.get("questionText") || "").trim();
    const confirmed = fields.get("confirmed") === "yes";
    if (!title) { showToast("请先填写题目名称。"); return; }
    if (confirmed && !questionText) { showToast("确认题干前，请先录入核对过的题目文字。"); return; }
    const existing = examEditingId && data.examCases.find((item) => item.id === examEditingId);
    const id = existing?.id || `exam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
    let hasImage = Boolean(existing?.hasImage);
    if (examDraftFile) {
      try { await window.ChemistryExamFiles.put(activeProfileId, id, examDraftFile); hasImage = true; }
      catch { showToast("图片未保存；请检查浏览器本机存储。题目文字仍可保存。"); }
    }
    const item = {
      id, title, questionText, studentAnswer:String(fields.get("studentAnswer") || "").trim(),
      referenceAnswer:String(fields.get("referenceAnswer") || "").trim(), topic:String(fields.get("topic") || ""),
      confirmed, hasImage, createdAt:existing?.createdAt || Date.now(), updatedAt:Date.now()
    };
    if (existing) Object.assign(existing, item);
    else data.examCases.unshift(item);
    examDraftFile = null; examEditingId = null;
    if (examPreviewUrl) { URL.revokeObjectURL(examPreviewUrl); examPreviewUrl = null; }
    saveData(); renderExam(); await showExamCase(id);
  }

  async function showExamCase(id) {
    const item = data.examCases.find((entry) => entry.id === id);
    const detail = byId("exam-case-detail");
    if (!item || !detail) return;
    if (examDetailUrl) { URL.revokeObjectURL(examDetailUrl); examDetailUrl = null; }
    let photo = "<p class=\"muted\">此题未保存图片；可继续依据人工核对的题干复盘。</p>";
    if (item.hasImage) {
      try {
        const file = await window.ChemistryExamFiles.get(activeProfileId, id);
        if (file) {
          examDetailUrl = URL.createObjectURL(file);
          photo = `<div class="exam-image-wrap"><img id="exam-saved-image" src="${examDetailUrl}" alt="${esc(item.title)}的原试卷照片"><p id="exam-image-fallback" hidden>此浏览器不能直接预览该图片格式。原文件已保存在本机，可<a href="${examDetailUrl}" download="${esc(file.name || "exam-image")}">下载原文件查看</a>。</p></div>`;
        }
      } catch { photo = "<p class=\"muted\">暂时无法从本机图片库读取原图；请核对浏览器存储。</p>"; }
    }
    const topic = COURSE.lessons.find((lesson) => lesson.id === item.topic);
    detail.innerHTML = `<span class="eyebrow">${item.confirmed ? "题干已人工核对" : "题干待核对"}</span><h2>${esc(item.title)}</h2>${photo}<div class="exam-text"><h3>题干与条件</h3><p>${esc(item.questionText || "尚未录入；不能据此诊断。")}</p><h3>我的作答</h3><p>${esc(item.studentAnswer || "尚未录入")}</p><h3>核对依据</h3><p>${esc(item.referenceAnswer || "尚未提供核实的参考答案；系统不判断对错。")}</p><h3>相关知识</h3><p>${topic ? esc(topic.title) : "尚未确定；先读清题目条件。"}${topic && !item.confirmed ? "（题干未核对，关联仅为手动标记）" : ""}</p></div><div class="unit-actions">${topic ? `<button type="button" class="button" data-go-lesson="${topic.id}">去学这节短课 →</button>` : ""}<button type="button" class="button button-secondary" data-action="edit-exam-case" data-case="${esc(id)}">修正这题</button><button type="button" class="button button-secondary" data-action="delete-exam-case" data-case="${esc(id)}">删除这条记录</button></div>`;
    const image = byId("exam-saved-image");
    if (image) image.addEventListener("error", () => { image.hidden = true; byId("exam-image-fallback").hidden = false; }, {once:true});
  }

  byId("main-content").addEventListener("click", onAction);
  byId("main-content").addEventListener("input", (event) => {
    if (event.target.id === "main-reason") practiceReason = event.target.value;
    if (event.target.id === "transfer-reason") transferReason = event.target.value;
  });
  byId("main-content").addEventListener("change", (event) => {
    if (event.target.id !== "exam-file") return;
    examDraftFile = event.target.files?.[0] || null;
    if (examPreviewUrl) URL.revokeObjectURL(examPreviewUrl);
    examPreviewUrl = examDraftFile ? URL.createObjectURL(examDraftFile) : null;
    const preview = byId("exam-new-preview");
    if (preview) preview.innerHTML = examPreviewUrl ? `<img src="${examPreviewUrl}" alt="本次所选试卷图片的临时预览"><p>若此格式无法预览，仍可在保存后下载原文件。</p>` : "";
  });
  byId("main-content").addEventListener("submit", (event) => {
    if (event.target.id !== "exam-form") return;
    event.preventDefault();
    saveExamCase(event.target);
  });
  byId("unit-cards").addEventListener("click", onAction);
  document.querySelectorAll(".sidebar [data-go]").forEach((button) => button.addEventListener("click", onAction));
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => byId("glossary-dialog").close()));
  byId("glossary-dialog").addEventListener("close", () => { if (glossaryReturnFocus?.isConnected) glossaryReturnFocus.focus(); });
  byId("term-search").addEventListener("input", (event) => renderGlossary(event.target.value));
  byId("profile-select").addEventListener("change", (event) => switchProfile(event.target.value));
  byId("new-profile").addEventListener("click", createProfile);
  byId("clear-profile").addEventListener("click", clearCurrentProfile);
  byId("mobile-menu").addEventListener("click", () => {const sidebar=document.querySelector(".sidebar");const open=sidebar.classList.toggle("open");byId("mobile-menu").setAttribute("aria-expanded",String(open));});
  byId("continue-button").addEventListener("click", () => {const recommendation=nextRecommendation();recommendation.type==="lesson-review"?openLessonReview(recommendation.lessonId):recommendation.type==="lesson"?openLesson(recommendation.lessonId):recommendation.type==="review"?renderReview():openUnit(recommendation.unitId);});

  coursePlayer = window.createChemistryCoursePlayer({root:byId("lesson-view"),getData:() => data,save:saveData,openGlossary,goHome:openHome,goNext:openNextLesson,showSimulation,askTutor:askShortTutor,onStep:(id,step) => persistRoute({view:"lesson",id,step})});
  const initialRoute = data.activeRoute;
  history.replaceState({chemistryRoute:initialRoute || {view:"home"}}, "", location.href);
  renderHome();renderNav();
  restoringHistory = true;
  if (initialRoute?.view === "lesson") openLesson(initialRoute.id, {step:initialRoute.step});
  else if (initialRoute?.view === "unit") openUnit(initialRoute.id);
  else if (initialRoute?.view === "review") renderReview();
  else if (initialRoute?.view === "records") renderRecords();
  else if (initialRoute?.view === "exam") renderExam();
  else if (initialRoute?.view?.startsWith("simulation-")) showSimulation(initialRoute.view.slice("simulation-".length));
  restoringHistory = false;
  window.addEventListener("popstate", (event) => {
    const route = event.state?.chemistryRoute;
    if (!route) return;
    restoringHistory = true;
    if (route.view === "lesson") openLesson(route.id, {step:route.step || "home"});
    else if (route.view === "unit") openUnit(route.id);
    else if (route.view === "review") renderReview();
    else if (route.view === "records") renderRecords();
    else if (route.view === "exam") renderExam();
    else if (route.view?.startsWith("simulation-")) showSimulation(route.view.slice("simulation-".length));
    else openHome();
    restoringHistory = false;
  });
  window.addEventListener("storage", (event) => {
    if (event.key === PROFILES_KEY) { profiles = readProfiles(); renderProfileControl(); }
    if (event.key === KEY) { data = loadData(); renderHome(); renderNav(); }
  });
})();
