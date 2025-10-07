# ----------------------------------------------------
# AŞAMA 1: BUILDER (BAĞIMLILIKLARI YÜKLEME)
# Bu aşamada bağımlılıklar indirilir ve derleme (compile/transpile) yapılır.
# ----------------------------------------------------
FROM node:20-alpine AS builder

# Uygulama dizinini oluşturun
WORKDIR /app

# package.json ve package-lock.json (veya npm-shrinkwrap.json) kopyalayın
# Sadece bu dosyaları kopyalamak, Docker'ın bağımlılıklar değişmediği sürece cache kullanmasını sağlar.
COPY package*.json ./

# Bağımlılıkları yükle
# 'npm ci' kullanmak, package-lock.json'a göre temiz ve hızlı kurulum sağlar.
RUN npm ci --only=production

# Eğer uygulamanız TypeScript kullanıyorsa veya derleme (build) gerektiriyorsa:
# RUN npm run build

# ----------------------------------------------------
# AŞAMA 2: PRODUCTION (ÇALIŞTIRMA ORTAMI)
# Bu aşama, sadece uygulamanın çalışması için gereken minimal dosyaları içerir.
# Bu, imaj boyutunu ve potansiyel güvenlik açıklarını azaltır.
# ----------------------------------------------------
FROM node:20-alpine AS production

# Uygulama dizinini oluşturun
WORKDIR /usr/src/app

# Daha güvenli bir çalıştırma için ayrı bir kullanıcı oluşturun
# Alpine tabanlı imajlarda 'nobody' kullanıcı ID'si genellikle 65534'tür.
# Daha spesifik bir kullanıcı isterseniz kendiniz oluşturabilirsiniz.
# RUN addgroup -g 1000 nodejs && adduser -u 1000 -G nodejs -s /bin/sh -D nodejs
# USER nodejs # Eğer yukarıdaki satırları kullanırsanız burayı etkinleştirin

# Builder aşamasından bağımlılıkları kopyalayın
# Sadece üretim için gereken (node_modules) dosyalarını alır.
COPY --from=builder /app/node_modules ./node_modules

# Uygulamanın geri kalan kodunu kopyalayın
COPY . .

# Uygulamanın dinleyeceği portu tanımlayın (isteğe bağlı, sadece dokümantasyon amaçlı)
EXPOSE 3000 

# Servisi çalıştırmak için varsayılan komut
# 'start' betiğinizin package.json'da tanımlı olduğundan emin olun (örneğin: "start": "node server.js")
CMD [ "npm", "start" ]