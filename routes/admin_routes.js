const express = require('express');
const router = express.Router();
const admincontroller = require('../controllers/AdminController');

router.get('/', admincontroller.getAllUsers);
router.get('/:idUser', admincontroller.getUserByID);
router.post('/email', admincontroller.getUserByEmail);
router.post('/role', admincontroller.getUserByRole);
router.post('/add', admincontroller.AddUser);
router.delete('/:idUser/del', admincontroller.DeleteUser);
router.put('/:idUser/upd', admincontroller.UpdateUser);
router.get('/user/statis', admincontroller.statistic);

module.exports = router;