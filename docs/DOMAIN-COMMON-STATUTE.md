# DOMAIN COMMON STATUTE

## 공통 필드 규칙
- `id`: UUID (v4)
- `created_at`: timestamptz (default: now())
- `updated_at`: timestamptz (default: now())

## 에러 처리 규칙
- API 호출 시 발생하는 에러는 콘솔에 로그를 남기고, UI를 통해 사용자에게 알림을 제공한다.
