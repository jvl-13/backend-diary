const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    template_id: {
        type: String,
        required: true,
        ref: 'Template'
    }
})

module.exports = mongoose.model('Question', questionSchema);