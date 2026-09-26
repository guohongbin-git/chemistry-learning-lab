// Build a static edition without the local server, credentials, or student files.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'outputs/chemistry-agentic-v0.1');
const output = path.join(root, '_site');
fs.mkdirSync(path.join(output, 'product-v1'), {recursive:true});
fs.mkdirSync(path.join(output, 'assets'), {recursive:true});
for (const name of fs.readdirSync(path.join(source, 'product-v1'))) {
  if (!/\.(html|css|js)$/.test(name)) continue;
  let text = fs.readFileSync(path.join(source, 'product-v1', name), 'utf8');
  text = text.replaceAll('/product-v1/review/', './review.html')
    .replaceAll('/product-v1/', './').replaceAll('/assets/', '../assets/');
  if (name === 'index.html') {
    text = text.replace('<html lang="zh-CN">', '<html lang="zh-CN" data-static-site>')
      .replace('<head>', '<head><script>window.CHEMISTRY_STATIC_SITE=true;</script><style>[data-static-site] .tutor-panel,[data-static-site] .sc-tutor{display:none}</style>')
      .replaceAll('href="/"', 'href="./"')
      .replace('返回现有课程首页 ↗', '返回课程目录')
      .replace('打开现有课程中的高考迁移训练与本次试卷补漏课 ↗', '查看全部短课')
      .replace('<strong>课程范围</strong>', '<strong>在线课程</strong><p>可直接阅读、练习和使用模拟。学习记录只保存在当前浏览器。AI 导师需在本机版连接服务后使用。</p><strong>课程范围</strong>');
  }
  fs.writeFileSync(path.join(output, 'product-v1', name), text);
}
for (const name of fs.readdirSync(path.join(source, 'assets'))) {
  if (name.endsWith('.png')) fs.copyFileSync(path.join(source, 'assets', name), path.join(output, 'assets', name));
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'index.html'), '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./product-v1/"><title>化学学习实验室</title><a href="./product-v1/">打开化学课程</a></html>');
fs.writeFileSync(path.join(output, 'README.md'), '# 化学学习实验室 · 在线课程\n\n本仓库为 GitHub Pages 静态发布产物。第一章 12 节短课，优先对应北京卷考点。AI 导师需要本机服务。学习记录只保存在浏览器。\n');
console.log('Static course built: _site/');
