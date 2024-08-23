const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    name: { type: String, required: true},
    date: { type: Date, required: true},
    answers: {
        type: Map,
        of: Number,
        required: true
    },
    stressLevel: { type: String, required: true },
    depressionLevel: { type: String, required: true },
    anxietyLevel: { type: String, required: true }
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;