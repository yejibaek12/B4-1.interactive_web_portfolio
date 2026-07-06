# 🌐 나만의 반응형 포트폴리오 웹사이트 (Responsive Portfolio)

HTML, CSS, JavaScript만을 활용하여 브라우저의 기본 동작 원리를 이해하고, 반응형 인터랙션 및 외부 REST API 연동을 직접 체득하며 구현하는 프론트엔드 포트폴리오 웹 프로젝트입니다.

---

## 🔗 배포 주소 (GitHub Pages)
- **라이브 사이트 주소**: [https://yejibaek12.github.io/responsive-portfolio/](https://yejibaek12.github.io/responsive-portfolio/)

---

## 🛠️ 사용 기술 및 도구 (Tech Stack)
- **Markup**: `HTML5` (웹 표준 규격 준수, 시맨틱 태그 구조화)
- **Styling**: `Vanilla CSS3` (CSS 변수 테마 관리, Flexbox & Grid 레이아웃, 미디어 쿼리)
- **Script**: `Vanilla JavaScript (ES6+)` (DOM API, LocalStorage, Intersection Observer)
- **Library**: `FontAwesome 6.4.0` (벡터 아이콘), `Google Fonts` (Outfit & Noto Sans KR 웹 폰트)
- **External API**: `GitHub REST API` (공개 리포지토리 비동기 연동)

---

## ✨ 주요 특징 및 구현 기능 (Key Features)

### ❶ 시맨틱 마크업 & 웹 접근성 준수
- 단순 `div` 남용을 지양하고 `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` 등의 시맨틱 태그를 사용하여 SEO 및 가독성을 극대화했습니다.
- 스크린 리더 지원을 위해 프로필 이미지 등의 `alt` 속성을 명확하게 기재하고, 문의 폼의 `label`과 `input`을 매칭했습니다.

### ❷ 미디어 쿼리를 활용한 모바일 퍼스트 반응형 레이아웃
- 모바일(767px 이하), 태블릿(768px 이상), 데스크톱(1024px 이상) 기기에 최적화된 반응형 뷰포트를 제공합니다.
- 포트폴리오를 구성하는 6대 필수 섹션(**Hero, About, Skills, Projects, Contact, Footer**)을 모두 유연한 배치로 수록했습니다.
- 모바일 환경에서는 상단바 메뉴를 숨기고 햄버거 버튼 토글을 통해 접근할 수 있게 레이아웃을 최적화했습니다.

### ❸ 로컬스토리지 연동 다크 모드 (LocalStorage Persistent Theme)
- `:root` 선택자와 다크 속성 선택자(`[data-theme="dark"]`)를 분리해 CSS 변수 기반 테마 전환을 구현했습니다.
- 사용자가 설정한 테마 상태를 브라우저 로컬스토리지에 저장하여 페이지가 새로고침되어도 변경된 테마가 유지됩니다.

### ❹ 고성능 스크롤 탑 버튼 & 다이내믹 네비게이션바
- 스크롤을 60px 이상 내리면 네비게이션 헤더가 압축되는 압축 뷰 스타일을 적용했습니다.
- 스크롤을 300px 이상 내리면 우측 하단에 부드럽게 나타나는 둥근 스크롤 탑 버튼을 생성하고, 클릭 시 자연스럽게 웹 최상단으로 유동 이동시킵니다.

### ❺ Intersection Observer 활용 스크롤 페이드인
- 브라우저 스크롤 과부하 현상을 방어하기 위해 `Intersection Observer` API를 활용하여 섹션이 뷰포트 영역 내부(20% 이상)로 들어오는 순간에만 등장을 트리거하도록 설계했습니다.

### ❻ 이메일 규격 및 필수값 폼 유효성 검사 (Form UX)
- 이름, 이메일, 메시지 입력값 누락 시 에러 상태 피드백을 안내합니다.
- 정규표현식(Regex)을 이용해 이메일 문자열의 규격을 검사하고, 오류 문구를 즉시 노출하며, 글자 타이핑 시작 시 실시간으로 피드백을 제거해 주는 편의 기능을 입혔습니다.

### ❼ GitHub REST API 비동기 처리 및 4가지 UI 상태 제어
- `fetch` 및 `async/await` 통신을 기반으로 본인의 공개 저장소 목록을 비동기식으로 호출합니다.
- 네트워크 처리 상태에 따른 <b>4가지 화면 상태(로딩, 성공, 없음, Rate Limit 403 장애 에러)</b>를 별도의 UI로 세분화하여 표현했으며, API 에러 상황 발생 시 동작하는 `다시 시도하기` 버튼 이벤트를 부착했습니다.

---

## 🚀 로컬 실행 방법
1. 프로젝트 폴더를 VS Code로 엽니다.
2. `Live Server` 확장을 설치합니다.
3. `index.html` 파일을 열고 마우스 우클릭 -> <b>"Open with Live Server"</b>를 클릭하여 브라우저에서 실행합니다.
