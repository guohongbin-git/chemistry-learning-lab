const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appRoot = path.resolve(__dirname, "../outputs/chemistry-agentic-v0.1");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "short-course-content.js"]) {
  vm.runInContext(fs.readFileSync(path.join(appRoot, "product-v1", file), "utf8"), context);
}

const course = context.window.CHEMISTRY_SHORT_COURSE;
const glossary = context.window.CHEMISTRY_PRODUCT_V1.glossary;
const glossaryIds = new Set(glossary.map((term) => term.id));
assert.equal(course.lessons.length, 12, "第一章应有 12 节短课");
assert.equal(new Set(course.lessons.map((lesson) => lesson.id)).size, 12, "短课 ID 应唯一");
assert.deepEqual(Array.from(course.groups, (group) => group.id), ["classify", "ionic", "redox"]);

for (const lesson of course.lessons) {
  assert.ok(course.groups.some((group) => group.id === lesson.group), `${lesson.id}: 教材章节`);
  for (const key of ["title", "question", "intro", "prior", "map", "definition", "mnemonic", "boundary", "examRef", "review"]) {
    assert.ok(lesson[key], `${lesson.id}: 缺少 ${key}`);
  }
  assert.ok(lesson.examRef.url.startsWith("https://news.bjd.com.cn/"), `${lesson.id}: 考法评析应指向北京考试报`);
  assert.ok(lesson.examCases.length >= 1 && lesson.examCases.length <= 3, `${lesson.id}: 真题线索应有 1—3 个，不为凑数伪造`);
  for (const item of lesson.examCases) {
    assert.match(item.label, /^20\d\d 北京·第 \d+ 题$/, `${lesson.id}: 北京卷年份与题号`);
    assert.ok(["直接", "相关", "考点方向"].includes(item.fit), `${lesson.id}: 对应强度`);
    for (const key of ["topic", "point", "remember", "transfer", "source", "url"]) assert.ok(item[key], `${lesson.id}: 真题线索缺少 ${key}`);
    assert.ok(item.url.startsWith("https://"), `${lesson.id}: 真题来源必须可打开`);
  }
  assert.equal(lesson.questions.length, 3, `${lesson.id}: 每课应有三种练习`);
  assert.ok(lesson.samples.length >= 4, `${lesson.id}: 正反例不足`);
  assert.ok(lesson.worked.length >= 4, `${lesson.id}: 推理步骤不足`);
  if (lesson.image) assert.ok(fs.existsSync(path.join(appRoot, "assets", `${lesson.image}.png`)), `${lesson.id}: 原图缺失`);
  for (const term of lesson.terms) assert.ok(glossaryIds.has(term), `${lesson.id}: 术语 ${term} 缺失`);
  for (const [index, question] of [...lesson.questions, lesson.review].entries()) {
    assert.ok(question.stem && question.why, `${lesson.id}: 第 ${index + 1} 题内容不足`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${lesson.id}: 第 ${index + 1} 题答案越界`);
    if (index < 3) for (const key of ["point", "remember", "wrong", "change"]) assert.ok(question[key], `${lesson.id}: 第 ${index + 1} 题缺少 ${key}`);
  }
}
assert.match(course.lessons.find((lesson) => lesson.id === "b2").examGap, /尚未找到直接/, "电解质饮料不能伪称高考直接命题");
assert.ok(course.lessons.every((lesson) => lesson.examCases.every((item) => item.label.includes("北京"))), "学生端真题线索应优先使用北京卷");
const usedCases = new Set(course.lessons.flatMap((lesson) => lesson.examCases.map((item) => item.label)));
assert.equal(usedCases.size, Object.keys(course.examCases).length, "来源目录中的每道北京题都应在短课中实际使用");
assert.doesNotMatch(fs.readFileSync(path.join(appRoot, "product-v1/index.html"), "utf8"), /浙江|zjzs\.net/, "新版首页不能残留浙江卷来源");

console.log(`短课结构通过：${course.lessons.length} 节、${course.lessons.length * 3} 道原创主练习、${course.lessons.length} 道复习题、${glossary.length} 个术语、${Object.keys(course.examCases).length} 个真题来源编号。`);
