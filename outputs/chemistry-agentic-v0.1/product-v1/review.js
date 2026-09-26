(() => {
  "use strict";
  const PRODUCT = window.CHEMISTRY_PRODUCT_V1;
  const COURSE = window.CHEMISTRY_SHORT_COURSE;
  const STORAGE_KEY = "chemistry-learning-content-review-v1";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
  const checks = {
    unit: [
      ["facts", "概念、化学事实、条件与边界"],
      ["teaching", "先修、解释顺序、正反例与记忆要求"],
      ["source", "原图、文字来源与素材使用范围"],
      ["curriculum", "教材版次、课标及地区考试适配"]
    ],
    question: [
      ["facts", "题干、条件与科学事实"],
      ["answer", "标准答案、解析与守恒/分类判据"],
      ["diagnosis", "错误诊断具体且不把推测当成学生事实"],
      ["exam", "考法标签准确，并明确题目自编、非真题"],
      ["rubric", "解释自查要点能帮助学生核对推理"]
    ],
    glossary: [
      ["definition", "定义准确且适合当前学段"],
      ["examples", "正例、反例和边界能区分易混概念"],
      ["wording", "名称、符号、状态及例子表述一致"],
      ["source", "依据或待核事项已记录"]
    ],
    simulation: [
      ["states", "选择状态与粒子模型规则正确"],
      ["chemistry", "观察结果和解释符合题给条件"],
      ["limits", "示意边界、条件限制和误读风险明确"],
      ["accessibility", "文本替代说明能独立传达关键结果"]
    ],
    shortLesson: [
      ["sequence", "先修回顾、原图、正反例、示范与记忆卡顺序合理"],
      ["facts", "定义、化学事实、条件和边界准确"],
      ["image", "原课件图片与文字关系对应，显示完整"],
      ["source", "考试方向与生活、历史来源可核查，未暗示原创题是真题"]
    ],
    shortQuestion: [
      ["stem", "题干对象、状态和条件明确"],
      ["answer", "答案和解析准确"],
      ["transfer", "考点、记忆句、错因和举一反三可用于教学"],
      ["source", "原创题及考法依据标识清楚"]
    ]
  };
  const simulationReviews = [
    { id:"conductivity", title:"导电粒子模型", summary:"覆盖 NaCl 晶体/水溶液/熔融体、蔗糖水溶液、HCl(g)/盐酸、极高纯度水及铜丝。审校状态、载流粒子、灯泡提示、定性浓度滑块和非比例声明。" },
    { id:"precipitation", title:"沉淀生成模型", summary:"覆盖 BaSO₄、AgCl、CaCO₃ 沉淀与 NaCl + KNO₃ 无净反应。审校反应式、旁观离子、溶解性/浓度边界、示意颗粒与替代文本。" }
  ];
  let state = readState();

  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return saved && saved.schema === 1 && saved.targets ? saved : { schema:1, targets:{} };
    } catch { return { schema:1, targets:{} }; }
  }

  function targetData(id) {
    const old = state.targets[id];
    const revision = id.startsWith("short-") ? COURSE.revision : PRODUCT.metadata.contentRevision;
    if (!old || old.revision !== revision) return { revision, checks:{}, notes:"", updatedAt:null };
    return { ...old, checks:old.checks || {}, notes:old.notes || "" };
  }

  function targetStatus(id, required) {
    const record = targetData(id);
    const completed = required.filter(([key]) => record.checks[key]).length;
    return completed === 0 ? "尚未自查" : completed === required.length ? "本地自查项已完成 · 待教师复核" : `自查中 ${completed}/${required.length} · 待教师复核`;
  }

  function renderChecks(id, kind) {
    const record = targetData(id);
    return checks[kind].map(([key, label]) => `<label class="review-check"><input type="checkbox" data-check-target="${esc(id)}" data-check-key="${key}" ${record.checks[key] ? "checked" : ""}><span>${esc(label)}</span></label>`).join("");
  }

  function renderNotes(id, label) {
    const record = targetData(id);
    return `<label class="review-notes-label" for="note-${esc(id)}">${label}</label><textarea id="note-${esc(id)}" class="review-notes" data-note-target="${esc(id)}" maxlength="1800" placeholder="记录待核实的问题、出处或修改建议；不要填写学生姓名、学号等个人信息。">${esc(record.notes)}</textarea><div class="review-updated" data-updated-target="${esc(id)}">${record.updatedAt ? `本机记录于 ${esc(new Date(record.updatedAt).toLocaleString("zh-CN"))}` : "尚无本机自查记录"}</div>`;
  }

  function renderQuestion(unit, question, index) {
    const guide = PRODUCT.assessmentGuides?.[question.id] || {};
    const rubric = PRODUCT.reasonRubrics?.[question.id] || {};
    const target = `question:${question.id}`;
    const transfer = question.transfer;
    const correct = question.options?.[question.answer] ?? "正确";
    const transferCorrect = transfer.options?.[transfer.answer] ?? (transfer.answer === 0 ? "正确" : "不正确");
    return `<details class="review-question">
      <summary><span>练习 ${index + 1} · ${esc(question.role)}</span><span class="review-status" data-status-target="${esc(target)}">${targetStatus(target, checks.question)}</span></summary>
      <div class="review-question-body">
        <section class="review-prompt"><span class="eyebrow">主练习 · ${esc(question.skill)}</span><p><strong>${esc(question.stem)}</strong></p><p><b>标准答案：</b>${esc(correct)}</p><p><b>考点：</b>${esc(question.point)}</p><p><b>参考思路：</b>${esc(question.why)}</p><p><b>可能错因：</b>${esc(guide.mainErrorType || "待补充")} · ${esc(guide.mainMisconception || "待核验")}</p><p><b>解释自查要点：</b>${esc((rubric.main || []).join("；"))}</p></section>
        <section class="review-prompt transfer-prompt"><span class="eyebrow">迁移题</span><p><strong>${esc(transfer.stem)}</strong></p><p><b>标准答案：</b>${esc(transferCorrect)}</p><p><b>参考思路：</b>${esc(transfer.why)}</p><p><b>可能错因：</b>${esc(guide.transferErrorType || "待补充")} · ${esc(guide.transferMisconception || "待核验")}</p><p><b>解释自查要点：</b>${esc((rubric.transfer || []).join("；"))}</p></section>
        <p class="review-pattern"><b>考法能力：</b>${esc(guide.pattern || question.point)} <span>课程自编模式；没有映射到单道历年真题。</span></p>
        <div class="review-checks">${renderChecks(target, "question")}</div>
        ${renderNotes(target, "本题自查意见")}
      </div>
    </details>`;
  }

  function renderUnit(unit) {
    const target = `unit:${unit.id}`;
    return `<details class="review-unit">
      <summary><span class="review-unit-title"><b>${esc(unit.number)} · ${esc(unit.title)}</b><small>${esc(unit.objective)}</small></span><span class="review-status" data-status-target="${esc(target)}">${targetStatus(target, checks.unit)}</span></summary>
      <div class="review-unit-body">
        <div class="review-unit-facts"><p><b>教学解释：</b>${esc(unit.explanation)}</p>${unit.guidedLesson ? `<p><b>图示带读：</b>${esc(unit.guidedLesson.intro)}</p>${unit.guidedLesson.steps.map((step, index) => `<p><b>带读 ${index + 1} · ${esc(step.title)}：</b>${esc(step.explain)} 正例：${esc(step.examples.join("；"))} 本步记忆：${esc(step.takeaway)}</p>`).join("")}` : ""}<p><b>必记规则：</b>${esc(unit.remember)}</p><p><b>内容来源：</b>${esc(unit.source)}</p></div>
        <div class="review-checks">${renderChecks(target, "unit")}</div>
        ${renderNotes(target, "单元自查意见")}
        <h2 class="review-subheading">逐题复核 · 主练习和迁移题一并展示</h2>
        ${unit.practice.map((question, index) => renderQuestion(unit, question, index)).join("")}
      </div>
    </details>`;
  }

  function renderGlossary(item) {
    const target = `glossary:${item.id}`;
    return `<details class="review-question"><summary><span>${esc(item.term)} · 术语词条</span><span class="review-status" data-status-target="${esc(target)}">${targetStatus(target, checks.glossary)}</span></summary><div class="review-question-body"><div class="review-prompt"><p><b>定义：</b>${esc(item.definition)}</p><p><b>正例：</b>${esc(item.examples.join("；"))}</p><p><b>反例：</b>${esc(item.counterexamples.join("；"))}</p><p><b>边界：</b>${esc(item.boundary)}</p></div><div class="review-checks">${renderChecks(target, "glossary")}</div>${renderNotes(target, "术语自查意见")}</div></details>`;
  }

  function renderSimulation(item) {
    const target = `simulation:${item.id}`;
    return `<article class="review-item"><span class="eyebrow">互动模型</span><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><span class="review-status" data-status-target="${esc(target)}">${targetStatus(target, checks.simulation)}</span><div class="review-checks">${renderChecks(target, "simulation")}</div>${renderNotes(target, "模型自查意见")}</article>`;
  }

  function renderShortQuestion(lesson, question, index, isReview = false) {
    const target = `short-question:${lesson.id}:${isReview ? "review" : index + 1}`;
    const answer = question.options[question.answer];
    return `<details class="review-question"><summary><span>${isReview ? "间隔复习题" : `第 ${index + 1} 题 · ${esc(question.role)}`}</span><span class="review-status" data-status-target="${target}">${targetStatus(target, checks.shortQuestion)}</span></summary><div class="review-question-body"><section class="review-prompt"><p><b>题干：</b>${esc(question.stem)}</p><p><b>选项：</b>${question.options.map(esc).join(" / ")}</p><p><b>答案：</b>${esc(answer)}</p><p><b>解析：</b>${esc(question.why)}</p>${isReview ? "" : `<p><b>考点：</b>${esc(question.point)}</p><p><b>要记：</b>${esc(question.remember)}</p><p><b>常见错因：</b>${esc(question.wrong)}</p><p><b>条件变化：</b>${esc(question.change)}</p>`}</section><div class="review-checks">${renderChecks(target, "shortQuestion")}</div>${renderNotes(target, "本题自查意见")}</div></details>`;
  }

  function renderShortLesson(lesson) {
    const target = `short-lesson:${lesson.id}`;
    return `<details class="review-unit"><summary><span class="review-unit-title"><b>${esc(lesson.id.toUpperCase())} · ${esc(lesson.title)}</b><small>${esc(lesson.question)}</small></span><span class="review-status" data-status-target="${target}">${targetStatus(target, checks.shortLesson)}</span></summary><div class="review-unit-body"><div class="review-unit-facts"><p><b>初中回顾：</b>${esc(lesson.prior)}</p><p><b>原图：</b>${esc(lesson.image || "文字关系")}</p><p><b>关系：</b>${esc(lesson.map)}</p><p><b>定义：</b>${esc(lesson.definition)}</p><p><b>记忆：</b>${esc(lesson.mnemonic)}</p><p><b>边界：</b>${esc(lesson.boundary)}</p><p><b>考试方向：</b><a href="${esc(lesson.examRef.url)}" target="_blank" rel="noopener noreferrer">${esc(lesson.examRef.label)}</a>；三题均为课程原创。</p></div><div class="review-checks">${renderChecks(target, "shortLesson")}</div>${renderNotes(target, "本课自查意见")}<h2 class="review-subheading">逐题复核</h2>${lesson.questions.map((question,index) => renderShortQuestion(lesson,question,index)).join("")}${renderShortQuestion(lesson,lesson.review,0,true)}</div></details>`;
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { window.alert("浏览器本地存储不可用，审校记录没有保存。"); }
  }

  function updateProgress() {
    const targets = COURSE.lessons.flatMap((lesson) => [
      {id:`short-lesson:${lesson.id}`,checks:checks.shortLesson},
      ...lesson.questions.map((_,index) => ({id:`short-question:${lesson.id}:${index + 1}`,checks:checks.shortQuestion})),
      {id:`short-question:${lesson.id}:review`,checks:checks.shortQuestion}
    ]).concat(PRODUCT.units.flatMap((unit) => [
      { id:`unit:${unit.id}`, checks:checks.unit },
      ...unit.practice.map((question) => ({ id:`question:${question.id}`, checks:checks.question }))
    ])).concat(
      PRODUCT.glossary.map((item) => ({ id:`glossary:${item.id}`, checks:checks.glossary })),
      simulationReviews.map((item) => ({ id:`simulation:${item.id}`, checks:checks.simulation }))
    );
    const completed = targets.filter((target) => target.checks.every(([key]) => targetData(target.id).checks[key])).length;
    document.getElementById("review-progress").textContent = `本地自查 ${completed} / ${targets.length} 项已完成 · 教师复核仍待进行`;
  }

  function persistTarget(id, mutate) {
    const record = targetData(id);
    mutate(record);
    record.updatedAt = Date.now();
    state.targets[id] = record;
    saveState();
    const status = document.querySelector(`[data-status-target="${CSS.escape(id)}"]`);
    const type = id.startsWith("short-lesson:") ? "shortLesson" : id.startsWith("short-question:") ? "shortQuestion" : id.startsWith("unit:") ? "unit" : id.startsWith("glossary:") ? "glossary" : id.startsWith("simulation:") ? "simulation" : "question";
    if (status) status.textContent = targetStatus(id, checks[type]);
    const updated = document.querySelector(`[data-updated-target="${CSS.escape(id)}"]`);
    if (updated) updated.textContent = `本机记录于 ${new Date(record.updatedAt).toLocaleString("zh-CN")}`;
    updateProgress();
  }

  document.getElementById("revision-label").textContent = `短课版本：${COURSE.revision} · 综合内容：${PRODUCT.metadata.contentRevision} · 更新内容后旧自查记录会显示为过期`;
  document.getElementById("review-content").innerHTML = `<section class="review-section"><h2>教材短课 · ${COURSE.lessons.length} 节</h2><p>每节含三道原创练习和一道新的间隔复习题；逐项核对事实、教学路径及来源边界。</p>${COURSE.lessons.map(renderShortLesson).join("")}</section><section class="review-section"><h2>原有综合单元 · ${PRODUCT.units.length} 个</h2>${PRODUCT.units.map(renderUnit).join("")}</section><section class="review-section"><h2>术语词条 · ${PRODUCT.glossary.length} 项</h2><p>每条都展示定义、正反例与边界说明，审校记录按词条版本单独保存。</p>${PRODUCT.glossary.map(renderGlossary).join("")}</section><section class="review-section"><h2>互动模型 · ${simulationReviews.length} 项</h2><p>模型规则由课程代码控制。审校清单用于记录事实边界、状态表现和无障碍文本检查。</p>${simulationReviews.map(renderSimulation).join("")}</section>`;
  document.getElementById("review-content").addEventListener("change", (event) => {
    const input = event.target.closest("input[data-check-target]");
    if (!input) return;
    persistTarget(input.dataset.checkTarget, (record) => {
      record.checks[input.dataset.checkKey] = input.checked;
    });
  });
  document.getElementById("review-content").addEventListener("input", (event) => {
    const textarea = event.target.closest("textarea[data-note-target]");
    if (!textarea) return;
    persistTarget(textarea.dataset.noteTarget, (record) => { record.notes = textarea.value; });
  });
  document.getElementById("export-review").addEventListener("click", () => {
    const output = {
      schema:1,
      exportedAt:new Date().toISOString(),
      contentRevision:{shortCourse:COURSE.revision,comprehensive:PRODUCT.metadata.contentRevision},
      scope:"本地自查记录，不代表教师独立审校、正式批准或课程发布",
      targets:state.targets
    };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `chemistry-content-review-${PRODUCT.metadata.contentRevision}.json`;
    link.click(); URL.revokeObjectURL(url);
  });
  updateProgress();
})();
