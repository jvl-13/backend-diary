const Journal = require('../models/journalModel')
const User = require('../models/userModel')

const createJournal = async (req, res) => {
    const { header, text, template_id, date } = req.body
    const user_id = req.user.user._id
    // console.log(req.user.user._id)
    if ( !header || !text || !template_id || !date) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const newJournal = new Journal({
            user_id,
            header,
            text,
            template_id,
            date
        })

        const savedJournal = await newJournal.save()

        res.status(201).json(savedJournal)
    } catch (err) {
        res.status(500).json({ message: 'Error creating journal', error: err.message })
    }
}

const getJournalByDate = async(req, res) => {
    const { template_id, day, month, year } = req.query
    const user_id = req.user.user._id

    if ( !template_id || !day || !month || !year) {
        return res.status(400).json({ message: 'User ID, template ID, day, month, and year are required' })
    }

    try {
        const startDate = new Date(year, month - 1, day)
        const endDate = new Date(year, month - 1, day)
        endDate.setDate(endDate.getDate() + 1)

        const journal = await Journal.findOne({
            user_id,
            template_id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('template_id').populate('user_id')

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' })
        }

        res.status(200).json(journal)
    } catch (err) {
        res.status(500).json({ message: 'Error fetching journal', error: err.message })
    }
}

const getJournalByMonthNYear = async (req, res) => {
    const { month, year } = req.params
    const user_id = req.user.user._id

    if (!month || !year) {
        return res.status(400).json({ message: 'User ID, month, and year are required' })
    }

    try {
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 1)

        const journals = await Journal.find({
            user_id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('template_id')

        res.status(200).json(journals)

    } catch (err) {
        res.status(500).json({ message: 'Error fetching journal by user and date', error: err.message })
    }
}

const updateJournal = async (req, res) => {
    const user_id = req.user.user._id;
    const journalId = req.params.journalId;
    const { header, text, template_id, date } = req.body;

    if (!header || !text || !template_id || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const journal = await Journal.findById(journalId);
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        if (journal.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this journal' });
        }

        journal.header = header;
        journal.text = text;
        journal.template_id = template_id;
        journal.date = date;

        const updatedJournal = await journal.save();

        res.status(200).json(updatedJournal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating journal', error: error.message });
    }
};

const deleteJournal = async (req, res) => {
    const user_id = req.user.user._id;
    const journalId = req.params.journalId;

    try {
        // Kiểm tra xem bài nhật ký có tồn tại không
        const journal = await Journal.findById(journalId);
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Kiểm tra xem người dùng có quyền xóa bài nhật ký không
        if (journal.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this journal' });
        }

        // Xóa bài nhật ký
        await Journal.findByIdAndDelete(journalId);

        res.status(200).json({ message: 'Journal deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting journal', error: error.message });
    }
};

module.exports = {
    createJournal,
    getJournalByDate,
    getJournalByMonthNYear,
    updateJournal,
    deleteJournal
}