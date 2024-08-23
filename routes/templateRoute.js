const express = require('express')
const router = express()

router.use(express.json())

const templateController = require('../controllers/templateController')
const auth = require('../middleware/auth')

router.post('/post-template', templateController.postTemplate)
router.get('/get-all-template', auth, templateController.getAllTemplate)
router.get('/get-template-by-id/:id', auth, templateController.getTemplateById)




module.exports = router