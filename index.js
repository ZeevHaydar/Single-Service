
const app = require('express')();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connection = require('./db')
app.use(bodyParser.json());
const {v4:uuidv4} = require('uuid');
const barang = require('./database/models/barang');
const perusahaan = require('./database/models/perusahaan');
const { Op } = require("sequelize"); // Import Op from sequelize
const {Response} = require('./models')

const cors = require('cors');
const generateUUID = require('./uuid');

app.use(cors());

// Middleware to check admin authorization (you can implement more advanced logic for authentication)
function isAdmin(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret_key'); // Replace 'secret_key' with your secret key
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
}

//Endpoint untuk login admin
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin_password') {
        const token = jwt.sign({ role: 'admin' }, 'secret_key', { expiresIn: '1h' });
        return res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                username: 'admin',
                name: 'Admin User'
            },
        token
        }
    });
    } else {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid credentials',
            data: null
        });
    }
});

function validateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized',
            data: null
        });
    }
  
    try {
        const decoded = jwt.verify(token, 'secret_key'); // Replace 'secret_key' with your secret key
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token',
            data: null
        });
    }
}

app.get('/self',  (req, res) => {
    try{
        const {username, name} = req.body;
        return res.json({
            status: 'success',
            message: 'User information retrieved',
            data: {
                username,
                name
            }
        });
    } catch (err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }

});

app.get('/barang', async (req, res) => {
    try{
        const {q, perusahaan} = req.query;
        const whereCondition = {};

        if (q) {
          whereCondition.nama = { [Op.like]: `%${q}%` };
        }

        if (perusahaan) {
            whereCondition.perusahaan_id = perusahaan;
        }
        
        if (Object.keys(whereCondition).length === 0) {
            barangList = await barang.findAll();
        } else {
            barangList = await barang.findAll({
                where: whereCondition,
            });
        }

        const response = new Response('success', 'Barang retrieved', barangList);
        res.status(201).json(response);
    } catch (err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
    
});

app.get('/barang/:id', async (req, res) =>{
    try{
        const whereCondition = {"id":req.params.id}
        barangList = await barang.findAll({where:whereCondition})
        const response = new Response('success', 'Barang retrieved', barangList);
        res.status(201).json(response);
    } catch(err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
    
});

app.post('/barang', async (req, res) => {
    try{
        // const insertBarangQuery = `INSERT INTO barang (id, nama, harga, stok, perusahaan_id, kode) VALUES (?, ?, ?, ?, ?, ?)`;
        const uuid = uuidv4();
        const values = [uuid];
        const { nama, harga, stok, perusahaan_id, kode } = req.body;
        
        const newBarang = await barang.create({ // Use 'create' method to create and save the new record
            id: uuid,
            nama,
            harga,
            stok,
            perusahaan_id,
            kode,
        });
        // connection.query(insertBarangQuery, [values, nama, harga, stok, perusahaan_id, kode], (err, result) =>{
        //     if (err) throw err;
        //     res.status(201).json({
        //         status: "success",
        //         message: "barang added",
        //         data: {
        //             id: result.insertId,
        //             nama,
        //             harga,
        //             stok,
        //             kode,
        //             perusahaan_id
        //         }
        //     });
        // });
    } catch(err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.put('/barang/:id', async (req, res) => {
    try{
        const {nama, harga, stok, perusahaan_id, kode} = req.body;
        const updateBarangQuery = `UPDATE barang SET nama = ?, harga = ?, stok = ?, perusahaan_id = ?, kode = ? WHERE id = ?`;
        connection.query(updateBarangQuery, [nama, harga, stok, perusahaan_id, kode, req.params.id], (err, result) =>{
            if (err) throw err;
            const response = new Response("success", 'Data berhasil diupdate', result);
            res.status(201).json(response);
        })
    }catch(err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.delete('/barang/:id', async (req, res) => {
    try{
        const deleteBarangQuery = `DELETE FROM barang WHERE id = ?`;
        connection.query(deleteBarangQuery, [req.params.id], (err, result) =>{
            if (err) throw err;
            const response = new Response('success', 'barang deleted', result);
            res.status(201).json(response);
        })
    }catch(err){
        const response = new Response('error', err.message, null);
        res.json(response);
    }
});

app.get('/perusahaan', async (req, res) => {
    try{
        const {q}= req.query;
        let query = 'SELECT * FROM perusahaan';

        if (q){
            query += ` WHERE nama LIKE '%${q}%' OR kode LIKE '%${q}%'`
        }

        connection.query(query, (err, result) => {
            if (err) throw err;
            res.json({
                status: 'success',
                message: 'Perusahaan retrieved',
                data: result
            });
        });
    } catch (err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.get('/perusahaan/:id', async (req, res) => {
    try{
        const query = `SELECT * FROM perusahaan WHERE id = '${req.params.id}'`;
        connection.query(query, (err, result) => {
            if (err) throw err;
            res.json({
                status: 'success',
                message: 'Perusahaan retrieved',
                data: result
            });
        });
    } catch(err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.post('/perusahaan', async (req, res) => {
    try{
        const insertPerusahaanQuery = 'INSERT INTO perusahaan(id, nama, alamat, no_telp, kode) VALUES (?, ?, ?, ?, ?)';
        const {nama, alamat, no_telp, kode} = req.body;
        const value = generateUUID();
        connection.query(insertPerusahaanQuery, [value, nama, alamat, no_telp, kode], (err, result) => {
            if (err) throw err;
            const response = new Response('success', 'berhasil menambah perusahaan', result);
            res.status(201).json(response);
        })
    }
    catch(err){
        res.status(400).json(new Response('error', err.message, null));
    }

});

app.put('/perusahaan/:id', async (req, res) => {
    try{
        const {nama, alamat, no_telp, kode} = req.body;
        const updateQuery = `UPDATE perusahaan SET nama = ?, alamat = ?, no_telp = ?, kode = ? WHERE id = ?`;
        connection.query(updateQuery, [nama, alamat, no_telp,  kode, req.params.id], (err, result) =>{
            if (err) throw err;
            const response = new Response("success", 'Data perusahaan berhasil diupdate', result);
            res.status(201).json(response);
        })
    }catch(err){
        res.status(400).json(new Response('error', err.message, {}));
    }    
});

app.delete('/perusahaan/:id', async (req, res) => {
    try{
        const deleteQuery = `DELETE FROM perusahaan WHERE id = ?`;
        connection.query(deleteQuery, [req.params.id], (err, result) =>{
            if (err) throw err;
            const response = new Response('success', 'perusahaan deleted', result);
            res.status(201).json(response);
        })
    }catch(err){
        const response = new Response('error', err.message, {});
        res.json(response);
    }
});

const PORT = 5173;
app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
