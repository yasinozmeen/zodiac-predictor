# Zodiac Predictor Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- BMad-Method framework'ünü baştan sona öğrenmek ve pratik yapmak
- Modern full-stack development sürecini deneyimlemek (React + Node.js +
  Supabase + AWS)
- AI-driven development metodolojilerini öğrenmek
- Eğlenceli ve kişiselleştirilmiş burç tahmin deneyimi sunmak
- Sosyal paylaşılabilir ve viral potansiyeli olan bir uygulama geliştirmek

### Background Context

Bu proje, BMad-Method framework'ünü öğrenmek için tasarlanmış pratik odaklı bir
çalışmadır. Geleneksel burç uygulamalarından farklı olarak, kullanıcının burcunu
doğrudan sormak yerine günlük yaşam alışkanlıkları ve kişilik özelliklerine dair
sorular sorarak algoritmik bir tahmin sistemi geliştirecektir. Proje, hem teknik
öğrenme hedeflerini karşılamakta hem de kullanıcılar için eğlenceli bir deneyim
sunmaktadır.

### Change Log

| Date       | Version | Description                             | Author  |
| ---------- | ------- | --------------------------------------- | ------- |
| 2024-07-24 | 1.0     | Initial PRD creation from project brief | PM John |

## Requirements

### Functional

**FR1:** Sistem, kullanıcılara 5 farklı kategoride (Günlük Rutinler, Sosyal
Davranışlar, Yemek & Tercihler, Karar Verme Tarzı, Yaratıcılık & Hobiler) toplam
50+ soru sorabilmelidir.

**FR2:** Her soru için çoktan seçmeli cevap seçenekleri sunulmalı ve kullanıcı
tek bir seçenek seçebilmelidir.

**FR3:** Sistem, kullanıcının verdiği cevaplara göre 12 burç (Koç, Boğa,
İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık) için
puanlama hesaplaması yapabilmelidir.

**FR4:** Uygulama, en yüksek puanlı burcunu %XX güven oranıyla "sihirli" bir
sunum formatında kullanıcıya sunmalıdır.

**FR5:** Kullanıcı, test sırasında ilerleme durumunu görebilmeli (X/50 soru
tamamlandı, kategori geçişleri).

**FR6:** Sistem, kullanıcıyı sıkmamak için soruları eğlenceli ve günlük yaşamdan
metinlerle sunmalıdır.

**FR7:** Sonuç sayfasında, tahmin edilen burcun karakteristik özelliklerini
kullanıcıya göstermelidir.

**FR8:** Uygulama, responsive tasarım ile hem mobil hem de desktop cihazlarda
sorunsuz çalışmalıdır.

### Non Functional

**NFR1:** Sayfa yükleme süresi 2 saniyeyi geçmemelidir (initial paint), 3 saniye
interactive ready.

**NFR2:** Soru geçiş animasyonları 1 saniyeyi geçmemelidir.

**NFR3:** Uygulama, modern browsers (Chrome, Firefox, Safari, Edge) ile uyumlu
olmalıdır.

**NFR4:** Sistem, AWS Free Tier ve Supabase Free Plan limitlerinde kalacak
şekilde optimize edilmelidir.

**NFR5:** Tüm veri iletişimi HTTPS üzerinden şifrelenmiş olarak
gerçekleşmelidir.

**NFR6:** Session-based kullanıcı takibi ile aynı cevaplar aynı sonucu
vermelidir (tutarlılık).

## User Interface Design Goals

### Overall UX Vision

Kullanıcı, sanki gerçek bir "falcı" veya "burç uzmanı" ile konuşuyormuş gibi
hissetmelidir. Sorular sıradan ve günlük hayattan olacak, ancak sonuç "sihirli"
ve şaşırtıcı bir deneyim sunacak. Modern, temiz ve eğlenceli bir arayüz ile
kullanıcının testi tamamlama motivasyonu yüksek tutulacak.

### Key Interaction Paradigms

- **Progressive Disclosure**: Sorular tek tek sunulur, kullanıcı bunalmaz
- **Gamification**: İlerleme çubukları, kategori geçiş animasyonları
- **Micro-interactions**: Cevap seçimleri, loading animasyonları
- **Storytelling**: Sonuç sunumu dramatik ve kişiselleştirilmiş

### Core Screens and Views

- **Ana Sayfa**: Hoş geldin, teste başla butonu
- **Soru Ekranı**: Tek soru, çoktan seçmeli cevaplar, ilerleme çubuğu
- **Kategori Geçiş**: "Şimdi yemek tercihlerine geçelim..." tarzı geçişler
- **Loading/Hesaplama**: "Cevaplarınızı analiz ediyorum..." dramatik bekleme
- **Sonuç Sayfası**: Burç açıklaması, güven yüzdesi, özellikler listesi
- **Yeniden Test**: "Başka biri için test yap" seçeneği

### Accessibility: WCAG AA

- Keyboard navigation desteği
- Screen reader uyumluluğu
- Yeterli renk kontrastı
- Font boyutu esnekliği

### Branding

Modern, mistik ama oyuncu bir görsel kimlik. Pembe tonları ve altın aksan
renkler kullanarak "sihirli" atmosfer yaratmak. Yıldız, ay ve gezegen sembolleri
ile burç estetiği. Pink Mystique tema ile feminine mystical yaklaşım.

### Target Device and Platforms: Web Responsive

Tüm modern cihazlarda mükemmel deneyim: iPhone, Android, tablet, desktop.

## Technical Assumptions

### Repository Structure: Monorepo

Frontend ve backend tek repository'de organize edilecek, shared utilities ve
types için ortak paketler kullanılacak.

### Service Architecture

Full-stack monolith yaklaşımı MVP için yeterli. React frontend, Node.js Express
backend, Supabase database ile basit ve etkili mimari.

### Testing Requirements

Unit ve integration testing. Frontend component testleri, backend API testleri,
end-to-end test coverage %80+ hedeflenmekte.

### Additional Technical Assumptions and Requests

- Modern JavaScript/TypeScript kullanımı zorunlu
- Responsive CSS framework olarak Tailwind CSS tercih edilmeli
- State management için React Context API yeterli (Redux gerekmez)
- API rate limiting ve basic security measures uygulanmalı
- Git workflow ile feature branch stratejisi kullanılmalı

## Epic List

**Epic 1: Foundation & Core Infrastructure** Proje setup, authentication, temel
user management ve development environment kurulumu

**Epic 2: Question Management System** Soru bankası oluşturma, kategorilendirme
ve yönetim sistemi

**Epic 3: Survey Flow & User Experience** Kullanıcının soru-cevap deneyimi,
ilerleme takibi ve kategori geçişleri

**Epic 4: Scoring Algorithm & Zodiac Prediction** Cevap-burç eşleştirme
algoritması ve tahmin hesaplama sistemi

**Epic 5: Results Presentation & User Engagement** Dramatik sonuç sunumu, burç
açıklamaları ve kullanıcı engagement özellikleri

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Projenin temel altyapısını kurmak, geliştirme ortamını hazırlamak
ve ilk deployable versiyonu oluşturmak. Bu epic, tüm sonraki geliştirme
çalışmaları için güvenilir bir temel sağlayacak.

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

## Epic 2: Question Management System

**Epic Goal:** Burç tahmin algoritması için gerekli soru bankasını oluşturmak,
kategorilere organize etmek ve yönetim sistemini kurmak.

### Story 2.1: Question Categories and Basic Structure

As a content manager, I want to organize questions into meaningful categories,
so that the survey has a logical flow and covers all personality aspects.

#### Acceptance Criteria

1. 5 kategori tanımlanmış ve database'e eklenmiş:
   - Günlük Rutinler (Morning routines, sleep patterns)
   - Sosyal Davranışlar (Social interactions, conflict resolution)
   - Yemek & Tercihler (Food preferences, ordering style)
   - Karar Verme Tarzı (Shopping, risk-taking, decision speed)
   - Yaratıcılık & Hobiler (Music, movies, color preferences)
2. Her kategori için minimum 10-12 soru hazırlanmış
3. API endpoint'i kategori listesini dönüyor (/api/v1/categories)
4. Frontend kategori navigation yapısı kurulmuş

### Story 2.2: Question Bank Creation and Zodiac Mapping

As a content creator, I want a comprehensive question bank with zodiac sign
mappings, so that the algorithm can accurately predict user's zodiac sign.

#### Acceptance Criteria

1. Toplam 50+ soru oluşturulmuş ve database'e eklenmiş
2. Her soru için 3-4 çoktan seçmeli cevap seçeneği tanımlanmış
3. Her cevap seçeneği için zodiac sign puanlama matrisi oluşturulmuş
4. Soru metinleri eğlenceli ve günlük hayattan örneklerle yazılmış
5. API endpoint'i soruları kategori bazında dönüyor
   (/api/v1/questions/:categoryId)
6. Zodiac scoring algorithm temel versiyonu hazır

### Story 2.3: Question Validation and Content Quality

As a user, I want well-written and engaging questions, so that I enjoy taking
the survey and trust the results.

#### Acceptance Criteria

1. Tüm sorular grammar ve spell-check'ten geçmiş
2. Soru metinleri kullanıcı dostu ve anlaşılır
3. Cevap seçenekleri balanced ve realistic
4. Content review process dokümante edilmiş
5. Test kullanıcıları ile sorular validate edilmiş
6. Offensive veya bias içeren sorular eliminate edilmiş

## Epic 3: Survey Flow & User Experience

**Epic Goal:** Kullanıcının soruları yanıtlama deneyimini optimize etmek,
eğlenceli ve akıcı bir survey flow oluşturmak.

### Story 3.1: Survey Landing Page and User Onboarding

As a new user, I want an attractive landing page that explains the survey, so
that I understand what to expect and feel motivated to start.

#### Acceptance Criteria

1. Çekici hero section ile survey açıklaması
2. "Testi Başlat" call-to-action butonu prominent
3. Tahmini süre bilgisi (10-15 dakika)
4. Privacy statement ve data usage açıklaması
5. Mobile-responsive tasarım
6. Loading animations ve micro-interactions

### Story 3.2: Question Display and Answer Selection

As a user taking the survey, I want to easily read questions and select my
answers, so that I can complete the survey efficiently.

#### Acceptance Criteria

1. Tek soru ekran layout'u optimize edilmiş
2. Cevap seçenekleri clear ve clickable
3. Selected state visual feedback
4. Next/Previous navigation butonları
5. Question numbering ve category indication
6. Mobile touch targets appropriate size

### Story 3.3: Progress Tracking and Category Transitions

As a user, I want to see my progress through the survey, so that I know how much
is left and stay motivated.

#### Acceptance Criteria

1. Progress bar tüm sorular için overall progress gösteriyor
2. Current category indication (ör: "Günlük Rutinler 3/10")
3. Kategory transition animations ve messaging
4. "Şimdi X kategorisine geçiyoruz..." transition pages
5. Estimated time remaining calculation
6. Option to pause and resume (session-based)

### Story 3.4: Survey Completion and Loading Experience

As a user who completed all questions, I want an engaging loading experience
while my results are calculated, so that I feel anticipation for my zodiac
prediction.

#### Acceptance Criteria

1. "Cevaplarınızı analiz ediyorum..." loading page
2. Progressive loading messages ("Kişilik özelliklerinizi değerlendiriyorum...")
3. Mystical loading animation (stars, constellations)
4. Realistic loading time (3-5 seconds) for drama
5. Smooth transition to results page
6. Error handling if calculation fails

## Epic 4: Scoring Algorithm & Zodiac Prediction

**Epic Goal:** Kullanıcı cevaplarına göre doğru ve tutarlı burç tahmini yapan
algoritma sistemini geliştirmek.

### Story 4.0: Zodiac-Personality Research and Algorithm Design

As a content strategist, I want comprehensive research on zodiac-personality
correlations, so that the scoring algorithm is based on accurate astrological
knowledge.

#### Acceptance Criteria

1. Astroloji kaynaklarından burç-kişilik eşleştirmeleri araştırılmış
2. Scoring methodology tasarlanmış (weighted vs simple scoring)
3. Test dataset oluşturulmuş (known personality examples)
4. Algorithm pseudocode hazırlanmış ve review edilmiş
5. Edge cases ve corner cases identified edilmiş
6. Validation strategy için test criteria belirlendi

### Story 4.1: Basic Scoring Algorithm Implementation

As a system, I want to calculate zodiac scores based on user responses, so that
I can predict the most likely zodiac sign.

#### Acceptance Criteria

1. Scoring engine user responses'ları alıp zodiac puanları hesaplıyor
2. Weighted scoring system (bazı sorular daha önemli)
3. All 12 zodiac signs için score calculation
4. Tie-breaking logic en yüksek puanlı burç için
5. API endpoint /api/v1/calculate-zodiac POST method
6. Input validation ve error handling

### Story 4.2: Confidence Level and Result Accuracy

As a user, I want to see how confident the system is in its prediction, so that
I can trust the accuracy of my zodiac result.

#### Acceptance Criteria

1. Confidence percentage calculation (%XX emin)
2. Confidence level kategorileri (Çok Yüksek >90%, Yüksek 70-90%, Orta 50-70%)
3. Multiple zodiac possibilities eğer scores close ise
4. "Şu burçlar da olabilirsin" alternative suggestions
5. Confidence calculation algorithm documented
6. Minimum confidence threshold (örn: %60 altında "belirsiz")

### Story 4.3: Algorithm Testing and Validation

As a developer, I want comprehensive testing of the scoring algorithm, so that I
can ensure consistent and logical results.

#### Acceptance Criteria

1. Unit tests tüm scoring functions için yazılmış
2. Test cases known personality types için oluşturulmuş
3. Same inputs always produce same outputs (consistency test)
4. Edge case testing (all same answers, random answers)
5. Performance testing large number of responses için
6. Algorithm documentation ve logic explanation

### Story 4.4A: Basic Result Explanation System

As a user, I want to understand the basic reasoning behind my zodiac prediction,
so that the result feels credible and trustworthy.

#### Acceptance Criteria

1. "Bu tahminle nasıl vardık?" explanation section
2. Template-based explanations for each zodiac sign
3. Static zodiac characteristics display
4. Basic confidence level explanation
5. Simple algorithm logic overview
6. User-friendly language ve clear messaging

### Story 4.4B: Advanced Personalization Engine

As a user, I want highly personalized explanations that reference my specific
answers, so that the prediction feels uniquely tailored to me.

#### Acceptance Criteria

1. Key responses highlighting ("Sabah su içme alışkanlığınız...")
2. Zodiac traits matching ile user responses
3. Dynamic personalized result text generation
4. Multiple explanation templates for variety
5. Advanced explanation accuracy validation
6. A/B testing capability for explanation effectiveness

## Epic 5: Results Presentation & User Engagement

**Epic Goal:** Dramatik ve etkileşimli sonuç sunumu ile kullanıcı engagement'ını
maksimize etmek.

### Story 5.1: Dramatic Results Reveal

As a user, I want an exciting and dramatic reveal of my zodiac prediction, so
that I feel surprised and engaged with the result.

#### Acceptance Criteria

1. Zodiac sign reveal animation (constellation pattern)
2. "SEN BİR [BURÇ]'SİN!" dramatic announcement
3. Confidence percentage prominent display
4. Zodiac symbol ve visual representation
5. Sound effects ve visual transitions (optional)
6. Mobile ve desktop için optimize edilmiş

### Story 5.2: Zodiac Characteristics and Traits

As a user, I want to read detailed information about my predicted zodiac sign,
so that I can understand and relate to the characteristics.

#### Acceptance Criteria

1. Zodiac sign detailed description
2. Key personality traits bulleted list
3. Strengths ve weaknesses sections
4. Famous people with same zodiac
5. Lucky colors, numbers, stones bilgileri
6. "İşte sende gördüğüm [burç] özellikleri" personalized section

### Story 5.3: Social Sharing and Engagement Features

As a user, I want to share my results and challenge friends, so that I can
engage socially with the application.

#### Acceptance Criteria

1. "Sonuçlarımı Paylaş" button prominent
2. Social media sharing texts pre-written
3. "Arkadaşlarını da test et" call-to-action
4. Unique sharing links session-based results için
5. "Başka biri için test yap" quick restart option
6. Results screenshot capability

### Story 5.4: Alternative Suggestions and Retry Options

As a user, I want options to explore other possibilities or retake the test, so
that I can get the most accurate result.

#### Acceptance Criteria

1. "Diğer olası burçların" secondary results
2. "Sonuçlarından memnun değil misin?" retry option
3. "Sadece [kategori] sorularını tekrar yanıtla" targeted retry
4. Test history tracking session-based
5. "Arkadaşların nasıl cevap verirdi?" social angle
6. Feedback collection "Bu doğru mu?" rating

## Checklist Results Report

PM Checklist henüz çalıştırılmadı. PRD tamamlandıktan sonra execute-checklist
komutu ile pm-checklist çalıştırılacak.

## Next Steps

### UX Expert Prompt

UX Expert ajanına geçiş: Bu PRD'yi temel alarak frontend spesifikasyonu
oluşturun. Özellikle survey flow UX'i, progress tracking ve results presentation
için detaylı UI/UX spesifikasyonu hazırlayın.

### Architect Prompt

Architect ajanına geçiş: Bu PRD'yi input olarak kullanarak fullstack
architecture dokümanı oluşturun. React + Node.js + Supabase + AWS stack'i için
detaylı teknik mimari ve implementation rehberi hazırlayın.
