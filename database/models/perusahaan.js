const { DataTypes } = require("sequelize");
const sequelize = require('../db')

const Perusahaan = sequelize.define('perusahaan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_telp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
},  {
    tableName: 'perusahaan',
    timestamps: false
});
module.exports = Perusahaan;

