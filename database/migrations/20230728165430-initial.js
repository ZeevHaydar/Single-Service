'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('perusahaan', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alamat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      no_telp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    await queryInterface.createTable('barang', {
      id: {
          type: Sequelize.STRING,
          primaryKey: true,
      },
      nama: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      harga: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      stok: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      kode: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      perusahaan_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
              model: 'perusahaan',
              key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.dropTable('barang');
      await queryInterface.dropTable('perusahaan');
  }
};
