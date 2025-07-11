const express = require('express')
const register = require('../controllers/register')
const login = require("../controllers/login")
const forgetPassword = require("../controllers/forgetPassword")
const VerifyOtp = require('../controllers/verifyOtp')
const UpdatePassword = require('../controllers/UpdatePassword')
const router = express.Router();

router.post('/register' ,register)
router.post('/login' ,login);
router.post('/forget/password',forgetPassword)
router.post("/otp/verify" , VerifyOtp);
router.post("/password/update" , UpdatePassword)

module.exports = router;


