const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauces');

const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.addLike);

module.exports = router;