# DOMAIN POST STATUTE

## 테이블 정의: `posts`
- `id`: UUID
- `author_id`: `profiles(id)` 참조
- `title`: 필수
- `content`: 선택

## 테이블 정의: `images`
- `post_id`: `posts(id)` 참조
- `file_path`: Storage 내 객체 경로
- `mime_type`: 파일 타입
- `file_size`: 파일 크기

## Storage 규칙
- `images-thumbnail`: 공용 읽기 가능 버킷
- `images-original`: 작성자 본인만 읽기 가능 버킷
