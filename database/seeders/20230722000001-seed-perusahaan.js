const generateUUID = require('../../uuid');

module.exports = {
    up: async (queryInterface) => {
      await queryInterface.bulkInsert('perusahaan', [
        {
          id: generateUUID(),
          nama: 'Perusahaan 1',
          alamat: 'Alamat Perusahaan 1',
          no_telp: '08123456789',
          kode: 'P001',
        },
        {
          id: generateUUID(),
          nama: 'Perusahaan 2',
          alamat: 'Alamat Perusahaan 2',
          no_telp: '087654321',
          kode: 'P002',
        },
      ]);
    },
  
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('perusahaan', null, {});
    }
  };
  