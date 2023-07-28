// Import pustaka UUID
const { v4: uuidv4 } = require('uuid');

// Fungsi untuk meng-generate UUID
function generateUUID() {
  // Generate UUID v4
  const uuid = uuidv4();
  return uuid;
}

// Export fungsi agar bisa digunakan pada file lain
module.exports = generateUUID;
