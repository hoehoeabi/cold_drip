# TODO READY

## 초기 기획

- [ ] 핵심 기능 정의: 사진 업로드, 게시글 작성/조회, 좋아요/댓글 필요 여부 확정
- [ ] 사용자 흐름 정의: 비회원 조회 가능 범위와 로그인 사용자 작성 권한 정리
- [ ] 데이터 모델 초안 작성: `posts`, `images`, `profiles` 테이블의 필수 컬럼 도출
- [ ] MVP 범위 확정: 1차 배포에 포함할 기능/제외할 기능 명시

## 프로젝트 설정

- [x] React 프로젝트 생성 및 기본 폴더 구조(`features`, `shared`, `pages`) 정리
- [x] Supabase CLI 설치 및 프로젝트 초기화(`supabase init`)
- [x] Supabase 로컬 개발 환경 실행 및 연결 확인(`supabase start`)
- [x] 환경 변수 파일 구성(`.env.local`) 및 Supabase URL/ANON KEY 주입 구조 설정
- [x] Supabase 마이그레이션 기본 파일 생성 후 초기 스키마 반영
- [x] Storage 버킷 전략 수립(원본/썸네일 분리 여부, 파일명 규칙)
- [x] 원격 Supabase 프로젝트 연동 및 마이그레이션 푸시

## 품질/운영 기본 설정

- [ ] 코드 스타일 도구 설정(ESLint, Prettier) 및 스크립트 추가
- [x] `docs/` 내 아키텍처 및 도메인 문서 초기화
- [ ] Git 브랜치 전략 및 커밋 규칙(예: feat/fix/docs) 합의
- [ ] 최소 테스트 전략 정의(컴포넌트 단위 테스트 범위, API 검증 방식)