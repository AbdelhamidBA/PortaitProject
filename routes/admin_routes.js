const express = require('express');
const router = express.Router();
const admincontroller = require('../controllers/AdminController');

router.get('/',admincontroller.getAllUsers);
router.get('/:idUser',admincontroller.getUserByID);
router.post('/email',admincontroller.getUserByEmail);
router.post('/role',admincontroller.getUserByRole);
router.post('/add',admincontroller.AddUser);
router.get('/:idUser/del',admincontroller.DeleteUser);
router.post('/:idUser/del',admincontroller.DeleteUser);
router.get('/:idUser/upd',admincontroller.UpdateUser);
router.post('/:idUser/upd',admincontroller.UpdateUser);
module.exports = router;