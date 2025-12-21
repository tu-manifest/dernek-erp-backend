// src/services/fixedAsset.service.js
import db from '../models/index.js';
import { ASSET_STATUS, ASSET_CLASSES, ASSET_SUB_CLASSES } from '../models/fixedAsset.model.js';

class FixedAssetService {
    /**
     * Birikmiş amortisman hesapla
     */
    calculateDepreciation(asset) {
        const today = new Date();
        const startDate = new Date(asset.depreciationStartDate);

        // Geçen yıl sayısını hesapla (ay bazında kesirli)
        const diffTime = today - startDate;
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

        if (diffYears <= 0) {
            return {
                accumulatedDepreciation: 0,
                netBookValue: parseFloat(asset.costValue),
                yearsElapsed: 0
            };
        }

        const costValue = parseFloat(asset.costValue);
        const salvageValue = parseFloat(asset.salvageValue) || 0;
        const depreciationRate = parseFloat(asset.depreciationRate);

        // Yıllık amortisman = (Maliyet - Hurda Değeri) × (Oran / 100)
        const yearlyDepreciation = (costValue - salvageValue) * (depreciationRate / 100);

        // Birikmiş amortisman = Yıllık Amortisman × Geçen Yıl
        let accumulatedDepreciation = yearlyDepreciation * diffYears;

        // Maksimum amortisman: Maliyet - Hurda Değeri
        const maxDepreciation = costValue - salvageValue;
        if (accumulatedDepreciation > maxDepreciation) {
            accumulatedDepreciation = maxDepreciation;
        }

        const netBookValue = costValue - accumulatedDepreciation;

        return {
            accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
            netBookValue: Math.round(netBookValue * 100) / 100,
            yearsElapsed: Math.round(diffYears * 100) / 100
        };
    }

    /**
     * Otomatik durum kontrolü
     */
    checkAutoStatus(asset, depreciationInfo) {
        const costValue = parseFloat(asset.costValue);
        const salvageValue = parseFloat(asset.salvageValue) || 0;
        const maxDepreciation = costValue - salvageValue;

        // Eğer birikmiş amortisman >= maksimum amortisman ise hurdaya ayrılmış
        if (depreciationInfo.accumulatedDepreciation >= maxDepreciation && asset.status === ASSET_STATUS.KULANIMDA) {
            return ASSET_STATUS.HURDAYA_AYRILMIS;
        }
        return asset.status;
    }

    async createAsset(assetData) {
        // Alt sınıf doğrulaması
        if (assetData.assetSubClass && assetData.assetClass) {
            const validSubClasses = ASSET_SUB_CLASSES[assetData.assetClass] || [];
            if (!validSubClasses.includes(assetData.assetSubClass)) {
                const error = new Error(`Geçersiz alt sınıf. Geçerli seçenekler: ${validSubClasses.join(', ')}`);
                error.statusCode = 400;
                throw error;
            }
        }

        const asset = await db.FixedAsset.create(assetData);
        return asset;
    }

    async getAssetById(id) {
        const asset = await db.FixedAsset.findByPk(id);
        if (!asset) {
            const error = new Error('Varlık bulunamadı.');
            error.statusCode = 404;
            throw error;
        }
        return asset;
    }

    async updateAsset(id, assetData) {
        const asset = await this.getAssetById(id);

        // Alt sınıf doğrulaması
        const assetClass = assetData.assetClass || asset.assetClass;
        if (assetData.assetSubClass) {
            const validSubClasses = ASSET_SUB_CLASSES[assetClass] || [];
            if (!validSubClasses.includes(assetData.assetSubClass)) {
                const error = new Error(`Geçersiz alt sınıf. Geçerli seçenekler: ${validSubClasses.join(', ')}`);
                error.statusCode = 400;
                throw error;
            }
        }

        await asset.update(assetData);
        return asset;
    }

    async deleteAsset(id) {
        const asset = await this.getAssetById(id);
        await asset.destroy();
        return { message: 'Varlık başarıyla silindi.' };
    }

    async updateStatus(id, status) {
        const asset = await this.getAssetById(id);

        if (!Object.values(ASSET_STATUS).includes(status)) {
            const error = new Error(`Geçersiz durum. Geçerli seçenekler: ${Object.values(ASSET_STATUS).join(', ')}`);
            error.statusCode = 400;
            throw error;
        }

        await asset.update({ status });
        return asset;
    }

    async getAllAssets() {
        const assets = await db.FixedAsset.findAll({
            order: [['createdAt', 'DESC']]
        });

        let totalCost = 0;
        let totalAccumulatedDepreciation = 0;
        let totalNetBookValue = 0;

        const assetsWithDepreciation = assets.map(asset => {
            const plainAsset = asset.toJSON();
            const depreciationInfo = this.calculateDepreciation(plainAsset);
            const autoStatus = this.checkAutoStatus(plainAsset, depreciationInfo);

            // Eğer durum otomatik değişmeli ise güncelle
            if (autoStatus !== plainAsset.status) {
                asset.update({ status: autoStatus });
                plainAsset.status = autoStatus;
            }

            totalCost += parseFloat(plainAsset.costValue);
            totalAccumulatedDepreciation += depreciationInfo.accumulatedDepreciation;
            totalNetBookValue += depreciationInfo.netBookValue;

            return {
                ...plainAsset,
                costValue: parseFloat(plainAsset.costValue),
                salvageValue: parseFloat(plainAsset.salvageValue) || 0,
                depreciationRate: parseFloat(plainAsset.depreciationRate),
                accumulatedDepreciation: depreciationInfo.accumulatedDepreciation,
                netBookValue: depreciationInfo.netBookValue,
                yearsElapsed: depreciationInfo.yearsElapsed
            };
        });

        return {
            assets: assetsWithDepreciation,
            summary: {
                totalAssets: assets.length,
                totalCost: Math.round(totalCost * 100) / 100,
                totalAccumulatedDepreciation: Math.round(totalAccumulatedDepreciation * 100) / 100,
                totalNetBookValue: Math.round(totalNetBookValue * 100) / 100
            }
        };
    }

    // Sınıf ve alt sınıf listesi için yardımcı metod
    getAssetClassesAndSubClasses() {
        return {
            classes: Object.values(ASSET_CLASSES),
            subClasses: ASSET_SUB_CLASSES,
            statuses: Object.values(ASSET_STATUS)
        };
    }
}

export default new FixedAssetService();
