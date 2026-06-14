const statusMeta = {
  safe: { label: '낮음', className: 'risk-safe', color: '#22c55e' },
  watch: { label: '주의', className: 'risk-watch', color: '#f59e0b' },
  danger: { label: '위험', className: 'risk-danger', color: '#ef4444' },
};

const scenarios = [
  {
    id: 'normal',
    label: '평상시 움직임',
    room: '거실 · Wi‑Fi CSI node 02',
    short: '완만한 CSI 변화',
    scoreParts: { spike: 0, inactivity: 0, pattern: 8, night: 0, room: 0, base: 10 },
    inactive: '2분',
    spike: '낮음',
    pattern: '8%',
    alert: '현재는 평상시 움직임으로 보입니다. 정기 모니터링을 유지합니다.',
    summary: '완만한 CSI 변화와 낮은 무활동 시간이 감지됩니다.',
    evidence: ['신호 변화량이 평소 범위 안에 있습니다.', '무활동 시간이 짧아 보호자 확인 우선순위가 낮습니다.', '생활 패턴 차이가 8%로 작습니다.'],
    action: '정상 모니터링을 유지합니다.',
    color: '#22c55e',
    patternType: 'calm',
  },
  {
    id: 'rest',
    label: '휴식/누워 있음',
    room: '침실 · Wi‑Fi CSI node 01',
    short: '낮은 움직임 + 정상 시간대',
    scoreParts: { spike: 0, inactivity: 8, pattern: 6, night: 0, room: 0, base: 10 },
    inactive: '18분',
    spike: '낮음',
    pattern: '6%',
    alert: '휴식 또는 누워 있는 상태로 보입니다. 평소 취침/휴식 패턴과 일치합니다.',
    summary: '신호 변화가 작지만 시간대와 패턴이 정상 휴식 범위에 있습니다.',
    evidence: ['갑작스러운 피크가 없습니다.', '움직임은 낮지만 평소 휴식 시간대와 일치합니다.', '방 이탈 후 미복귀 조건이 없습니다.'],
    action: '휴식 상태로 기록하고 알림은 보류합니다.',
    color: '#38bdf8',
    patternType: 'rest',
  },
  {
    id: 'fall',
    label: '낙상 후 무활동',
    room: '거실 · Wi‑Fi CSI node 02',
    short: '큰 피크 이후 정지',
    scoreParts: { spike: 30, inactivity: 30, pattern: 15, night: 0, room: 0, base: 17 },
    inactive: '27분',
    spike: '매우 큼',
    pattern: '63%',
    alert: '낙상 또는 쓰러짐 의심 상황이 감지되었습니다. 즉시 확인이 필요합니다.',
    summary: '큰 CSI 피크가 발생한 뒤 움직임이 거의 없어 위험 단계로 분류됩니다.',
    evidence: ['갑작스러운 신호 변화가 크게 발생했습니다. (+30)', '피크 이후 장시간 무활동이 이어졌습니다. (+30)', '평소 활동 시간대와 다른 정지 패턴입니다. (+15)'],
    action: '보호자와 돌봄 담당자에게 즉시 확인 요청을 권장합니다.',
    color: '#ef4444',
    patternType: 'fall',
  },
  {
    id: 'faint',
    label: '실신/쓰러짐 의심',
    room: '주방 · Wi‑Fi CSI node 03',
    short: '급격한 변화 + 긴 정지',
    scoreParts: { spike: 30, inactivity: 30, pattern: 15, night: 0, room: 0, base: 13 },
    inactive: '22분',
    spike: '큼',
    pattern: '57%',
    alert: '쓰러짐 의심 패턴이 감지되었습니다. 현장 확인이 필요합니다.',
    summary: '낙상/실신을 단정하지 않고 급변 이후 장시간 정지 상태를 확인 요청으로 처리합니다.',
    evidence: ['급격한 CSI 변화가 감지되었습니다. (+30)', '이후 움직임 감소가 오래 지속됩니다. (+30)', '의료 진단이 아니라 보호자 확인이 필요한 상태로 표시합니다.'],
    action: '상황 확인 후 필요 시 119 또는 가까운 보호자에게 연결합니다.',
    color: '#fb7185',
    patternType: 'faint',
  },
  {
    id: 'inactivity',
    label: '장시간 무반응',
    room: '거실 · Wi‑Fi CSI node 02',
    short: '활동 시간대 무활동',
    scoreParts: { spike: 0, inactivity: 30, pattern: 15, night: 0, room: 0, base: 27 },
    inactive: '2시간 14분',
    spike: '낮음',
    pattern: '48%',
    alert: '평소 활동 시간대에 움직임이 거의 없습니다. 안부 확인이 필요합니다.',
    summary: '큰 낙상 피크는 없지만 장시간 무반응과 생활 패턴 차이로 위험 단계입니다.',
    evidence: ['무활동 시간이 기준보다 길게 지속됩니다. (+30)', '평소 활동 시간대와 다르게 움직임이 없습니다. (+15)', '낙상 확정이 아니라 안부 확인 알림입니다.'],
    action: '전화 또는 메시지로 안부 확인을 먼저 권장합니다.',
    color: '#f59e0b',
    patternType: 'inactive',
  },
  {
    id: 'night',
    label: '야간 이상 움직임',
    room: '복도 · Wi‑Fi CSI node 04',
    short: '새벽 반복 이동',
    scoreParts: { spike: 10, inactivity: 12, pattern: 15, night: 15, room: 0, base: 16 },
    inactive: '11분',
    spike: '반복',
    pattern: '42%',
    alert: '야간 시간대 반복 이동 후 정지 상태가 감지되었습니다. 확인이 필요할 수 있습니다.',
    summary: '새벽 반복 피크와 이후 정지 상태를 주의 단계로 표시합니다.',
    evidence: ['새벽 시간대 반복적인 이동 피크가 감지됩니다. (+15)', '평소 야간 패턴과 차이가 있습니다. (+15)', '질병 진단이 아니라 야간 이상 행동 확인 알림입니다.'],
    action: '다음날 보호자 확인 또는 야간 모니터링 강화를 권장합니다.',
    color: '#a78bfa',
    patternType: 'night',
  },
  {
    id: 'room-exit',
    label: '침대/방 이탈 후 미복귀',
    room: '침실↔복도 · Wi‑Fi CSI mesh',
    short: '이동 후 복귀 없음',
    scoreParts: { spike: 10, inactivity: 20, pattern: 15, night: 15, room: 20, base: 4 },
    inactive: '38분',
    spike: '중간',
    pattern: '51%',
    alert: '침대 또는 방 이탈 후 장시간 복귀가 확인되지 않았습니다. 현장 확인이 필요합니다.',
    summary: '방 이탈 이후 복귀 신호가 없어 낙상 전후 위험 상황으로 분류됩니다.',
    evidence: ['침대/방 이탈 후 복귀 여부가 확인되지 않습니다. (+20)', '야간 이동과 긴 정지 상태가 함께 나타납니다. (+15)', '낙상 순간뿐 아니라 전후 위험 상황까지 감지합니다.'],
    action: '가까운 보호자 또는 돌봄 담당자의 현장 확인을 권장합니다.',
    color: '#f97316',
    patternType: 'exit',
  },
];


const exampleImages = {
  normal: { src: 'assets/ruview-examples/normal.svg', caption: '완만한 CSI 파형과 서있는 포즈가 표시되고, 보호자 알림은 보류됩니다.' },
  rest: { src: 'assets/ruview-examples/rest.svg', caption: '누운 자세와 낮은 움직임으로 표시되며, 정상 휴식 패턴이면 알림을 보내지 않습니다.' },
  fall: { src: 'assets/ruview-examples/fall.svg', caption: '큰 CSI 피크 이후 수평 포즈와 정지 상태가 함께 표시되어 즉시 확인 CTA가 뜹니다.' },
  faint: { src: 'assets/ruview-examples/faint.svg', caption: '급격한 변화 뒤 긴 정지 상태로 쓰러짐 의심 예시 이미지가 표시됩니다.' },
  inactivity: { src: 'assets/ruview-examples/inactivity.svg', caption: '저진폭 CSI가 오래 이어지는 이미지로 장시간 무반응 알림이 표시됩니다.' },
  night: { src: 'assets/ruview-examples/night.svg', caption: '새벽 반복 이동 궤적과 이후 정지 상태가 주의 카드로 표시됩니다.' },
  'room-exit': { src: 'assets/ruview-examples/room-exit.svg', caption: '방 이탈 후 복귀 신호가 없는 예시 이미지로 현장 확인 알림이 뜹니다.' },
};

function scoreScenario(scenario) {
  const total = Object.values(scenario.scoreParts).reduce((sum, value) => sum + value, 0);
  return Math.max(0, Math.min(100, Math.round(total)));
}

function riskLevel(score) {
  if (score >= 70) return 'danger';
  if (score >= 40) return 'watch';
  return 'safe';
}

function generateSeries(patternType, tick = 0) {
  const length = 72;
  return Array.from({ length }, (_, index) => {
    const wave = Math.sin((index + tick) / 4) * 7 + Math.cos((index + tick) / 7) * 4;
    let value = 34 + wave;
    if (patternType === 'rest') value = 24 + Math.sin((index + tick) / 8) * 3;
    if (patternType === 'calm') value = 36 + Math.sin((index + tick) / 5) * 6 + Math.cos(index / 9) * 2;
    if (patternType === 'fall') value = index < 24 ? 35 + wave : index === 27 ? 96 : index > 30 ? 13 + Math.sin(index / 2) * 2 : 42 + wave;
    if (patternType === 'faint') value = index < 19 ? 33 + wave : index === 22 ? 84 : index > 25 ? 16 + Math.cos(index / 3) * 2 : 37;
    if (patternType === 'inactive') value = index < 10 ? 32 + wave : 15 + Math.sin(index / 6) * 2;
    if (patternType === 'night') value = 26 + Math.sin(index / 3) * 5 + ([14, 23, 34, 45].includes(index) ? 38 : 0) + (index > 52 ? -9 : 0);
    if (patternType === 'exit') value = index < 16 ? 22 + Math.sin(index / 4) * 4 : index < 35 ? 52 + Math.sin(index / 2) * 14 : 17 + Math.sin(index / 5) * 2;
    return Math.max(4, Math.min(100, value));
  });
}

const state = {
  activeId: 'normal',
  tick: 0,
  paused: false,
  eventLog: [],
};

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

function currentScenario() {
  return scenarios.find((scenario) => scenario.id === state.activeId) || scenarios[0];
}

function createScenarioButton(scenario, small = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scenario-button';
  button.dataset.scenario = scenario.id;
  button.style.setProperty('--scenario-color', scenario.color);
  button.setAttribute('aria-label', `${scenario.label} 시나리오 선택`);
  const label = document.createElement('strong');
  label.textContent = scenario.label;
  button.appendChild(label);
  if (!small) {
    const short = document.createElement('span');
    short.textContent = scenario.short;
    button.appendChild(short);
  }
  button.addEventListener('click', () => selectScenario(scenario.id));
  return button;
}

function initScenarioButtons() {
  const dashboardList = $('#scenarioList');
  const appList = $('#appScenarioList');
  scenarios.forEach((scenario) => {
    dashboardList.appendChild(createScenarioButton(scenario));
    appList.appendChild(createScenarioButton(scenario, true));
  });
}

function selectScenario(id) {
  state.activeId = id;
  const scenario = currentScenario();
  const score = scoreScenario(scenario);
  const level = riskLevel(score);
  state.eventLog.unshift({
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    label: scenario.label,
    score,
    level: statusMeta[level].label,
  });
  state.eventLog = state.eventLog.slice(0, 6);
  render();
}

function activateTab(next, updateHash = true, resetScroll = false) {
  const valid = ['dashboard', 'app', 'report'].includes(next) ? next : 'dashboard';
  $all('.tab').forEach((candidate) => {
    const active = candidate.dataset.tab === valid;
    candidate.classList.toggle('is-active', active);
    candidate.setAttribute('aria-selected', String(active));
  });
  $all('.screen').forEach((screen) => {
    const active = screen.dataset.screen === valid;
    screen.classList.toggle('is-active', active);
    screen.hidden = !active;
  });
  if (updateHash && window.location.hash !== `#${valid}`) {
    window.history.replaceState(null, '', `#${valid}`);
  }
  if (resetScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderTabs() {
  $all('.tab').forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab, true, true));
  });
  window.addEventListener('hashchange', () => activateTab(window.location.hash.slice(1), false));
}

function updateText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function updateRiskClasses(level) {
  const meta = statusMeta[level];
  const ring = $('#scoreRing');
  const phone = $('#phoneStatusCard');
  Object.values(statusMeta).forEach(({ className }) => {
    ring.classList.remove(className);
    phone.classList.remove(className);
  });
  ring.classList.add(meta.className);
  phone.classList.add(meta.className);
  ring.style.setProperty('--ring-color', meta.color);
}

function renderEvidence(scenario) {
  const list = $('#evidenceList');
  list.innerHTML = '';
  scenario.evidence.forEach((item, index) => {
    const li = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = `근거 ${index + 1}`;
    li.appendChild(label);
    li.appendChild(document.createElement('br'));
    li.appendChild(document.createTextNode(item));
    list.appendChild(li);
  });
}


function previewSurface(scenario, score, level) {
  const meta = statusMeta[level];
  if (level === 'danger') return `보호자 앱 상단에 ${meta.label} 배지와 즉시 확인 CTA가 표시됩니다.`;
  if (level === 'watch') return `앱 알림함에 ${meta.label} 카드로 쌓이고, 다음 확인 권장 시간이 표시됩니다.`;
  return `대시보드에는 ${meta.label} 상태로 유지되고 보호자 푸시는 보내지 않습니다.`;
}

function renderSituationPreviews() {
  const list = $('#situationPreviewList');
  if (!list) return;
  list.innerHTML = '';
  scenarios.forEach((scenario) => {
    const score = scoreScenario(scenario);
    const level = riskLevel(score);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `situation-card ${level}`;
    card.dataset.scenario = scenario.id;
    card.setAttribute('aria-label', `${scenario.label} 알림 예시 보기`);
    const badge = document.createElement('span');
    badge.className = 'situation-badge';
    badge.textContent = statusMeta[level].label;
    const title = document.createElement('strong');
    title.textContent = scenario.label;
    const meta = document.createElement('small');
    meta.textContent = `${score}점 · ${scenario.short}`;
    const alert = document.createElement('p');
    alert.textContent = scenario.alert;
    const surface = document.createElement('em');
    surface.textContent = previewSurface(scenario, score, level);
    card.append(badge, title, meta, alert, surface);
    card.addEventListener('click', () => selectScenario(scenario.id));
    list.appendChild(card);
  });
}

function renderEvents() {
  const log = $('#eventLog');
  const phone = $('#phoneNotifications');
  const entries = state.eventLog.length ? state.eventLog : [{ time: '방금', label: '평상시 움직임', score: 18, level: '낮음' }];
  log.innerHTML = '';
  phone.innerHTML = '';
  entries.forEach((event) => {
    const item = document.createElement('li');
    item.textContent = `${event.time} · ${event.label} · ${event.score}점(${event.level})`;
    log.appendChild(item);
    const phoneItem = document.createElement('li');
    phoneItem.textContent = `${event.label} — ${event.score}점`;
    phone.appendChild(phoneItem);
  });
}

function drawChart(scenario) {
  const canvas = $('#csiChart');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.dataset.dpr !== String(dpr)) {
    canvas.width = 960 * dpr;
    canvas.height = 360 * dpr;
    canvas.dataset.dpr = String(dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const cssWidth = 960;
  const cssHeight = 360;
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
  gradient.addColorStop(0, '#06111f');
  gradient.addColorStop(1, '#020617');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.09)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= cssWidth; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssHeight); ctx.stroke();
  }
  for (let y = 40; y <= cssHeight; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssWidth, y); ctx.stroke();
  }

  const series = generateSeries(scenario.patternType, state.tick);
  const xStep = cssWidth / (series.length - 1);
  const yFor = (value) => cssHeight - 30 - (value / 100) * (cssHeight - 60);

  const inactiveStart = series.findIndex((value, index) => index > 24 && value < 24);
  if (inactiveStart > 0) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.fillRect(inactiveStart * xStep, 24, cssWidth - inactiveStart * xStep - 20, cssHeight - 48);
  }

  ctx.beginPath();
  series.forEach((value, index) => {
    const x = index * xStep;
    const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = scenario.color;
  ctx.lineWidth = 4;
  ctx.shadowColor = scenario.color;
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const anomalyIndexes = series.map((value, index) => ({ value, index })).filter(({ value }) => value > 70);
  anomalyIndexes.forEach(({ value, index }) => {
    const x = index * xStep;
    const y = yFor(value);
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  ctx.fillStyle = 'rgba(248, 250, 252, .9)';
  ctx.font = '700 18px system-ui';
  ctx.fillText(`CSI signal · ${scenario.label}`, 24, 34);
  ctx.fillStyle = 'rgba(168, 196, 216, .88)';
  ctx.font = '500 14px system-ui';
  ctx.fillText(anomalyIndexes.length ? '이상 피크 감지됨' : '이상 피크 없음', 24, 58);
}



function renderExampleGallery(scenario) {
  const current = exampleImages[scenario.id] || exampleImages.normal;
  const img = $('#exampleImage');
  if (img) {
    img.src = current.src;
    img.alt = `RuView 사용 시 ${scenario.label} 예시 이미지`;
  }
  updateText('#exampleImageTitle', scenario.label);
  updateText('#exampleImageCaption', current.caption);
  const list = $('#exampleThumbList');
  if (!list) return;
  list.innerHTML = '';
  scenarios.forEach((item) => {
    const meta = exampleImages[item.id] || exampleImages.normal;
    const score = scoreScenario(item);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `example-thumb ${item.id === scenario.id ? 'is-active' : ''}`;
    button.setAttribute('aria-label', `${item.label} RuView 예시 이미지 보기`);
    const thumb = document.createElement('img');
    thumb.src = meta.src;
    thumb.alt = '';
    thumb.loading = 'lazy';
    const label = document.createElement('strong');
    label.textContent = item.label;
    const detail = document.createElement('span');
    detail.textContent = `${score}점 · ${item.short}`;
    button.append(thumb, label, detail);
    button.addEventListener('click', () => selectScenario(item.id));
    list.appendChild(button);
  });
}


function render() {
  const scenario = currentScenario();
  const score = scoreScenario(scenario);
  const level = riskLevel(score);
  const meta = statusMeta[level];

  updateRiskClasses(level);
  $('#scoreRing').style.setProperty('--score', score);
  updateText('#riskScore', String(score));
  updateText('#stateLabel', scenario.label);
  updateText('#stateSummary', scenario.summary);
  updateText('#chartSummary', `${scenario.label}: ${scenario.summary} 위험 점수 ${score}점, 알림 단계 ${meta.label}.`);
  updateText('#spikeMetric', scenario.spike);
  updateText('#inactiveMetric', scenario.inactive);
  updateText('#patternMetric', scenario.pattern);
  updateText('#alertLevel', meta.label);
  updateText('#alertMessage', scenario.alert);

  updateText('#phoneRoom', scenario.room);
  updateText('#phoneState', scenario.label);
  updateText('#phoneAlert', scenario.alert);
  updateText('#phoneScore', String(score));
  updateText('#phoneInactive', scenario.inactive);
  updateText('#phonePattern', scenario.pattern);
  updateText('#phoneActionResult', scenario.action);

  $all('.scenario-button').forEach((button) => {
    const active = button.dataset.scenario === scenario.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderEvidence(scenario);
  renderEvents();
  renderSituationPreviews();
  renderExampleGallery(scenario);
  drawChart(scenario);
}

function initActions() {
  $('#pauseBtn').addEventListener('click', (event) => {
    state.paused = !state.paused;
    event.currentTarget.setAttribute('aria-pressed', String(state.paused));
    event.currentTarget.setAttribute('aria-label', state.paused ? '그래프 움직임 재개' : '그래프 움직임 일시정지');
  });
  $('#sendAlertBtn').addEventListener('click', () => {
    const scenario = currentScenario();
    const score = scoreScenario(scenario);
    $('#toast').textContent = `${scenario.label}(${score}점) 확인 요청이 보호자 앱 알림 예시로 기록되었습니다.`;
  });
  $all('.app-action').forEach((button) => {
    button.addEventListener('click', () => {
      const actionMap = {
        call: '보호자 전화 연결 화면으로 이동하는 예시입니다.',
        neighbor: '가까운 돌봄 담당자에게 확인 요청을 보내는 예시입니다.',
        note: '상황 메모가 최근 이벤트에 첨부되는 예시입니다.',
      };
      $('#phoneActionResult').textContent = actionMap[button.dataset.action] || currentScenario().action;
    });
  });
}

function init() {
  initScenarioButtons();
  renderTabs();
  activateTab(window.location.hash.slice(1), false);
  window.setTimeout(() => window.scrollTo(0, 0), 0);
  initActions();
  state.eventLog.unshift({ time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), label: '평상시 움직임', score: 18, level: '낮음' });
  render();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    window.setInterval(() => {
      if (!state.paused) {
        state.tick += 1;
        drawChart(currentScenario());
      }
    }, 900);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

if (typeof window !== "undefined") { window.SafeWaveDemo = { scenarios, scoreScenario, riskLevel, generateSeries, exampleImages }; }
