class User {
    constructor(username) {
      this.username = username;
    }
}

class Barang {
    constructor(id, nama, kode, harga, stok, perusahaan_id) {
        this.id = id;
        this.nama = nama;
        this.kode = kode;
        this.harga = harga;
        this.stok = stok;
        this.perusahaan_id = perusahaan_id;
    }
}

class BarangWithPerusahaan extends Barang {
    constructor(id, nama, kode, harga, stok, perusahaan_id, perusahaan) {
      super(id, nama, kode, harga, stok, perusahaan_id);
      this.perusahaan = perusahaan;
    }
}

class Perusahaan {
    constructor(id, nama, kode, alamat, no_telp) {
      this.id = id;
      this.nama = nama;
      this.kode = kode;
      this.alamat = alamat;
      this.no_telp = no_telp;
    }
  }

  class Response {
    constructor(status, message, data) {
      this.status = status;
      this.message = message;
      this.data = data;
    }
  }

module.exports = {
    User,
    Barang,
    BarangWithPerusahaan,
    Perusahaan,
    Response
}