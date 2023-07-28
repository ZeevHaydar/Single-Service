const { DataTypes } = require("sequelize");
const sequelize = require('../db')

// models/barang.js

const Barang = sequelize.define('barang', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        },
    harga: {
        type: DataTypes.NUMBER,
        allowNull: false,
        },
    stok: {
        type: DataTypes.NUMBER,
        allowNull: false,
        },
    kode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    perusahaan_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'perusahaan',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        },
    }, {
        tableName: 'barang',
        timestamps: false
    }
);
module.exports = Barang;



