const Template = require('../models/templateModel');

const postTemplate = async(req, res) => {
    const { name, color } = req.body;

    if (!name || !color) {
        return res.status(400).json({ message: 'Name and color are required' });
    }

    try {
        const newTemplate = new Template({
            name,
            color
        });

        const savedTemplate = await newTemplate.save();

        res.status(201).json(savedTemplate);
    } catch (err) {
        res.status(500).json({ message: 'Error creating template', error: err.message });
    }
}

module.exports = {
    postTemplate
}