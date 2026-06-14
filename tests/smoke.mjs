import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const js = readFileSync('src/app.js', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const renderedSource = [html, css, js, readme].join('\n');
const model = vm.runInNewContext(`${js}\n({ scenarios, scoreScenario, riskLevel, generateSeries })`, { console, window: undefined, document: undefined, setInterval: () => 0 });
const { scenarios, scoreScenario, riskLevel, generateSeries } = model;

for (const label of ['실시간 대시보드', '앱 구현 화면', '보고서 한눈에']) assert(html.includes(label), `missing tab/screen label: ${label}`);
assert(!html.includes('type="module"'), 'file:// mode must not use ES module script');
assert.equal(scenarios.length, 7, 'must ship exactly seven curated SafeWave scenarios');
for (const label of ['평상시 움직임', '휴식/누워 있음', '낙상 후 무활동', '실신/쓰러짐 의심', '장시간 무반응', '야간 이상 움직임', '침대/방 이탈 후 미복귀']) assert(scenarios.some((s) => s.label === label), `missing scenario ${label}`);
for (const scenario of scenarios) {
  const score = scoreScenario(scenario);
  assert(score >= 0 && score <= 100, `${scenario.id} score out of range`);
  assert(['safe', 'watch', 'danger'].includes(riskLevel(score)), `${scenario.id} invalid risk level`);
  assert(scenario.evidence.length >= 3, `${scenario.id} must include AI rationale evidence`);
  assert.equal(generateSeries(scenario.patternType, 0).length, 72, `${scenario.id} chart series length`);
}
const fall = scenarios.find((s) => s.id === 'fall');
assert(scoreScenario(fall) >= 70 && riskLevel(scoreScenario(fall)) === 'danger', 'fall scenario must be danger');
const normal = scenarios.find((s) => s.id === 'normal');
assert(scoreScenario(normal) < 40, 'normal scenario must remain low risk');
for (const fact of ['21.8%', '10.3%', '3.3% → 11.1%', '전남 29.0%', '경북 28.2%', '카메라 없음', '웨어러블 없음', 'Wi‑Fi CSI', 'RuView']) assert(html.includes(fact) || js.includes(fact), `missing required report fact: ${fact}`);
assert(!html.includes('RuView GitHub</a>'), 'RuView GitHub link button should not be shown');
assert(!html.includes('Live Observatory 열기'), 'RuView live external link button should not be shown');
assert(html.includes('공간 기반 자동 감지'), 'smartwatch comparison must describe SafeWave as automatic spatial sensing');
assert(!renderedSource.includes('공간 기반 수동 감지'), 'SafeWave should not be described as manual sensing');
for (const phrase of ['보호자·돌봄 담당자 알림 앱', '알림 수신 대상', '보호자·돌봄 담당자 동시 수신', '보호자와 돌봄 담당자가 앱을 설치']) {
  assert(html.includes(phrase), `caregiver app structure phrase missing: ${phrase}`);
}
assert(html.includes('exampleImage') && js.includes('renderExampleGallery'), 'missing RuView situation example image gallery');
assert(html.includes('situationPreviewList') && js.includes('renderSituationPreviews'), 'missing situation-by-situation notification preview');
for (const imagePath of ['assets/ruview-examples/normal.svg','assets/ruview-examples/fall.svg','assets/ruview-examples/inactivity.svg','assets/ruview-examples/room-exit.svg']) assert(renderedSource.includes(imagePath), `missing example image path ${imagePath}`);
for (const file of readdirSync('assets/ruview-examples').filter((name) => name.endsWith('.svg'))) {
  const svg = readFileSync(`assets/ruview-examples/${file}`, 'utf8');
  assert(!/[가-힣]/.test(svg), `${file} must avoid Korean text inside SVG to prevent missing-glyph boxes in headless/file renderers`);
}
for (const pattern of [/010\d{8}/, /20091004/, /20090413/, /01032669803/, /01063326367/, /01033820943/, /김준서/, /이도훈/, /엄지오/, /생년월일/, /연락처/, /주소/, /이메일/]) assert(!pattern.test(renderedSource), `forbidden raw PDF personal/application metadata leaked: ${pattern}`);
assert(css.includes('--bg: #f7f9fc'), 'clean RE-RoadSchool light background token missing');
assert(css.includes('--shadow: 0 12px 30px rgba(15, 23, 42, 0.07)'), 'clean card shadow token missing');
assert(!css.includes('@import url('), 'static file:// demo must not depend on remote Google Fonts import');
assert(!js.includes('role\', \'listitem') && !js.includes('role", "listitem'), 'scenario buttons must keep native button semantics');
assert(/\.score-ring\s*\{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column/.test(css), 'risk score ring must vertically center score and /100 as one column');
assert(/\.score-ring small\s*\{[\s\S]*margin-left:\s*0/.test(css), 'risk score /100 label must not push score off-center');
assert(css.includes('prefers-reduced-motion'), 'reduced motion support missing');
assert(html.includes('role="img"') && html.includes('aria-describedby="chartSummary"'), 'chart accessibility summary missing');
console.log('SafeWave smoke contract passed');
