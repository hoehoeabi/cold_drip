# DOMAIN MEMBER STATUTE

## 테이블 정의: `profiles`
- `id`: `auth.users(id)` 참조
- `username`: 필수, 유니크
- `avatar_url`: 선택

## 트리거 규칙
- `auth.users`에 신규 행 생성 시 `public.profiles`에 자동으로 기본 정보를 삽입한다.
