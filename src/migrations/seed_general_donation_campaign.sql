-- Genel Bağış Kampanyası Seed Data
-- Bu kampanya sistem tarafından otomatik oluşturulur
-- Borç fazlası ödemeler ve kampanyasız bağışlar buraya kaydedilir

INSERT INTO "DonationCampaigns" (
    "name", 
    "type", 
    "targetAmount", 
    "collectedAmount", 
    "description", 
    "duration", 
    "iban", 
    "status",
    "createdAt",
    "updatedAt"
) VALUES (
    'Genel Bağış Kasası',
    'Genel Bağış',
    99999999.99,
    0,
    'Sistem kampanyası - Kampanyasız bağışlar ve borç fazlası ödemeler için genel kasa.',
    'Süresiz',
    'TR00 0000 0000 0000 0000 0000 00',
    'Aktif',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;
