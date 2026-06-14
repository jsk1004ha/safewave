# SafeWave Demo

Wi-Fi CSI 기반 고령자 낙상·무활동 위험 감지 시스템 데모 사이트입니다.

## 실행

가장 간단하게는 `index.html`을 더블클릭해 `file://`로 열 수 있습니다. 모듈 스크립트를 쓰지 않기 때문에 CORS 오류 없이 동작합니다.

```bash
python3 -m http.server 4173
# 또는 http://localhost:4173 열기
```

## 구성

- `index.html` — 3개 화면(실시간 대시보드, 앱 구현 화면, 보고서 한눈에 보기)
- `src/styles.css` — RE-RoadSchool풍 깔끔한 라이트 UI 스타일
- `src/app.js` — 시나리오, 위험 점수, 그래프, 보호자·돌봄 담당자 알림/로그 상호작용
- `tests/smoke.mjs` — 정적/기능 계약 검사

## 주의

이 데모는 실제 센서가 아닌 가상 CSI 데이터를 사용합니다. 원본 PDF의 개인정보/신청서 메타데이터는 렌더링하지 않고, SafeWave 아이디어 설명에 필요한 선별 정보만 사용합니다.
