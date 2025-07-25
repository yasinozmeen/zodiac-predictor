# Zodiac Predictor - Project Brief

## Executive Summary

Zodiac Predictor, kullanıcılara günlük yaşam alışkanlıkları ve kişilik özelliklerine dair "sıradan" sorular sorarak burcunu "sihirli" bir şekilde tahmin eden interaktif web uygulamasıdır. Projenin asıl amacı BMad-Method framework'ünü baştan sona öğrenmek ve pratik yapmaktır. Uygulama, kullanıcının burcunu doğrudan sormak yerine, günlük rutinlerden sosyal davranışlara kadar çeşitli kategorilerde sorular sorarak algoritmik puanlama sistemiyle burç tahmini yapar.

## Problem Statement

**BMad-Method Öğrenme İhtiyacı**: Modern yazılım geliştirme süreçlerinde AI-driven development metodolojilerini öğrenmek için pratik proje deneyimi gereksinimi.

**Eğlenceli Burç Tahmini**: Mevcut burç uygulamaları genellikle doğum tarihi sorar veya genel burç özelliklerini listeler. Kullanıcıların "Vay be, gerçekten de tam bir Akrep'im!" dedirtecek etkileşimli ve kişiselleştirilmiş bir deneyim eksikliği.

## Proposed Solution

Kişilik özelliklerini dolaylı yoldan ortaya çıkaran soru-cevap sistemi ile burç tahmin algoritması. Kullanıcı sabah rutinlerinden yemek tercihlerine, sosyal davranışlardan karar verme tarzına kadar çeşitli kategorilerde 50-100 soru yanıtlar. Sistem, cevaplara göre her burç için puan hesaplar ve en yüksek puanlı burcunu %87 gibi güven oranıyla "sihirli" bir sunum ile açıklar.

## Target Users

### Primary User Segment: Burç Meraklıları ve Eğlence Arayanlar
- **Demografik**: 18-35 yaş arası, sosyal medya kullanıcıları
- **Davranışlar**: Burç içerikleriyle etkileşim, kişilik testleri yapma, sonuçları paylaşma
- **İhtiyaçlar**: Eğlenceli ve kişiselleştirilmiş deneyimler, sosyal paylaşım
- **Amaçlar**: Kendilerini tanıma, arkadaşlarla eğlenceli aktiviteler

### Secondary User Segment: Teknoloji ve Algoritma Meraklıları  
- **Demografik**: Geliştiriciler, teknoloji meraklıları
- **Davranışlar**: Algoritmaları merak etme, teknik detayları inceleme
- **İhtiyaçlar**: Sistem nasıl çalışıyor anlama, sonuçların mantığını görme

## Goals & Success Metrics

### Business Objectives
- BMad-Method framework'ünü eksiksiz öğrenmek ve pratik yapmak
- Full-stack geliştirme deneyimi kazanmak (React + Node.js + Supabase + AWS)
- Modern yazılım geliştirme süreçlerini deneyimlemek

### User Success Metrics
- Kullanıcı testi tamamlama oranı (%80+ hedef)
- Tahmin doğruluk algısı (kullanıcının "doğru" bulma oranı %70+)
- Ortalama oturum süresi (minimum 10 dakika)
- Sosyal paylaşım oranı (%30+ kullanıcı)

### Key Performance Indicators (KPIs)
- **Teknik KPI**: Tüm BMad-Method adımlarının tamamlanması
- **Kullanıcı Deneyimi KPI**: Ortalama soru yanıtlama süresi <30 saniye
- **Algoritma KPI**: Tutarlı burç tahmin sistemi (aynı cevaplar = aynı sonuç)

## MVP Scope

### Core Features (Must Have)
- **Soru-Cevap Sistemi**: 5 kategori, 50+ soru, çoktan seçmeli format
- **Puanlama Algoritması**: Cevap-burç eşleştirmesi, ağırlıklı hesaplama
- **Sonuç Sunumu**: Dramatik açıklama, güven yüzdesi, burç özellikleri
- **İlerleme Takibi**: Soru sayacı, kategori geçişleri, tamamlanma yüzdesi
- **Responsive Tasarım**: Mobil ve desktop uyumlu arayüz

### Out of Scope for MVP
- Kullanıcı kayıt sistemi (session-based yeterli)
- Sosyal medya paylaşımı
- Çoklu dil desteği
- Ayrıntılı burç uyumluluğu analizi
- Geçmiş test sonuçları saklama

### MVP Success Criteria
- Tüm 5 soru kategorisi çalışır durumda
- 12 burç için doğru tahmin algoritması
- Loading animasyonları ve kullanıcı deneyimi akışı
- AWS'e başarılı deployment

## Post-MVP Vision

### Phase 2 Features
- Kullanıcı kayıt ve profil sistemi
- Test geçmişi ve istatistikler
- Sosyal medya entegrasyonu (paylaşım butonu)
- Gelişmiş sonuç analizi (yüzdelik dilimler)

### Long-term Vision
BMad-Method öğrenimini tamamladıktan sonra, elde edilen bilgi ve deneyimle daha karmaşık projeler geliştirebilme kapasitesi kazanmak. Bu proje, AI-driven development metodolojilerinin öğrenilmesi için mükemmel bir başlangıç noktası olacak.

### Expansion Opportunities
- Diğer kişilik tipleri (Myers-Briggs, Enneagram)
- Gelişmiş makine öğrenmesi algoritmaları
- Mobil uygulama versiyonu
- API servisi olarak sunma

## Technical Considerations

### Platform Requirements
- **Target Platforms**: Web (Desktop ve Mobile)
- **Browser/OS Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance Requirements**: Sayfa yükleme <3 saniye, soru geçişi <1 saniye

### Technology Preferences
- **Frontend**: React 18.x (hooks, modern patterns)
- **Backend**: Node.js 20.x (Express.js framework)
- **Database**: Supabase (PostgreSQL tabanlı)
- **Hosting/Infrastructure**: AWS (S3 + CloudFront frontend, Lambda/EC2 backend)

### Architecture Considerations
- **Repository Structure**: Monorepo yaklaşımı (frontend + backend)
- **Service Architecture**: Full-stack monolith (MVP için yeterli)
- **Integration Requirements**: Supabase API, AWS deployment pipeline
- **Security/Compliance**: Basit session management, HTTPS zorunlu

## Constraints & Assumptions

### Constraints
- **Budget**: Ücretsiz tier'lar kullanılacak (AWS Free Tier, Supabase Free Plan)
- **Timeline**: BMad-Method öğrenme sürecine bağlı, yaklaşık 4-6 hafta
- **Resources**: Tek geliştirici, part-time çalışma
- **Technical**: Modern browser desteği, mobil-first tasarım

### Key Assumptions
- Kullanıcılar 50+ soruyu yanıtlamaya istekli olacak
- Burç-kişilik eşleştirmeleri internet araştırmasıyla doğru bulunabilir
- AWS Free Tier, geliştirme ve test için yeterli olacak
- React + Node.js kombinasyonu BMad öğrenmek için uygun

## Risks & Open Questions

### Key Risks
- **Soru Sıkıcılığı**: Çok fazla soru kullanıcıyı sıkabilir - Mitigation: Eğlenceli soru metinleri
- **Algoritma Karmaşıklığı**: Doğru puanlama sistemi zor olabilir - Mitigation: Basit başlangıç, iteratif iyileştirme
- **Deployment Zorlukları**: AWS deployment karmaşık olabilir - Mitigation: Adım adım dokümantasyon

### Open Questions
- Kaç soru optimal kullanıcı deneyimi için yeterli?
- Burç-kişilik eşleştirmeleri hangi kaynaklardan alınacak?
- Supabase'in free tier limitleri yeterli olacak mı?

### Areas Needing Further Research
- Astroloji kaynakları ve burç özellik eşleştirmeleri
- React + Supabase entegrasyon best practices
- AWS deployment stratejileri ve maliyet optimizasyonu

## Appendices

### A. Research Summary
Beyin fırtınası oturumunda belirlenen soru kategorileri:
1. Günlük Rutinler (sabah alışkanlıkları, uyku düzeni)
2. Sosyal Davranışlar (parti, arkadaşlık, çatışma yönetimi)  
3. Yemek & Tercihler (acı toleransı, sipariş tarzı)
4. Karar Verme Tarzı (alışveriş, risk alma)
5. Yaratıcılık & Hobiler (müzik, film, renk tercihleri)

### B. References
- BMad-Method framework documentation
- Supabase documentation (supabase.com)
- AWS Free Tier guidelines
- Modern React development practices

## Next Steps

### Immediate Actions
1. PM ajanına geçiş yaparak PRD oluşturma
2. UX Expert ile frontend spesifikasyonu hazırlama  
3. Architect ile technical architecture planlaması
4. Soru bankası araştırması ve burç eşleştirmelerinin derlenmesi

### PM Handoff
Bu Project Brief, Zodiac Predictor projesi için tam bağlamı sağlar. Lütfen "PRD Generation Mode"da başlayın, brief'i kapsamlı şekilde gözden geçirin ve gerekli açıklama veya iyileştirme önerilerinde bulunarak kullanıcıyla birlikte PRD'yi bölüm bölüm oluşturun.