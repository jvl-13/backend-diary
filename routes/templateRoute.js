const express = require('express')
const router = express()

router.use(express.json())

const templateController = require('../controllers/templateController')


router.post('/post-template', templateController.postTemplate)

module.exports = router