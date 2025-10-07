# Temel imaj olarak Node.js 20'yi kullan
FROM node:20-alpine

# Uygulamanın çalışacağı dizini belirle
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
# Bu, bağımlılıkların cache'lenmesini maksimize eder
COPY package*.json ./

# Tüm bağımlılıkları yükle (devDependencies dahil)
RUN npm install

# Geliştirme sürecini kolaylaştırmak için nodemon'u global olarak yükle
RUN npm install -g nodemon

# Uygulama kodunun geri kalanını kopyala
COPY . .

# Uygulamanın dinleyeceği portu belirt (sadece dokümantasyon amaçlı)
EXPOSE 3000

# Nodemon ile geliştirme komutunu çalıştır
# package.json dosyanızda 'dev' komutunun nodemon'u çalıştırdığından emin olun
CMD ["npm", "run", "start"]