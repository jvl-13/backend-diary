const express = require('express')
const router = express.Router()

router.use(express.json())

const journalController = require('../controllers/journalController')
const auth = require('../middleware/auth')

router.post('/create-journal', auth, journalController.createJournal)
router.get('/get-journal-by-date', auth, journalController.getJournalByDate)
router.get('/get-journal/month/:month/year/:year', auth, journalController.getJournalByMonthNYear)
router.put('/update-journal/:journalId', auth, journalController.updateJournal)
router.delete('/delete-journal/:journalId', auth, journalController.deleteJournal)

module.exports = router