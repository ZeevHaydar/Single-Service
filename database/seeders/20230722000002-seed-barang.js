const generateUUID = require('../../uuid');

module.exports = {
  up: async (queryInterface) => {
    const perusahaan1 = await queryInterface.rawSelect('perusahaan', {
      where: { kode: 'P001' },
    }, ['id']);

    const perusahaan2 = await queryInterface.rawSelect('perusahaan', {
      where: { kode: 'P002' },
    }, ['id']);

    await queryInterface.bulkInsert('barang', [
      {
        id: generateUUID(),
        nama: 'Produk 1',
        harga: 10000,
        stok: 50,
        kode: 'B001',
        perusahaan_id: perusahaan1,
      },
      {
        id: generateUUID(), 
        nama: 'Produk 2',
        harga: 20000,
        stok: 30,
        kode: 'B002',
        perusahaan_id: perusahaan2,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('barang', null, {});
  }
};
