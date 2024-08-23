const express = require('express')
const router = express.Router()

router.use(express.json())

const formController = require('../controllers/formController')

router.post('/create-form', formController.createForm)

module.exports = router