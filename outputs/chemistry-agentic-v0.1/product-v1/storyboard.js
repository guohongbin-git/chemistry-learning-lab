(() => {
  "use strict";

  const KEY = "chemistry-product-ux-storyboard-v1.1";
  const ORIGINAL_IMAGE = "../assets/classification-tree.png";
  const steps = [
    ["intro", "看到问题"], ["map", "沿原图看分类"], ["compare", "比较四份样品"],
    ["worked", "跟着示范判断"], ["memory", "记住两句定义"],
    ["q1", "第 1 题 · 规则"], ["q2", "第 2 题 · 反例"], ["q3", "第 3 题 · 迁移"],
    ["summary", "本次小结"]
  ];
  const questions = {
    q1: {
      role: "规则辨认", title: "两种元素，等于混合物吗？",
      stem: "只含 H₂O 的样品含 H、O 两种元素，所以是混合物。",
      options: ["正确", "不正确"], answer: 1,
      point: "纯净物与混合物按组成物质种类判断。",
      remember: "混合物由两种或两种以上物质组成。",
      why: "题设样品只含 H₂O 一种物质。H、O 是两种元素，不是两种物质。",
      possible: "你可能把元素种类当成物质种类；先回到四份样品对照。",
      change: "只含 CO₂ 的样品也有两种元素，但仍是一种物质。",
      target: "compare"
    },
    q2: {
      role: "反例辨析", title: "同一种元素，等于一种物质吗？",
      stem: "O₂ 与 O₃ 混在一起，只含氧元素，因此是纯净物。",
      options: ["正确", "不正确"], answer: 1,
      point: "同一种元素可以形成不同物质。",
      remember: "先数物质，再看元素。",
      why: "O₂ 是氧气，O₃ 是臭氧，二者是不同物质；混在一起就是混合物。",
      possible: "你可能把“只有氧元素”当成“只有一种物质”。",
      change: "已知金刚石和石墨是不同的碳单质，混在一起也有两种物质。",
      target: "compare"
    },
    q3: {
      role: "条件迁移", title: "标签都写 HCl，两份都纯吗？",
      stem: "甲瓶是纯 HCl(g)，乙瓶是盐酸 HCl(aq)。哪份是混合物？",
      options: ["仅甲", "仅乙", "两份都是"], answer: 1,
      point: "读清分类对象和状态标记。",
      remember: "盐酸是氯化氢的水溶液；aq 表示水溶液。",
      why: "甲题设是纯氯化氢，只有一种物质；乙是氯化氢溶于水形成的盐酸，有溶质和溶剂，属于混合物。溶液中氯化氢主要以水合氢离子和氯离子存在。",
      possible: "你可能只读了 HCl，漏看“纯”和 aq 的条件。",
      change: "纯 H₂SO₄ 是一种物质；稀硫酸含硫酸和水。若只写“硫酸”，还要看上下文。",
      target: "worked"
    }
  };
  const terms = {
    pure: { name: "纯净物", short: "由一种物质组成的样品。", key: "关键是物质种类，而不是元素种类。", yes: ["只含 H₂O 的纯水", "纯 O₂"], no: ["空气", "食盐水"], limit: "题目要指明样品；日常一瓶水通常并非题设的纯 H₂O。" },
    mixture: { name: "混合物", short: "由两种或两种以上物质组成的样品。", key: "一种元素也可能构成多种物质。", yes: ["空气", "O₂ 与 O₃ 的混合物"], no: ["纯 H₂O", "纯 NaCl"], limit: "不能数元素字母、分子数或溶液里的粒子种类来代替组成物质。" },
    element: { name: "元素", short: "具有相同核电荷数的一类原子的总称。", key: "它说明组成类别，不等于一份具体样品中的物质种类。", yes: ["H₂O 含氢和氧两种元素", "O₂ 和 O₃ 都只含氧元素"], no: ["O₂ 和 O₃ 不是同一种物质", "一个氧原子不等于“一个元素”"], limit: "这里先用元素种类来对照分类判据，不展开原子结构。" },
    aq: { name: "aq（水溶液标记）", short: "写在化学式后，表示该物质处于水溶液中。", key: "aq 来自 aqueous；水作为溶剂要计入整份样品。", yes: ["HCl(aq)：盐酸", "NaCl(aq)：氯化钠水溶液"], no: ["HCl(g)：纯氯化氢气体的题设", "NaCl(s)：固体氯化钠"], limit: "aq 不能单独说明溶液浓度；具体分类仍要读整份样品条件。" },
    ozone: { name: "臭氧 O₃", short: "由氧元素形成的另一种单质，与 O₂ 不同。", key: "同种元素不保证同种物质。", yes: ["只含 O₃ 的样品：一种物质", "O₂ + O₃：两种物质"], no: ["O₃ 不是 O₂ 的另一种写法", "O₂ + O₃ 不是纯净物"], limit: "这里只用它做分类反例，暂不讲臭氧的性质。" }
  };
  const main = document.getElementById("main");
  const nav = document.getElementById("steps");
  const dialog = document.getElementById("info-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogContent = document.getElementById("dialog-content");
  let state = readState();
  let view = state.view || "home";
  let selectedSample = "water";
  let selectedAnswer = null;
  let showingMemory = false;
  let showingLecture = false;
  let mapLevel = 0;
  let returnFocus = null;
  let saveError = false;

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (parsed && parsed.version === 1 && Array.isArray(parsed.visited) && parsed.answers && typeof parsed.answers === "object") return parsed;
    } catch (_) { /* Continue without stored progress. */ }
    return { version: 1, visited: [], answers: {}, help: {}, draft: {}, view: "home", memorySaved: false };
  }
  function save() {
    state.view = view;
    try { localStorage.setItem(KEY, JSON.stringify(state)); saveError = false; }
    catch (_) { saveError = true; }
  }
  function drawNav() {
    nav.innerHTML = `<button class="navbtn ${view === "home" ? "active" : ""}" data-go="home">学习首页</button>` +
      steps.map(([id, title]) => `<button class="navbtn ${view === id ? "active" : ""} ${state.visited.includes(id) ? "visited" : ""}" data-go="${id}" ${view === id ? 'aria-current="step"' : ""}>${title}</button>`).join("");
  }
  function goto(id) {
    if (id !== "home" && id !== "lecture" && !steps.some(([key]) => key === id)) return;
    view = id;
    showingLecture = id === "lecture";
    selectedAnswer = state.draft[id] ?? null;
    if (id !== "home" && id !== "lecture" && !state.visited.includes(id)) state.visited.push(id);
    save(); render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function header(step, title, lead) {
    const position = steps.findIndex(([id]) => id === step);
    return `<div class="crumb">必修第一册 · 第一章 · 物质及其变化 / 分类判据</div><article class="card"><div class="stephead"><span class="eyebrow">学一个问题</span><span class="stepcount">${position + 1} / ${steps.length}</span></div><h2>${title}</h2><p class="lead" style="font-size:17px">${lead}</p>`;
  }
  function footer(step) {
    const position = steps.findIndex(([id]) => id === step);
    const prev = position === 0 ? "home" : steps[position - 1][0];
    const next = position === steps.length - 1 ? "home" : steps[position + 1][0];
    return `<div class="footeractions"><button class="btn quiet" data-go="${prev}">← ${prev === "home" ? "回首页" : "上一步"}</button><button class="btn" data-go="${next}">${next === "home" ? "回首页" : "继续下一步 →"}</button></div>`;
  }
  function term(id, label) { return `<button class="term" data-term="${id}">${label || terms[id].name}</button>`; }
  function image() {
    return `<figure style="margin:16px 0"><div class="imgwrap"><button type="button" data-image aria-label="放大查看原课件完整分类关系图" style="border:0;background:none;padding:0;width:100%;cursor:zoom-in"><img src="${ORIGINAL_IMAGE}" alt="原课件中的树状分类图：物质分混合物与纯净物，纯净物再分单质与化合物，后续还有酸、碱、盐、氧化物等分支"></button></div><figcaption class="figurecaption">用户提供的原课件图，完整显示；点击放大。图下有文字关系供阅读。</figcaption></figure>`;
  }
  function showHome() {
    const last = state.visited.filter((id) => id !== "summary").at(-1);
    return `<section class="hero"><span class="eyebrow">学习路径示范 · 可自行选择方式</span><h1>一杯水含两种元素，为什么仍是纯净物？</h1><p class="lead">先读懂课本关系图，再用四份样品、一个完整例题和三道不同角色的题巩固。查词与看答案都可以直接打开。</p><div class="actions"><button class="btn" data-go="${last || "intro"}">${last ? "回到上次位置 →" : "按步骤开始 →"}</button><button class="btn secondary" data-go="lecture">看完整讲义</button><button class="btn quiet" data-go="q1">直接练三题</button></div><p class="small">这里的练习均为课程原创。当前是教学交互原型，进度仅在这个浏览器保存。</p></section><div class="card"><span class="eyebrow">本节要带走什么</span><h2>一个判据，两个容易混淆的层次</h2><div class="twocol"><div><h3>必须记住</h3><p>混合物由两种或两种以上<strong>物质</strong>组成；纯净物由一种物质组成。</p></div><div><h3>遇题怎么想</h3><p>先确认分类的是哪份样品，列出组成物质；再去看元素和更细的类别。</p></div></div><div class="actions"><button class="btn quiet" data-term="mixture">先查“混合物”</button><button class="btn quiet" data-go="summary">看学习记录</button></div></div>`;
  }
  function intro() {
    return header("intro", "看起来一样，类别就一样吗？", "纯水和食盐水都可能透明。判断类别，要先看整份样品里有哪些物质。") +
      `<div class="samplegrid"><div class="sample"><h3>甲：纯水</h3><div class="formula">H₂O</div><p>题设只含 H₂O 这种物质。</p></div><div class="sample"><h3>乙：食盐水</h3><div class="formula">NaCl + H₂O</div><p>氯化钠溶在水中，水也属于这份样品。</p></div></div><div class="note"><strong>先修可选：</strong>H₂O 是一种物质，但它由氢、氧两种${term("element", "元素")}组成。元素种类与物质种类回答的是两个不同问题。</div><button class="btn secondary" data-term="pure">什么叫纯净物？</button></article>` + footer("intro");
  }
  function map() {
    const descriptions = [
      "先看第一处分叉：整份样品含一种物质还是多种物质？纯水走纯净物，食盐水走混合物。",
      "第二层只在纯净物中继续分：若只由一种元素组成，是单质；若由多种元素组成，是化合物。纯 H₂O 是化合物，也仍是纯净物。"
    ];
    return header("map", "课本关系图先看哪一条线？", "先找第一层的判断依据，再沿纯净物分支看第二层。原课件图一直可以完整查看。") +
      image() + `<div class="segment"><button data-map="0" class="${mapLevel === 0 ? "active" : ""}">第一层：数物质</button><button data-map="1" class="${mapLevel === 1 ? "active" : ""}">第二层：看元素</button></div><div class="relation" aria-live="polite">${descriptions[mapLevel]}</div><p class="small">文字关系：物质 → 混合物 / 纯净物；纯净物 → 单质 / 化合物；部分化合物还可进一步按其他标准分类。</p></article>` + footer("map");
  }
  function compare() {
    const samples = {
      water: ["纯 H₂O", "H₂O 一种物质；H、O 两种元素", "纯净物。元素有两种，并不影响这个结论。"],
      oxygen: ["纯 O₂", "O₂ 一种物质；O 一种元素", "纯净物。它也是氧单质。"],
      ozone: ["O₂ 与 O₃ 混合", "O₂、O₃ 两种物质；O 一种元素", "混合物。同一种元素可以形成不同物质。"],
      saltwater: ["食盐水", "NaCl、H₂O 至少两种物质", "混合物。清澈透明也不表示只有一种物质。"]
    };
    const item = samples[selectedSample];
    return header("compare", "同一种元素，一定是一种物质吗？", "请切换样品，比较“物质有几种”和“元素有几种”。每一次切换都会改变分类理由。") +
      `<div class="samplegrid">${Object.entries(samples).map(([key, sample]) => `<button class="sample pick ${selectedSample === key ? "selected" : ""}" data-sample="${key}" aria-pressed="${selectedSample === key}"><h3>${sample[0]}</h3><span class="small">查看组成与理由 →</span></button>`).join("")}</div><div class="relation" aria-live="polite"><strong>${item[0]}</strong><br>${item[1]}<br>${item[2]}</div><p>${term("ozone", "O₃ 是什么？")}　${term("mixture", "混合物定义")}</p><div class="remember"><strong>判断顺序</strong><br>先问整份样品有几种物质，再讨论元素种类。不能数溶液中有哪些离子来代替组成物质的判断。</div></article>` + footer("compare");
  }
  function worked() {
    return header("worked", "标签都写 HCl，为什么类别不同？", "把对象、状态和样品组成依次读清，别只看化学式的字母。") +
      `<div class="samplegrid"><div class="sample"><h3>甲：纯 HCl(g)</h3><p>题设为纯氯化氢气体，是一种物质。</p></div><div class="sample"><h3>乙：盐酸 HCl(aq)</h3><p>氯化氢溶于水形成的溶液，含有溶剂水。</p></div></div><p>其中 ${term("aq", "aq")} 表示什么？你可以点开，关闭后仍会回到这里。</p><details open><summary>跟着示范看完整推理</summary><div class="stepbox"><strong>1 读对象：</strong>题目问哪一整份样品。</div><div class="stepbox"><strong>2 读标记：</strong>g 表示气态；aq 表示水溶液。</div><div class="stepbox"><strong>3 列来源：</strong>甲是题设的纯 HCl；乙由氯化氢溶于水形成，既有溶质也有溶剂。溶液中的氯化氢主要以水合氢离子和氯离子存在。</div><div class="stepbox"><strong>4 用定义：</strong>甲是纯净物；乙是混合物。</div></details><div class="note">换成纯 H₂SO₄ 与稀硫酸，也要先确认说的是纯物质还是水溶液。只写“硫酸”时应读上下文；“浓”不等于无水。</div></article>` + footer("worked");
  }
  function memory() {
    return header("memory", "这两句定义要记下来", "记到能说出关键词“物质”，并自己举出正例和反例。") +
      `<div class="remember"><strong>先数物质，再看元素</strong><p>${showingMemory ? "先试着自己说：纯净物和混合物分别含几种物质？" : "纯净物由一种物质组成。混合物由两种或两种以上物质组成。"}</p></div><div class="actions"><button class="btn secondary" data-action="memory-toggle">${showingMemory ? "显示定义" : "遮住，自己回想"}</button><button class="btn quiet" data-action="memory-save">${state.memorySaved ? "已收藏记忆卡 ✓" : "收藏这张记忆卡"}</button></div><p class="small">回想不打分。答不出就直接显示，之后再用未见题验证。</p></article>` + footer("memory");
  }
  function question(id) {
    const q = questions[id];
    const record = state.answers[id];
    const choiceButtons = q.options.map((option, index) => `<button type="button" data-answer="${index}" class="${selectedAnswer === index ? "selected" : ""}" aria-pressed="${selectedAnswer === index}" ${record ? "disabled" : ""}>${option}</button>`).join("");
    let feedback = "";
    if (record) {
      const correct = record.answer === q.answer;
      feedback = `<div class="feedback ${correct ? "" : "wrong"}" aria-live="polite"><strong>${record.revealed ? "已直接查看解析" : correct ? "首次判断正确" : "首次判断需要修正"}</strong><p>正确结论：${q.options[q.answer]}。${q.why}</p><dl><dt>考什么</dt><dd>${q.point}</dd><dt>要记什么</dt><dd>${q.remember}</dd><dt>怎样变形</dt><dd>${q.change}</dd></dl>${!correct && !record.revealed ? `<p><strong>可能的卡点：</strong>${q.possible}</p>` : ""}<p class="small">${record.helped || record.revealed ? "本题回答前使用过帮助或直接看了解析，后续不能算无提示首答。" : "本题未使用提示；这里只能说明这道题的首次表现。"}</p><button class="btn quiet" data-go="${q.target}">回到相关讲解</button></div>`;
    }
    return header(id, q.title, `<span class="questionrole">${q.role} · 本题为课程原创</span>`) +
      `<p><strong>${q.stem}</strong></p><div class="answerlist">${choiceButtons}</div>${record ? feedback : `<div class="actions"><button class="btn" data-action="submit" ${selectedAnswer === null ? "disabled" : ""}>提交本题</button><button class="btn quiet" data-action="hint">${state.help[id] ? "提示已展开" : "看一条提示"}</button><button class="btn quiet" data-action="reveal">直接看答案</button><button class="btn quiet" data-action="skip">先跳过</button></div>${state.help[id] ? '<div class="note">先确认题目要分类的是“整份样品”；再数样品中有哪些不同物质。</div>' : ""}`}</article>` + footer(id);
  }
  function summary() {
    const visits = ["intro", "map", "compare", "worked", "memory"].filter((id) => state.visited.includes(id));
    const entries = Object.values(state.answers);
    const independent = entries.filter((entry) => entry.answer !== null && entry.correct && !entry.helped && !entry.revealed).length;
    const viewed = entries.filter((entry) => entry.revealed).length;
    return header("summary", "这次学到了什么，还需要怎样验证？", "阅读、练习与间隔后的独立表现分别记录。你可以马上复看，也可以结束这次学习。") +
      `<div class="statuslist"><div><strong>讲解</strong><p>看过 ${visits.length} / 5 个讲解步骤。${visits.length === 5 ? "已浏览完整讲解。" : "仍可随时补看。"}</p></div><div><strong>练习</strong><p>提交 ${entries.length} / 3 题；${independent} 题无提示首答正确。${viewed ? `其中 ${viewed} 题直接看了解析。` : ""}</p></div><div><strong>以后再验证</strong><p>还没有间隔后的新题表现；这里不显示“已掌握”。</p></div></div><div class="remember"><strong>本节要带走的句子</strong><p>混合物由两种或两种以上物质组成。判断时先数物质，再看元素。</p></div><p>建议下一短课：纯净物再怎样分单质、化合物。现在也可以重新看原图、查词，或自由结束。</p><div class="actions"><button class="btn secondary" data-go="map">回看原图</button><button class="btn quiet" data-go="q1">补做或查看三题</button><button class="btn quiet" data-go="home">回学习首页</button></div></article>`;
  }
  function lecture() {
    return `<div class="crumb">完整讲义 · 随时可回到分步课</div><article class="card lecture"><span class="eyebrow">自主阅读</span><h2>物质分类：先数物质，再看元素</h2><p>判断整份样品，先列出它由哪些物质组成。只有一种物质，叫纯净物；有两种或两种以上物质，叫混合物。</p><section><h3>原课件关系图</h3>${image()}<p>文字关系：物质 → 混合物 / 纯净物；纯净物 → 单质 / 化合物。</p></section><section><h3>两个反例</h3><p>纯 H₂O 含氢和氧两种元素，仍只有 H₂O 一种物质。O₂ 与 O₃ 混合只含氧元素，却有两种物质。</p></section><section><h3>完整示范</h3><p>题设纯 HCl(g) 是一种物质；盐酸 HCl(aq) 是氯化氢溶于水形成的混合物。${term("aq", "点此查看 aq")}</p></section><section><h3>要记住</h3><p>纯净物由一种物质组成；混合物由两种或两种以上物质组成。先数物质，再看元素。</p></section><div class="actions"><button class="btn" data-go="${state.visited.at(-1) || "intro"}">回到分步课</button><button class="btn secondary" data-go="q1">去做三题</button></div></article>`;
  }
  function render() {
    drawNav();
    const pages = { home: showHome, intro, map, compare, worked, memory, q1: () => question("q1"), q2: () => question("q2"), q3: () => question("q3"), summary, lecture };
    main.innerHTML = (saveError ? '<p class="note" role="alert">浏览器暂时无法保存演示进度；本次仍可继续阅读。</p>' : "") + pages[view]();
    document.title = `${view === "home" ? "物质分类" : steps.find(([id]) => id === view)?.[1] || "完整讲义"} · 学生学习交互原型`;
  }
  function openDialog(title, content) {
    returnFocus = document.activeElement;
    dialogTitle.textContent = title;
    dialogContent.innerHTML = content;
    dialog.showModal();
    document.getElementById("dialog-close").focus();
  }
  document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { if (returnFocus?.isConnected) returnFocus.focus(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button,[data-image]");
    if (!button) return;
    if (button.dataset.go) { goto(button.dataset.go); return; }
    if (button.dataset.term) {
      const t = terms[button.dataset.term];
      if (t) openDialog(t.name, `<p>${t.short}</p><div class="remember"><strong>判断关键</strong><p>${t.key}</p></div><div class="termgrid"><div><strong>正例</strong><p>${t.yes.join("；")}</p></div><div><strong>反例</strong><p>${t.no.join("；")}</p></div></div><p class="small">边界：${t.limit}</p>`);
      return;
    }
    if (button.dataset.image !== undefined) { openDialog("原课件分类关系图", `<img src="${ORIGINAL_IMAGE}" alt="原课件完整分类关系图"><p>物质先按组成分混合物与纯净物；纯净物再分单质和化合物。</p>`); return; }
    if (button.dataset.map !== undefined) { mapLevel = Number(button.dataset.map); render(); return; }
    if (button.dataset.sample) { selectedSample = button.dataset.sample; render(); return; }
    if (button.dataset.answer !== undefined) {
      selectedAnswer = Number(button.dataset.answer); state.draft[view] = selectedAnswer; save(); render(); return;
    }
    if (button.dataset.action === "memory-toggle") { showingMemory = !showingMemory; render(); return; }
    if (button.dataset.action === "memory-save") { state.memorySaved = !state.memorySaved; save(); render(); return; }
    if (!["q1", "q2", "q3"].includes(view)) return;
    const action = button.dataset.action;
    if (action === "hint") { state.help[view] = true; save(); render(); }
    if (action === "skip") { const next = steps[steps.findIndex(([id]) => id === view) + 1][0]; goto(next); }
    if (action === "submit" && selectedAnswer !== null && !state.answers[view]) {
      state.answers[view] = { answer: selectedAnswer, correct: selectedAnswer === questions[view].answer, helped: Boolean(state.help[view]), revealed: false };
      save(); render();
    }
    if (action === "reveal" && !state.answers[view]) {
      state.answers[view] = { answer: null, correct: false, helped: true, revealed: true };
      save(); render();
    }
  });
  render();
})();
