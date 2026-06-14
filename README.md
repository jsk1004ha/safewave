# SafeWave 앱·대시보드 통합 데모

사용자가 제공한 두 HTML 스냅샷을 기준으로 기존 구현을 리셋하고, `index.html` 하나로 실행되는 발표용 인터랙티브 데모로 다시 구성했습니다.

## 기준 파일

- 앱 화면 원본: `C:\Users\js100\Downloads\safewave_mobile_ui.html` → 작업용 `app.html`
- 대시보드 원본: `C:\Users\js100\Downloads\safewave_dashboard.html` → 작업용 `dashboard.html`
- 실행 파일: `index.html` — 앱/대시보드를 iframe 없이 같은 DOM에 직접 포함한 단일 파일 데모

## 반영 사항

- `index.html` 하나만 열어도 앱과 대시보드가 모두 표시됩니다.
- iframe, srcdoc, 외부 JS/CSS 로드 없이 동작합니다.
- 앱 목업은 실제 휴대폰 비율에 맞춰 9:16으로 렌더링합니다.
- 앱 탭/알림/상세/통계와 대시보드 정상·무활동·낙상 상황 시뮬레이션이 클릭으로 작동합니다.

## 실행

`index.html`을 더블클릭해서 열면 됩니다.

또는:

```bash
npm run serve
# http://localhost:4173 열기
```

## 검증

```bash
npm test
```
