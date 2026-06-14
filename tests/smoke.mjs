import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const index = readFileSync('index.html', 'utf8');
const app = existsSync('app.html') ? readFileSync('app.html', 'utf8') : '';
const dashboard = existsSync('dashboard.html') ? readFileSync('dashboard.html', 'utf8') : '';
const allHtml = [index, app, dashboard].join('\n');
const withoutDataUrls = allHtml.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, '');
const externalLoads = /(?:src|href|action)\s*=\s*["']https?:\/\//i.test(withoutDataUrls)
  || /@import\s+url\(\s*["']?https?:\/\//i.test(withoutDataUrls)
  || /url\(\s*["']?https?:\/\//i.test(withoutDataUrls);

assert(index.includes('data-source-app="safewave_mobile_ui.html"'), 'index must declare mobile app source file');
assert(index.includes('data-source-dashboard="safewave_dashboard.html"'), 'index must declare dashboard source file');
assert(index.includes('id="app-demo"'), 'index must directly render the copied app html in the page DOM');
assert(index.includes('id="dashboard-demo"'), 'index must directly render the copied dashboard html in the page DOM');
assert(!/<iframe\b/i.test(index), 'index must not use iframe embedding');
assert(!/<template\b/i.test(index), 'index must not hide the demos inside runtime templates');
assert(!/srcdoc\s*=/i.test(index), 'index must not use srcdoc embedding');
assert(!/src=["']app\\.html["']/i.test(index), 'index must not depend on app.html at runtime');
assert(!/src=["']dashboard\\.html["']/i.test(index), 'index must not depend on dashboard.html at runtime');
assert(index.includes('앱 데모') && index.includes('대시보드'), 'index must provide app/dashboard view labels');
assert(index.includes('data-phone-ratio="9:16"'), 'mobile demo must declare a 9:16 phone ratio');
assert(index.includes('aspect-ratio:9/16'), 'mobile phone CSS must use a real 9:16 aspect ratio');

assert(app.includes('SafeWave 보호자 앱 UI'), 'app.html title must come from safewave_mobile_ui.html');
assert(app.includes('class="stage"'), 'app.html must preserve mobile UI stage');
for (const phrase of [
  '안녕하세요, 보호자님',
  '오늘도 어르신의 안전을 확인하세요.',
  '3명 관리 중',
  '김영희 어르신',
  '이순신 어르신',
  '박말순 어르신',
  '알림 상세',
  '움직임 주의',
  '전화하기',
  '확인 완료',
  '시간대별 활동 그래프',
  '설정',
]) assert(app.includes(phrase), `missing source mobile UI phrase: ${phrase}`);

assert(dashboard.includes('SafeWave AI Care Dashboard'), 'dashboard.html title must come from safewave_dashboard.html');
assert(dashboard.includes('class="stage"'), 'dashboard.html must preserve dashboard stage');
for (const phrase of [
  '실시간 모니터링',
  '알림',
  'nav-badge',
  '김영희 어르신의 오늘 상태를 확인하세요.',
  '위험 상태',
  '현재 위험 없음',
  '실시간 공간 모니터링',
  'RuView',
  '침실',
  '거실',
  '주방',
  '화장실',
]) assert(dashboard.includes(phrase), `missing source dashboard phrase: ${phrase}`);

for (const stale of [
  '실시간 안전 대시보드',
  '보고서 한눈에 보기',
  'RUVIEW EXAMPLE IMAGE',
  'assets/ruview-examples',
  'src/app.js',
  'src/styles.css',
  'Wi‑Fi CSI 시뮬레이션',
]) assert(!index.includes(stale), `old demo artifact must be removed from index: ${stale}`);

assert(!allHtml.includes('type="module"'), 'file:// demo must not use module scripts');
assert(!externalLoads, 'demo should not load external network resources');
assert(!existsSync('src/app.js'), 'old app.js should be removed for reset implementation');
assert(!existsSync('src/styles.css'), 'old styles.css should be removed for reset implementation');
assert(!existsSync('assets/ruview-examples'), 'old RuView generated image assets should be removed for reset implementation');

assert(index.includes('SafeWaveShellDemo'), 'wrapper must expose interactive tab switching helper');
assert(index.includes('data-view-target="app"') && index.includes('data-view-target="dashboard"'), 'wrapper tabs must have clickable view targets');
assert(index.includes('SafeWaveMobileDemo'), 'single-file index must embed the interactive mobile app demo');
assert(index.includes('SafeWaveDashboardDemo'), 'single-file index must embed the interactive dashboard demo');

assert(app.includes('SafeWaveMobileDemo'), 'mobile app demo must expose an interaction helper');
for (const marker of [
  'data-app-screen="home"',
  'data-app-screen="elder"',
  'data-app-screen="alerts"',
  'data-app-screen="alert-detail"',
  'data-app-screen="stats"',
  'data-app-screen="settings"',
  'data-tab-target="alerts"',
  'data-action="call"',
  'data-action="confirm"',
  'interaction-toast',
]) assert(app.includes(marker), `mobile app demo must include interactive marker: ${marker}`);

assert(dashboard.includes('SafeWaveDashboardDemo'), 'dashboard demo must expose an interaction helper');
for (const marker of [
  'data-nav-target="monitoring"',
  'data-scenario="normal"',
  'data-scenario="inactive"',
  'data-scenario="fall"',
  'dashboard-toast',
  '상황 시뮬레이션',
]) assert(dashboard.includes(marker), `dashboard demo must include interactive marker: ${marker}`);

console.log('SafeWave app/dashboard HTML smoke contract passed');
