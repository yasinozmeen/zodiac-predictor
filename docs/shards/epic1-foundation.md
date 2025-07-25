# Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Projenin temel altyapısını kurmak, geliştirme ortamını hazırlamak
ve ilk deployable versiyonu oluşturmak.

## Story Breakdown

### Story 1.1: Project Setup and Repository Structure

As a developer, I want a properly configured monorepo structure with React
frontend and Node.js backend, so that I can efficiently develop and maintain the
full-stack application.

#### Acceptance Criteria

1. Monorepo structure kurulmuş ve çalışır durumda
2. Frontend (React + TypeScript) ve backend (Node.js + Express + TypeScript)
   temel yapıları hazır
3. Shared types ve utilities için ortak paket oluşturulmuş
4. Package.json scripts ile geliştirme komutları tanımlanmış
5. ESLint, Prettier ve TypeScript konfigürasyonları ayarlanmış
6. Git ignore dosyaları ve temel README dokümantasyonu eklenmiş

### Story 1.2A: Basic Database Tables and Supabase Integration

As a developer, I want basic database tables with Supabase integration, so that
I can start building the core survey functionality.

#### Acceptance Criteria

1. Supabase projesi oluşturulmuş ve connection kurulmuş
2. Categories tablosu (id, name, description, order_index)
3. Questions tablosu (id, category_id, question_text, order_index)
4. Question_options tablosu (id, question_id, option_text, order_index)
5. Basit CRUD operasyonları test edilmiş
6. Connection pooling ve error handling kurulmuş

### Story 1.2B: Advanced Schema and Scoring System

As a developer, I want advanced database schema for scoring and session
management, so that I can implement the zodiac prediction algorithm.

#### Acceptance Criteria

1. Zodiac_scoring tablosu (question_option_id, zodiac_sign, score_value)
2. User_sessions tablosu (session_id, ip_address, created_at, completed_at)
3. User_responses tablosu (session_id, question_id, selected_option_id,
   answered_at)
4. Database migration scripts ve seed data hazır
5. Complex relationships ve indexing optimize edilmiş

### Story 1.3: Basic Frontend Structure and Routing

As a user, I want to navigate between different pages of the application, so
that I can access the survey and see results.

#### Acceptance Criteria

1. React Router kurulmuş ve temel route'lar tanımlanmış (/, /survey, /result)
2. Ana layout komponenti oluşturulmuş
3. Loading states ve error boundaries implement edilmiş
4. Responsive design için Tailwind CSS kurulmuş
5. Temel header/navigation komponenti çalışır durumda
6. 404 page ve error handling yapıları kurulmuş

### Story 1.4: Backend API Structure and Health Check

As a system administrator, I want a well-structured backend API with health
monitoring, so that I can ensure the system is running properly.

#### Acceptance Criteria

1. Express server kurulmuş ve çalışır durumda
2. /health endpoint aktif ve sistem durumunu dönüyor
3. CORS, helmet ve basic security middleware kurulmuş
4. Environment variables için dotenv konfigürasyonu
5. Error handling middleware yapısı kurulmuş
6. API versioning stratejisi (/api/v1) implement edilmiş
7. Rate limiting basic olarak kurulmuş

### Story 1.5: Development Environment and Scripts

As a developer, I want easy-to-use development scripts and environment setup, so
that I can efficiently work on the project.

#### Acceptance Criteria

1. npm run dev komutu hem frontend hem backend'i başlatır
2. npm run build production build oluşturur
3. npm run test tüm testleri çalıştırır
4. Hot reload hem frontend hem backend için çalışır
5. Environment variables .env.example ile dokümante edilmiş
6. Development database seeding scripts hazır
7. Docker compose file (opsiyonel) local development için

### Story 1.6: Development Environment Verification and Documentation

As a developer, I want comprehensive verification of the development
environment, so that the team can onboard efficiently and development workflows
are reliable.

#### Acceptance Criteria

1. End-to-end development workflow test edilmiş
2. Team onboarding dokümantasyonu oluşturulmuş
3. CI/CD pipeline temel kurulumu yapılmış
4. Development best practices guide hazırlanmış
5. Troubleshooting guide ortak sorunlar için
6. Performance benchmarks initial setup için

## Implementation Priority

**Sprint 1 Focus:** Stories 1.1, 1.2A, 1.3, 1.4 **Sprint 2 Completion:** Stories
1.2B, 1.5, 1.6

## Success Criteria

- [ ] Tüm development scripts çalışır durumda
- [ ] Frontend ve backend birbirine bağlı
- [ ] Database CRUD operasyonları test edilmiş
- [ ] Team member yeni environment kurabilir
- [ ] Basic deployment pipeline aktif
