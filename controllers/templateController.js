const Template = require('../models/templateModel');

const postTemplate = async(req, res) => {
    const { name, color, link } = req.body;

    if (!name || !color) {
        return res.status(400).json({ message: 'Name and color are required' });
    }

    try {
        const newTemplate = new Template({
            name,
            color,
            link
        });

        const savedTemplate = await newTemplate.save();

        res.status(201).json(savedTemplate);
    } catch (err) {
        res.status(500).json({ message: 'Error creating template', error: err.message });
    }
}

const getAllTemplate = async(req, res) => {
    try {
        const templates = await Template.find().sort({ createdAt: -1 });
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving templates', error: err.message });
    }
}

const getTemplateById = async(req, res) => {
    const { id } = req.params; // Assuming the template ID is passed as a route parameter

    try {
        const template = await Template.findById(id);
        
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.status(200).json(template);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving template', error: err.message });
    }
}

module.exports = {
    postTemplate,
    getAllTemplate,
    getTemplateById
}