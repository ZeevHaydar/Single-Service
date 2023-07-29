
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

        const response = new Response('success', 'Barang added', newBarang);
        res.status(201).json(response);
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
        const updateBarang = await perusahaan.update({
            nama,
            harga,
            stok,
            perusahaan_id,
            kode
        }, {
            where: {id: req.params.id}
        })

        if (updateBarang[0]=== 0){
            return res.status(404).json({
                status: 'error',
                message: 'Barang not found',
                data: {}
            });
        }
        const response = new Response("success", 'Data berhasil diupdate', result);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.delete('/barang/:id', async (req, res) => {
    try {
        const deletedBarang = await barang.destroy({ where: { id: req.params.id } });

        if (deletedBarang === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Barang not found',
                data: {}
            });
        }

        const response = new Response('success', 'Barang deleted', deletedBarang);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }   
});

app.get('/perusahaan', async (req, res) => {
     try {
        const { q } = req.query;
        const whereCondition = {};

        if (q) {
            whereCondition.nama = { [Op.like]: `%${q}%` };
        }

        const perusahaanList = await perusahaan.findAll({
            where: whereCondition,
        });

        const response = new Response('success', 'Perusahaan retrieved', perusahaanList);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.get('/perusahaan/:id', async (req, res) => {
    try {
        const whereCondition = { id: req.params.id };
        const perusahaanData = await perusahaan.findOne({ where: whereCondition });

        if (!perusahaanData) {
            return res.status(404).json({
                status: 'error',
                message: 'Perusahaan not found',
                data: {}
            });
        }

        const response = new Response('success', 'Perusahaan retrieved', perusahaanData);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.post('/perusahaan', async (req, res) => {
    try {
        const { nama, alamat, no_telp, kode } = req.body;

        const newPerusahaan = await perusahaan.create({
            id: generateUUID(),
            nama,
            alamat,
            no_telp,
            kode
        });

        const response = new Response('success', 'Perusahaan added', newPerusahaan);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }

});

app.put('/perusahaan/:id', async (req, res) => {
    try {
        const { nama, alamat, no_telp, kode } = req.body;
        const whereCondition = { id: req.params.id };
        const updatedPerusahaan = await perusahaan.update({
            nama,
            alamat,
            no_telp,
            kode
        }, {
            where: whereCondition
        });

        if (updatedPerusahaan[0] === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Perusahaan not found',
                data: {}
            });
        }

        const response = new Response('success', 'Perusahaan updated', updatedPerusahaan);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

app.delete('/perusahaan/:id', async (req, res) => {
    try {
        const whereCondition = { id: req.params.id };
        const deletedPerusahaan = await perusahaan.destroy({ where: whereCondition });

        if (deletedPerusahaan === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Perusahaan not found',
                data: {}
            });
        }

        const response = new Response('success', 'Perusahaan deleted', deletedPerusahaan);
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
            data: {}
        });
    }
});

const PORT = 5173;
app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
