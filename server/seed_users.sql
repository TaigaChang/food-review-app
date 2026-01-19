-- Insert test users
INSERT INTO users (name_first, name_last, email, password, created_at) VALUES
('Alice', 'Johnson', 'alice@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW()),
('Bob', 'Smith', 'bob@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW()),
('Carol', 'Davis', 'carol@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW()),
('David', 'Wilson', 'david@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW()),
('Emma', 'Brown', 'emma@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW());
