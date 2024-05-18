const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    header: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    template_id: {
        type: String,
        required: true,
        ref: 'Template'
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Journal', journalSchema);