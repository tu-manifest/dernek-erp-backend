-- Migration: Update Donations table to allow null memberId and add new columns
-- Run this migration manually if Sequelize sync doesn't update the constraints

-- 1. Make memberId nullable
ALTER TABLE "Donations" ALTER COLUMN "memberId" DROP NOT NULL;

-- 2. Add new columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donations' AND column_name = 'campaignId') THEN
        ALTER TABLE "Donations" ADD COLUMN "campaignId" INTEGER REFERENCES "DonationCampaigns"(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donations' AND column_name = 'senderName') THEN
        ALTER TABLE "Donations" ADD COLUMN "senderName" VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donations' AND column_name = 'transactionRef') THEN
        ALTER TABLE "Donations" ADD COLUMN "transactionRef" VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donations' AND column_name = 'source') THEN
        CREATE TYPE donation_source AS ENUM ('Manuel', 'Banka', 'Sanal Banka');
        ALTER TABLE "Donations" ADD COLUMN "source" donation_source DEFAULT 'Manuel';
    END IF;
END $$;

-- 3. Add new columns to DonationCampaigns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DonationCampaigns' AND column_name = 'collectedAmount') THEN
        ALTER TABLE "DonationCampaigns" ADD COLUMN "collectedAmount" DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DonationCampaigns' AND column_name = 'status') THEN
        CREATE TYPE campaign_status AS ENUM ('Aktif', 'Tamamlandı', 'Durduruldu');
        ALTER TABLE "DonationCampaigns" ADD COLUMN "status" campaign_status DEFAULT 'Aktif';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DonationCampaigns' AND column_name = 'startDate') THEN
        ALTER TABLE "DonationCampaigns" ADD COLUMN "startDate" TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'DonationCampaigns' AND column_name = 'endDate') THEN
        ALTER TABLE "DonationCampaigns" ADD COLUMN "endDate" TIMESTAMP;
    END IF;
END $$;
