# Aşama 1: Temel İmaj (Node.js & Gerekli Alpine Bağımlılıkları)
# Bu aşamada sadece bağımlılıklar kurulur, böylece her kod değiştiğinde
# yeniden build edilmek zorunda kalmayız (Cache kullanımı).
FROM node:20-alpine AS base

# Puppeteer/whatsapp-web.js için gerekli sistem paketleri ve Chromium
# 'apk add' komutları tek bir satırda birleştirilerek imaj boyutu azaltılır.
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    # Gerekli kütüphaneler (Bazı Alpine versiyonları için)
    fontconfig \
    libstdc++ \
    gcompat

# Puppeteer'a sistemdeki Chromium'u kullanmasını söyleyen ortam değişkenleri
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

# package.json'ı kopyalayıp bağımlılıkları kur (Cache Katmanı)
COPY package*.json ./

# Bağımlılıkları kur. 'npm ci' kullanmak 'npm install'dan daha hızlı ve kararlıdır.
RUN npm ci --only=production
# Puppeteer'ı DevDependencies'ten production'a çekiyorsak burası yeterlidir.

# =========================================================================
# Aşama 2: Üretim (Production) İmajı
# Daha küçük ve daha güvenli bir base imaj kullanıyoruz.
FROM base AS final

# Çalışma dizinini tekrar tanımla
WORKDIR /usr/src/app

# Bağımlılıkları ve uygulama kodunu kopyala
# node_modules'ü 1. aşamadan kopyalıyoruz
COPY --from=base /usr/src/app/node_modules ./node_modules
# Tüm uygulama kodunu kopyala
COPY . .

# Güvenlik: Uygulamayı root kullanıcısı yerine güvenli bir kullanıcı ile çalıştır (Önerilir)
# Alpine'da varsayılan olarak 'node' kullanıcısı mevcuttur.
RUN chown -R node:node /usr/src/app
USER node

# Port'u AWS ECS standardına göre 8080 olarak ayarla (ECS bunu bekler)
EXPOSE 8080 

# Uygulamayı başlat
# Nodemon kaldırıldığı için basit 'node' komutunu kullanıyoruz.
CMD ["npm", "start"]
