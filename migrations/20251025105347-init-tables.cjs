'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Gruplar tablosu
    await queryInterface.createTable('group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Üyeler tablosu
    await queryInterface.createTable('members', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tcNumber: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'group',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      applicationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      duesAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      duesFrequency: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'annual'),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
      },
      charterApproval: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      kvkkApproval: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('members');
    await queryInterface.dropTable('group');
  }
};