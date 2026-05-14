# ARCHITECTURE STATUTE

## 폴더 구조
- `src/features/`: 도메인별 핵심 기능 로직 및 컴포넌트
- `src/shared/`: 여러 기능에서 공용으로 사용하는 유틸리티, 훅, 상수 (예: supabase client)
- `src/pages/`: 라우팅의 단위가 되는 페이지 컴포넌트
- `src/assets/`: 이미지, 스타일 등 정적 자원

## 기술 스택
- **Frontend:** React (Vite)
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Vanilla CSS

## 구현 규칙
- Supabase 클라이언트는 `src/shared/supabase/client.js`에서만 생성하고 참조한다.
- 상태 관리는 가급적 React 내장 훅(`useState`, `useContext`, `useReducer`)을 우선적으로 사용한다.
