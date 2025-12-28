/**
 * Veri Seeder
 * Uygulama başlatıldığında varsayılan verileri oluşturur.
 * Veri zaten varsa atlanır (idempotent).
 */

import db from '../models/index.js';

// ===== VARSAYILAN VERİLER =====

// Varsayılan Grup
const defaultGroup = {
    group_name: 'Aktif Üyeler',
    description: 'Derneğin aktif üyeleri',
    isActive: true,
};

// Varsayılan Üyeler
const defaultMembers = [
    {
        fullName: 'Ahmet Yılmaz',
        tcNumber: '12345678901',
        birthDate: '1985-03-15',
        phoneNumber: '05551234501',
        email: 'ahmet.yilmaz@example.com',
        address: 'Atatürk Caddesi No:25, Kadıköy, İstanbul',
        duesAmount: 100.00,
        duesFrequency: 'monthly',
        paymentStatus: 'pending',
    },
    {
        fullName: 'Fatma Demir',
        tcNumber: '12345678902',
        birthDate: '1990-07-22',
        phoneNumber: '05551234502',
        email: 'fatma.demir@example.com',
        address: 'İstiklal Caddesi No:45, Beyoğlu, İstanbul',
        duesAmount: 250.00,
        duesFrequency: 'quarterly',
        paymentStatus: 'pending',
    },
    {
        fullName: 'Mehmet Kaya',
        tcNumber: '12345678903',
        birthDate: '1978-11-08',
        phoneNumber: '05551234503',
        email: 'mehmet.kaya@example.com',
        address: 'Bağdat Caddesi No:120, Kadıköy, İstanbul',
        duesAmount: 500.00,
        duesFrequency: 'annual',
        paymentStatus: 'paid',
    },
    {
        fullName: 'Zeynep Çelik',
        tcNumber: '12345678904',
        birthDate: '1995-01-30',
        phoneNumber: '05551234504',
        email: 'zeynep.celik@example.com',
        address: 'Cumhuriyet Meydanı No:8, Beşiktaş, İstanbul',
        duesAmount: 150.00,
        duesFrequency: 'monthly',
        paymentStatus: 'pending',
    },
];

// Varsayılan Bağış Kampanyaları
const defaultCampaigns = [
    {
        name: 'Ramazan Yardım Paketi Kampanyası',
        type: 'Sosyal Destek',
        targetAmount: 50000.00,
        collectedAmount: 12500.00,
        description: 'İhtiyaç sahibi ailelere Ramazan ayında gıda yardımı ulaştırma kampanyası. Hedefimiz 500 aileye ulaşmak.',
        duration: '3 ay',
        iban: 'TR120001001234567890123456',
        status: 'Aktif',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-04-30'),
    },
    {
        name: 'Eğitim Bursu Fonu',
        type: 'Eğitim',
        targetAmount: 100000.00,
        collectedAmount: 35000.00,
        description: 'Başarılı ve ihtiyaç sahibi öğrencilere burs desteği sağlama fonu. Üniversite ve lise öğrencileri için.',
        duration: '12 ay',
        iban: 'TR120001001234567890123457',
        status: 'Aktif',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
    },
];

// Varsayılan Etkinlikler
const defaultEvents = [
    {
        eventName: 'Yeni Yıl Buluşması',
        date: '2025-01-15',
        time: '19:00:00',
        quota: 100,
        eventType: 'Fiziksel',
        location: 'Dernek Merkezi, Konferans Salonu',
        description: 'Dernek üyeleri ve aileleri için yeni yıl kutlama etkinliği. Yemekli organizasyon.',
        status: 'Planlandı',
    },
    {
        eventName: 'Online Tanışma Toplantısı',
        date: '2025-01-20',
        time: '20:00:00',
        quota: 50,
        eventType: 'Online',
        platform: 'Google Meet',
        eventLink: 'https://meet.google.com/abc-defg-hij',
        description: 'Yeni üyelerle tanışma ve dernek faaliyetlerinin tanıtımı.',
        status: 'Planlandı',
    },
    {
        eventName: 'Bahara Merhaba Pikniği',
        date: '2025-03-21',
        time: '11:00:00',
        quota: 200,
        eventType: 'Fiziksel',
        location: 'Atatürk Parkı, Açık Hava Alanı',
        description: 'Bahar ekinoksunda tüm üyeler ve aileleri için piknik organizasyonu. Aktiviteler ve oyunlar planlanmaktadır.',
        status: 'Planlandı',
    },
];

// Varsayılan Sabit Varlıklar
const defaultFixedAssets = [
    {
        registrationNo: 'DEM-001',
        name: 'Toplantı Masası (16 Kişilik)',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Mobilya ve Dekorasyon Malzemeleri',
        brandModel: 'Ofisline Executive',
        costValue: 5000.00,
        acquisitionDate: '2024-01-15',
        invoiceNo: 'FTR-2024-0125',
        supplierName: 'Ofis Mobilya A.Ş.',
        usefulLife: 10,
        depreciationRate: 10.00,
        salvageValue: 500.00,
        depreciationStartDate: '2024-02-01',
        responsiblePerson: 'Dernek Yönetimi',
        description: 'Konferans salonu için 16 kişilik toplantı masası',
        status: 'Kullanımda',
    },
    {
        registrationNo: 'DEM-002',
        name: 'Dell OptiPlex Masaüstü Bilgisayar',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Bilgisayar, Yazıcı, Sunucu',
        brandModel: 'Dell OptiPlex 7090',
        costValue: 25000.00,
        acquisitionDate: '2024-03-10',
        invoiceNo: 'FTR-2024-0342',
        supplierName: 'Teknoloji Market Ltd.',
        usefulLife: 5,
        depreciationRate: 20.00,
        salvageValue: 2500.00,
        depreciationStartDate: '2024-04-01',
        responsiblePerson: 'IT Sorumlusu',
        description: 'Yönetim ofisi için masaüstü bilgisayar',
        status: 'Kullanımda',
    },
    {
        registrationNo: 'DEM-003',
        name: 'Canon Çok Fonksiyonlu Yazıcı',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Bilgisayar, Yazıcı, Sunucu',
        brandModel: 'Canon imageRUNNER C3326i',
        costValue: 8000.00,
        acquisitionDate: '2024-02-20',
        invoiceNo: 'FTR-2024-0215',
        supplierName: 'Canon Türkiye',
        usefulLife: 5,
        depreciationRate: 20.00,
        salvageValue: 800.00,
        depreciationStartDate: '2024-03-01',
        responsiblePerson: 'IT Sorumlusu',
        description: 'Yazıcı, tarayıcı ve fotokopi özellikli çok fonksiyonlu cihaz',
        status: 'Kullanımda',
    },
    {
        registrationNo: 'DEM-004',
        name: 'Epson Projeksiyon Cihazı',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Ses ve Kamera Donanımları',
        brandModel: 'Epson EB-992F',
        costValue: 12000.00,
        acquisitionDate: '2024-05-05',
        invoiceNo: 'FTR-2024-0512',
        supplierName: 'Görsel Teknoloji A.Ş.',
        usefulLife: 7,
        depreciationRate: 14.29,
        salvageValue: 1000.00,
        depreciationStartDate: '2024-06-01',
        responsiblePerson: 'Etkinlik Sorumlusu',
        description: 'Konferans salonu için projeksiyon cihazı',
        status: 'Kullanımda',
    },
    {
        registrationNo: 'DEM-005',
        name: 'Sony Profesyonel Ses Sistemi',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Ses ve Kamera Donanımları',
        brandModel: 'Sony MHC-V73D',
        costValue: 3500.00,
        acquisitionDate: '2024-04-18',
        invoiceNo: 'FTR-2024-0425',
        supplierName: 'Müzik Market',
        usefulLife: 8,
        depreciationRate: 12.50,
        salvageValue: 350.00,
        depreciationStartDate: '2024-05-01',
        responsiblePerson: 'Etkinlik Sorumlusu',
        description: 'Etkinlikler için portatif ses sistemi',
        status: 'Kullanımda',
    },
    {
        registrationNo: 'DEM-006',
        name: 'Kitaplık Ünitesi (5 Raflı)',
        assetClass: 'Demirbaşlar (255)',
        assetSubClass: 'Kitaplıklar, Arşivleme Malzemeleri',
        brandModel: 'Kelebek Mobilya Klasik',
        costValue: 2500.00,
        acquisitionDate: '2024-01-25',
        invoiceNo: 'FTR-2024-0132',
        supplierName: 'Kelebek Mobilya',
        usefulLife: 15,
        depreciationRate: 6.67,
        salvageValue: 250.00,
        depreciationStartDate: '2024-02-01',
        responsiblePerson: 'Kütüphane Sorumlusu',
        description: 'Kütüphane bölümü için 5 raflı kitaplık ünitesi',
        status: 'Kullanımda',
    },
];

// Varsayılan Dış Bağışçılar
const defaultDonors = [
    {
        name: 'Engin Meriç',
        type: 'Kişi',
        email: 'engin.meric@example.com',
        phone: '05359876543',
    },
    {
        name: 'Aloha',
        type: 'Kurum',
        email: 'iletisim@aloha.com.tr',
        phone: '02161234567',
    },
    {
        name: 'Trakya Yazılım',
        type: 'Kurum',
        email: 'info@trakyayazilim.com',
        phone: '02821234567',
    },
];

// Varsayılan Borçlar (üye ID'leri seed sırasında atanacak)
const defaultDebts = [
    {
        memberIndex: 0, // Ahmet Yılmaz
        debtorType: 'MEMBER',
        debtType: 'Etkinlik katılım ücreti',
        amount: 250.00,
        currency: 'TL',
        dueDate: '2025-02-15',
        description: 'Yeni Yıl Buluşması etkinlik katılım ücreti',
        status: 'Pending',
    },
    {
        memberIndex: 1, // Fatma Demir
        debtorType: 'MEMBER',
        debtType: 'Bağış Sözü',
        amount: 1000.00,
        currency: 'TL',
        dueDate: '2025-03-01',
        description: 'Ramazan kampanyası bağış sözü',
        status: 'Pending',
    },
    {
        memberIndex: 2, // Mehmet Kaya
        debtorType: 'MEMBER',
        debtType: 'Kampanya Taahüdü',
        amount: 2500.00,
        currency: 'TL',
        dueDate: '2025-06-30',
        description: 'Eğitim Bursu Fonu kampanya taahhüdü',
        status: 'Pending',
    },
    {
        memberIndex: 2, // Mehmet Kaya - ikinci borç
        debtorType: 'MEMBER',
        debtType: 'Materyal alım ücreti',
        amount: 500.00,
        currency: 'TL',
        dueDate: '2025-01-31',
        description: 'Etkinlik için materyal alım payı',
        status: 'Pending',
    },
    {
        memberIndex: 3, // Zeynep Çelik
        debtorType: 'MEMBER',
        debtType: 'Etkinlik katılım ücreti',
        amount: 150.00,
        currency: 'TL',
        dueDate: '2025-02-15',
        description: 'Yeni Yıl Buluşması etkinlik katılım ücreti',
        status: 'Pending',
    },
];

// ===== ACTIVITY LOG HELPER =====
const createActivityLog = async (action, entityType, entityId, entityName, details = null) => {
    try {
        await db.ActivityLog.create({
            action,
            entityType,
            entityId,
            entityName,
            adminId: null,
            adminName: 'Sistem',
            details,
            ipAddress: '127.0.0.1',
        });
    } catch (error) {
        console.warn(`   ⚠️ Activity log oluşturulamadı: ${error.message}`);
    }
};

// ===== SEED FONKSİYONLARI =====

/**
 * Grup seed
 */
const seedGroup = async () => {
    console.log('🌱 Grup seed işlemi başlatılıyor...');
    const Group = db.Group;

    const existingGroup = await Group.findOne({ where: { group_name: defaultGroup.group_name } });
    if (existingGroup) {
        console.log(`   ⏭️  "${defaultGroup.group_name}" grubu zaten mevcut, atlanıyor...`);
        return existingGroup;
    }

    const newGroup = await Group.create(defaultGroup);
    console.log(`   ✅ "${defaultGroup.group_name}" grubu oluşturuldu`);
    await createActivityLog('CREATE', 'Group', newGroup.id, newGroup.group_name);
    return newGroup;
};

/**
 * Üye seed
 */
const seedMembers = async (groupId) => {
    console.log('🌱 Üye seed işlemi başlatılıyor...');
    const Member = db.Member;
    let createdCount = 0;
    let skippedCount = 0;
    const createdMembers = [];

    for (const memberData of defaultMembers) {
        try {
            const existingMember = await Member.findOne({ where: { tcNumber: memberData.tcNumber } });

            if (existingMember) {
                console.log(`   ⏭️  ${memberData.fullName} zaten mevcut, atlanıyor...`);
                skippedCount++;
                createdMembers.push(existingMember);
                continue;
            }

            const newMember = await Member.create({
                ...memberData,
                group_id: groupId,
            });

            console.log(`   ✅ ${memberData.fullName} oluşturuldu`);
            await createActivityLog('CREATE', 'Member', newMember.id, newMember.fullName);
            createdCount++;
            createdMembers.push(newMember);
        } catch (error) {
            console.error(`   ❌ ${memberData.fullName} oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Üye seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
    return createdMembers;
};

/**
 * Bağış Kampanyası seed
 */
const seedCampaigns = async () => {
    console.log('🌱 Kampanya seed işlemi başlatılıyor...');
    const DonationCampaign = db.DonationCampaign;
    let createdCount = 0;
    let skippedCount = 0;

    for (const campaignData of defaultCampaigns) {
        try {
            const existingCampaign = await DonationCampaign.findOne({ where: { name: campaignData.name } });

            if (existingCampaign) {
                console.log(`   ⏭️  "${campaignData.name}" zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            const newCampaign = await DonationCampaign.create(campaignData);
            console.log(`   ✅ "${campaignData.name}" oluşturuldu`);
            await createActivityLog('CREATE', 'DonationCampaign', newCampaign.id, newCampaign.name);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ "${campaignData.name}" oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Kampanya seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

/**
 * Etkinlik seed
 */
const seedEvents = async () => {
    console.log('🌱 Etkinlik seed işlemi başlatılıyor...');
    const Event = db.Event;
    let createdCount = 0;
    let skippedCount = 0;

    for (const eventData of defaultEvents) {
        try {
            const existingEvent = await Event.findOne({ where: { eventName: eventData.eventName } });

            if (existingEvent) {
                console.log(`   ⏭️  "${eventData.eventName}" zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            const newEvent = await Event.create(eventData);
            console.log(`   ✅ "${eventData.eventName}" oluşturuldu`);
            await createActivityLog('CREATE', 'Event', newEvent.id, newEvent.eventName);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ "${eventData.eventName}" oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Etkinlik seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

/**
 * Sabit Varlık seed
 */
const seedFixedAssets = async () => {
    console.log('🌱 Sabit varlık seed işlemi başlatılıyor...');
    const FixedAsset = db.FixedAsset;
    let createdCount = 0;
    let skippedCount = 0;

    for (const assetData of defaultFixedAssets) {
        try {
            const existingAsset = await FixedAsset.findOne({ where: { registrationNo: assetData.registrationNo } });

            if (existingAsset) {
                console.log(`   ⏭️  "${assetData.name}" (${assetData.registrationNo}) zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            const newAsset = await FixedAsset.create(assetData);
            console.log(`   ✅ "${assetData.name}" (${assetData.registrationNo}) oluşturuldu`);
            await createActivityLog('CREATE', 'FixedAsset', newAsset.id, newAsset.name);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ "${assetData.name}" oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Sabit varlık seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

/**
 * Borç seed
 */
const seedDebts = async (members) => {
    console.log('🌱 Borç seed işlemi başlatılıyor...');
    const Debt = db.Debt;
    let createdCount = 0;
    let skippedCount = 0;

    for (const debtData of defaultDebts) {
        try {
            const member = members[debtData.memberIndex];
            if (!member) {
                console.log(`   ⏭️  Üye bulunamadı (index: ${debtData.memberIndex}), atlanıyor...`);
                skippedCount++;
                continue;
            }

            // Aynı üye, aynı borç tipi ve aynı tutar için kontrol
            const existingDebt = await Debt.findOne({
                where: {
                    memberId: member.id,
                    debtType: debtData.debtType,
                    amount: debtData.amount,
                }
            });

            if (existingDebt) {
                console.log(`   ⏭️  ${member.fullName} için "${debtData.debtType}" borcu zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            const newDebt = await Debt.create({
                memberId: member.id,
                externalDebtorId: null,
                debtorType: debtData.debtorType,
                debtType: debtData.debtType,
                amount: debtData.amount,
                currency: debtData.currency,
                dueDate: debtData.dueDate,
                description: debtData.description,
                status: debtData.status,
                collectedAmount: 0,
            });

            console.log(`   ✅ ${member.fullName} için "${debtData.debtType}" borcu oluşturuldu`);
            await createActivityLog('CREATE', 'Debt', newDebt.id, `${member.fullName} - ${debtData.debtType}`);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ Borç oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Borç seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

/**
 * Dış Bağışçı seed
 */
const seedDonors = async () => {
    console.log('🌱 Dış bağışçı seed işlemi başlatılıyor...');
    const Donor = db.Donor;
    let createdCount = 0;
    let skippedCount = 0;

    for (const donorData of defaultDonors) {
        try {
            const existingDonor = await Donor.findOne({ where: { name: donorData.name } });

            if (existingDonor) {
                console.log(`   ⏭️  "${donorData.name}" (${donorData.type}) zaten mevcut, atlanıyor...`);
                skippedCount++;
                continue;
            }

            const newDonor = await Donor.create(donorData);
            console.log(`   ✅ "${donorData.name}" (${donorData.type}) oluşturuldu`);
            await createActivityLog('CREATE', 'Donor', newDonor.id, newDonor.name);
            createdCount++;
        } catch (error) {
            console.error(`   ❌ "${donorData.name}" oluşturulurken hata:`, error.message);
        }
    }

    console.log(`🌱 Dış bağışçı seed tamamlandı: ${createdCount} yeni, ${skippedCount} atlandı`);
};

// ===== ANA SEED FONKSİYONU =====

/**
 * Tüm verileri seed eder
 */
export const seedData = async () => {
    console.log('\n========================================');
    console.log('🌱 VERİ SEED İŞLEMİ BAŞLATILIYOR...');
    console.log('========================================\n');

    try {
        // 1. Grup oluştur (üyeler için gerekli)
        const group = await seedGroup();

        // 2. Üyeleri oluştur
        const members = await seedMembers(group.id);

        // 3. Kampanyaları oluştur
        await seedCampaigns();

        // 4. Etkinlikleri oluştur
        await seedEvents();

        // 5. Sabit varlıkları oluştur
        await seedFixedAssets();

        // 6. Borçları oluştur
        await seedDebts(members);

        // 7. Dış bağışçıları oluştur
        await seedDonors();

        console.log('\n========================================');
        console.log('🌱 VERİ SEED İŞLEMİ TAMAMLANDI!');
        console.log('========================================\n');
    } catch (error) {
        console.error('❌ Veri seed işlemi sırasında hata:', error.message);
        throw error;
    }
};

export default seedData;
