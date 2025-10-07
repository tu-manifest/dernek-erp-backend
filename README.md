# Dernek ERP Backend

Dernek yönetim sistemi için geliştirilmiş RESTful API servisleri. Node.js, Express.js ve PostgreSQL teknolojileri kullanılarak geliştirilmiştir.

## 📋 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Teknolojiler](#teknolojiler)
- [Proje Yapısı](#proje-yapısı)
- [Kullanım](#kullanım)
- [Docker](#docker)
- [Geliştirme](#geliştirme)
- [CI/CD](#cicd)

## 🎯 Proje Hakkında

Bu proje, dernek yönetim süreçlerini dijitalleştirmek amacıyla geliştirilmiş bir ERP (Enterprise Resource Planning) sisteminin backend kısmıdır. Üye yönetimi, aidat takibi ve grup yönetimi gibi temel işlevleri sağlar.

### Temel Özellikler

- ✅ Üye kayıt ve yönetimi
- ✅ Grup yönetimi
- ✅ RESTful API yapısı
- ✅ Docker desteği
- ✅ CI/CD pipeline entegrasyonu

## 🛠 Teknolojiler

### Backend
- **Node.js** (v20+) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **Sequelize** (v6.37.7) - ORM (Object-Relational Mapping)
- **PostgreSQL** - Veritabanı

### Güvenlik & Middleware
- **Helmet** - HTTP güvenlik başlıkları
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables yönetimi

### Geliştirme Araçları
- **Nodemon** - Development server
- **ESLint** - Code linting
- **Docker & Docker Compose** - Containerization

## 📁 Proje Yapısı

```
dernek-erp-backend/
│
├── .github/workflows/          # GitHub Actions CI/CD
│   └── main.yml
│
├── src/                        # Ana kaynak kodları
│   ├── config/                 # Konfigürasyon dosyaları
│   │   └── database.js         # Veritabanı bağlantısı (Sequelize)
│   │
│   ├── controllers/            # İstek kontrolcüleri
│   │   ├── member.controller.js
│   │   └── group.controller.js
│   │
│   ├── models/                 # Sequelize modelleri
│   │   ├── member.model.js
│   │   └── group.model.js
│   │
│   ├── services/               # İş mantığı servisleri
│   │   ├── member.service.js
│   │   └── group.service.js
│   │
│   ├── repositories/           # Veri erişim katmanı
│   │   ├── member.repository.js
│   │   └── group.repository.js
│   │
│   ├── routes/                 # API route tanımları
│   │   ├── index.js
│   │   ├── member.routes.js
│   │   └── group.routes.js
│   │
│   ├── middlewares/            # Özel middleware'ler
│   │   └── errormiddleware.js
│   │
│   └── utils/                  # Yardımcı fonksiyonlar
│
├── app.js                      # Express app konfigürasyonu
├── server.js                   # Server başlatma dosyası
├── package.json                # NPM bağımlılıkları ve scriptler
├── dockerfile                  # Docker imaj tanımı
├── docker-compose.yaml         # Multi-container Docker setup
└── .env.example               # Environment variables şablonu
```

## 🚀 Kurulum

### Ön Gereksinimler

- **Node.js** (v20 veya üzeri)
- **Docker & Docker Compose** (önerilen)
- **PostgreSQL** (Docker kullanmıyorsanız)
- **Git**

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/username/dernek-erp-backend.git
cd dernek-erp-backend
```


### 2. Docker ile Kurulum 


```bash
# Tüm servisleri başlat (API + PostgreSQL)
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```



## 🐳 Docker

### Docker Compose Servisleri

1. **PostgreSQL Database** (`db`)
   - Port: 5432
   - Database: `dernek_erp_db`
   - User: `dernekuser`

2. **Node.js API** (`api`)
   - Port: 8000
   - Hot reload desteği
   - Otomatik restart

### Docker Komutları

```bash
# Servisleri başlat
docker-compose up -d

# Geliştirme modu (watch mode)
docker-compose watch

# Logları izle
docker-compose logs -f api

# Container'a bağlan
docker-compose exec api sh

# Servisleri temizle
docker-compose down -v
```

## 🔧 Geliştirme

### Proje Mimarisi

Proje **Layered Architecture** prensibiyle yapılandırılmıştır:

1. **Routes** → API endpoint'lerini tanımlar
2. **Controllers** → HTTP isteklerini yönetir
3. **Services** → İş mantığını işler
4. **Repositories** → Veri erişim operasyonları
5. **Models** → Veritabanı şeması (Sequelize)

### Yeni Özellik Ekleme

1. **Model** oluştur (`src/models/`)
2. **Repository** ekle (`src/repositories/`)
3. **Service** yazı (`src/services/`)
4. **Controller** tanımla (`src/controllers/`)
5. **Routes** güncelle (`src/routes/`)

### Kod Standartları

- ES6+ modules kullanın (`import/export`)
- ESLint kurallarına uyun
- Async/await tercih edin
- Error handling implementasyonu yapın
- Sequelize validasyonları kullanın

## 🔄 CI/CD

GitHub Actions kullanılarak otomatik CI/CD pipeline'ı kurulmuştur.

### Pipeline Aşamaları

1. **Code Quality**
   - ESLint kontrolü
   - Format kontrolü

2. **Security Scan**
   - npm audit
   - Dependency vulnerability check

3. **Docker Build & Push**
   - Docker imaj oluşturma
   - GitHub Container Registry'ye push

### Trigger Koşulları

- `main` ve `develop` dallarına push
- Pull request oluşturma
- Haftalık otomatik security scan


### Commit Message Formatı

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Tip örnekleri:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod iyileştirmesi

**Not**: Bu proje aktif geliştirme aşamasındadır. Eksik özellikler ve geliştirilmesi gereken alanlar bulunmaktadır.