import sequelize from '../config/database.js';
import memberModel from './member.model.js';
import groupModel from './group.model.js';
import eventModel from './event.model.js';
import donationCampaignModel from './donationCampaign.model.js';
import donationModel from './donation.model.js';
import donorModel from './donor.model.js';
import debtModel from './debt.model.js';
import collectionModel from './collection.model.js';
import externalDebtorModel from './externalDebtor.model.js';
import adminModel from './admin.model.js';
import fixedAssetModel from './fixedAsset.model.js';
import documentModel from './document.model.js';
import activityLogModel from './activityLog.model.js';

const db = {};

const models = {
  Member: memberModel,
  Group: groupModel,
  Event: eventModel,
  DonationCampaign: donationCampaignModel,
  Donation: donationModel,
  Donor: donorModel,
  Debt: debtModel,
  Collection: collectionModel,
  ExternalDebtor: externalDebtorModel,
  Admin: adminModel,
  FixedAsset: fixedAssetModel,
  Document: documentModel,
  ActivityLog: activityLogModel,
};

Object.keys(models).forEach(modelName => {
  const model = models[modelName](sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;