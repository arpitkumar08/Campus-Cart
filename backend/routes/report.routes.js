const express = require('express');
const { reportProduct, getAllReports, deleteReportedProduct } = require('../controllers/report.controller')
const { protect, verifyAdmin } = require('../middlewares/auth.middleware')


const router = express.Router()

router.post('/', protect, reportProduct)

router.get('/', protect, verifyAdmin, getAllReports)

router.delete('/:productId', protect, verifyAdmin, deleteReportedProduct)


module.exports = router;
