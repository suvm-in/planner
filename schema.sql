-- =====================================================
-- SQL 다이어리 연습용 데이터베이스
-- 실행:  mysql -u root -p < schema.sql
-- (여러 번 실행해도 괜찮아요. 처음 상태로 초기화됩니다.)
-- =====================================================

-- 한글/이모지가 깨지지 않도록 이 파일을 UTF-8(utf8mb4)로 보냅니다.
SET NAMES utf8mb4;

-- 1) 데이터베이스 만들기
DROP DATABASE IF EXISTS diary_db;
CREATE DATABASE diary_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diary_db;

-- 2) 카테고리 테이블
CREATE TABLE categories (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- 3) 일기 테이블 (category_id 로 categories 와 연결 = 외래 키)
CREATE TABLE entries (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    content     TEXT         NOT NULL,
    mood        VARCHAR(10)  NOT NULL DEFAULT '',
    category_id INT          NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_entries_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4) 기본 데이터
INSERT INTO categories (name) VALUES ('일상'), ('생각'), ('여행'), ('기타');

INSERT INTO entries (title, content, mood, category_id, created_at, updated_at) VALUES
('오늘의 노을이 정말 예뻤다', '하루가 끝나가는 시간이 이렇게 아름다울 줄이야.', '😊', 1, '2026-10-25 19:00:00', '2026-10-25 19:00:00'),
('새로운 시작을 준비하며', '지금까지 해온 것들을 돌아보며 앞으로 더 좋은 방향으로 나아가고 싶다.', '😐', 2, '2026-10-24 13:00:00', '2026-10-24 13:00:00'),
('주말에 다녀온 작은 여행', '맑은 공기와 푸른 나무 덕분에 스트레스를 잠시 잊을 수 있었다.', '😊', 3, '2026-10-22 09:00:00', '2026-10-22 09:00:00');

-- 5) 서버가 접속할 전용 계정 (root 대신 사용)
CREATE USER IF NOT EXISTS 'diary_user'@'localhost' IDENTIFIED BY 'diary1234';
GRANT SELECT, INSERT, UPDATE, DELETE ON diary_db.* TO 'diary_user'@'localhost';
FLUSH PRIVILEGES;