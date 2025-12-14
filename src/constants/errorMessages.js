/**
 * Merkezi Hata Mesajları Yönetimi
 * Tüm hata mesajları bu dosyadan yönetilir
 */

export const ERROR_MESSAGES = {
  // Genel Hatalar
  GENERAL: {
    INTERNAL_SERVER: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    INVALID_REQUEST: 'Geçersiz istek.',
    UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır.',
    NOT_FOUND: 'İstenen kaynak bulunamadı.',
    VALIDATION_ERROR: 'Doğrulama hatası oluştu.',
  },

  // Kimlik Doğrulama Hataları
  AUTH: {
    INVALID_CREDENTIALS: 'E-posta veya şifre hatalı.',
    EMAIL_EXISTS: 'Bu e-posta adresi zaten kayıtlı.',
    TOKEN_REQUIRED: 'Erişim tokeni gereklidir.',
    TOKEN_INVALID: 'Geçersiz veya süresi dolmuş token.',
    UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır.',
    ACCOUNT_INACTIVE: 'Hesabınız aktif değil.',
  },

  // Üye Hataları
  MEMBER: {
    NOT_FOUND: 'Üye bulunamadı.',
    ALREADY_EXISTS: 'Bu TC Kimlik No veya e-posta adresi ile kayıtlı üye zaten mevcut.',
    TC_REQUIRED: 'TC Kimlik No zorunludur.',
    EMAIL_REQUIRED: 'E-posta adresi zorunludur.',
    INVALID_EMAIL: 'Geçersiz e-posta adresi formatı.',
    INVALID_TC: 'Geçersiz TC Kimlik No. 11 haneli olmalıdır.',
    PHONE_REQUIRED: 'Telefon numarası zorunludur.',
    GROUP_REQUIRED: 'Grup seçimi zorunludur.',
    BIRTH_DATE_REQUIRED: 'Doğum tarihi zorunludur.',
    ADDRESS_REQUIRED: 'Adres bilgisi zorunludur.',
    DUES_AMOUNT_REQUIRED: 'Aidat miktarı zorunludur.',
    DUES_FREQUENCY_REQUIRED: 'Aidat periyodu zorunludur.',
    DELETE_FAILED: 'Üye silinirken bir hata oluştu.',
  },

  // Grup Hataları
  GROUP: {
    NOT_FOUND: 'Grup bulunamadı.',
    ALREADY_EXISTS: 'Bu isimde bir grup zaten mevcut.',
    NAME_REQUIRED: 'Grup adı zorunludur.',
    HAS_MEMBERS: 'Bu grupta kayıtlı üyeler bulunduğu için silinemez.',
    DELETE_FAILED: 'Grup silinirken bir hata oluştu.',
  },

  // Finans Hataları
  FINANCE: {
    DEBT_NOT_FOUND: 'Borç kaydı bulunamadı.',
    DEBTOR_REQUIRED: 'Borçlu seçimi (Üye veya Dış Borçlu) zorunludur.',
    BOTH_DEBTOR_NOT_ALLOWED: 'Borç hem üyeye hem dış borçluya ait olamaz.',
    DEBT_TYPE_REQUIRED: 'Borç tipi zorunludur.',
    AMOUNT_REQUIRED: 'Tutar zorunludur.',
    CURRENCY_REQUIRED: 'Para birimi zorunludur.',
    INVALID_AMOUNT: 'Geçersiz tutar. Pozitif bir sayı olmalıdır.',
    PAYMENT_EXCEEDS_DEBT: 'Ödeme tutarı ({amountPaid}) kalan borç tutarını ({outstanding}) aşıyor.',
    COLLECTION_REQUIRED_FIELDS: 'Tahsilat için gerekli alanlar eksik: debtId, amountPaid, paymentMethod, collectionDate.',
    RECEIPT_REQUIRED: 'Banka veya Kredi Kartı ödemeleri için dekont numarası zorunludur.',
    SEARCH_MIN_LENGTH: 'Arama terimi en az 3 karakter olmalıdır.',
  },

  // Etkinlik Hataları
  EVENT: {
    NOT_FOUND: 'Etkinlik bulunamadı.',
    NAME_REQUIRED: 'Etkinlik adı zorunludur.',
    DATE_REQUIRED: 'Etkinlik tarihi zorunludur.',
    TYPE_REQUIRED: 'Etkinlik tipi zorunludur.',
    QUOTA_REQUIRED: 'Kontenjan bilgisi zorunludur.',
    INVALID_QUOTA: 'Kontenjan pozitif bir sayı olmalıdır.',
  },

  // Bağış Hataları
  DONATION: {
    NOT_FOUND: 'Bağış kaydı bulunamadı.',
    CAMPAIGN_NOT_FOUND: 'Bağış kampanyası bulunamadı.',
    AMOUNT_REQUIRED: 'Bağış tutarı zorunludur.',
    DATE_REQUIRED: 'Bağış tarihi zorunludur.',
    DONOR_REQUIRED: 'Bağışçı bilgisi zorunludur.',
    CAMPAIGN_NAME_REQUIRED: 'Kampanya adı zorunludur.',
    CAMPAIGN_TYPE_REQUIRED: 'Kampanya tipi zorunludur.',
    TARGET_AMOUNT_REQUIRED: 'Hedef tutar zorunludur.',
  },

  // Bağışçı Hataları
  DONOR: {
    NOT_FOUND: 'Bağışçı bulunamadı.',
    NAME_REQUIRED: 'Bağışçı adı zorunludur.',
    TYPE_REQUIRED: 'Bağışçı tipi zorunludur.',
    CONTACT_REQUIRED: 'İletişim bilgisi zorunludur.',
  },

  // WhatsApp Hataları
  WHATSAPP: {
    NOT_READY: 'WhatsApp İstemcisi Hazır Değil veya Oturum Açılmamış.',
    QR_REQUIRED: 'Lütfen önce QR kodu tarayarak WhatsApp bağlantısını kurun.',
    RECIPIENTS_REQUIRED: 'Alıcı listesi boş olamaz.',
    MESSAGE_REQUIRED: 'Mesaj içeriği boş olamaz.',
    SEND_FAILED: 'Mesaj gönderilirken hata oluştu. Hedef: {target}',
    GROUPS_FETCH_FAILED: 'WhatsApp grupları alınırken hata oluştu.',
  },

  // Veritabanı Hataları
  DATABASE: {
    CONNECTION_FAILED: 'Veritabanı bağlantısı başarısız oldu.',
    QUERY_FAILED: 'Veritabanı sorgusu başarısız oldu.',
    DUPLICATE_ENTRY: 'Bu kayıt zaten mevcut.',
    FOREIGN_KEY_CONSTRAINT: 'İlişkili kayıtlar bulunduğu için bu işlem gerçekleştirilemez.',
  },
};

/**
 * Hata mesajlarında dinamik değişkenleri değiştirmek için yardımcı fonksiyon
 * @param {string} message - Hata mesajı şablonu
 * @param {object} variables - Değişken değerleri
 * @returns {string} - Oluşturulmuş hata mesajı
 */
export const formatErrorMessage = (message, variables = {}) => {
  let formattedMessage = message;

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    formattedMessage = formattedMessage.replace(regex, variables[key]);
  });

  return formattedMessage;
};

/**
 * HTTP Status kodları
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export default ERROR_MESSAGES;
