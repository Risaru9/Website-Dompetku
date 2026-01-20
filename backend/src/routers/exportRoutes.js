const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/excel', authMiddleware, exportController.downloadExcel);

module.exports = router;