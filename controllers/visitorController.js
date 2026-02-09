import Visitor from '../models/Visitor.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find({}).sort({ checkInTime: -1 });
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching visitors.' });
    }
};

const addVisitor = async (req, res) => {
    try {
        const { name, phone, purpose, whomToMeet, checkInTime, photo } = req.body;

        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required.' });
        }

        const newVisitor = new Visitor({
            name,
            phone,
            purpose: purpose || 'Meeting',
            whomToMeet,
            checkInTime: checkInTime || new Date().toISOString(),
            photo,
        });

        const savedVisitor = await newVisitor.save();
        res.status(201).json(savedVisitor);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding visitor.' });
    }
};

const updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkOutTime } = req.body;

        // Validate ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid visitor ID.' });
        }

        const visitor = await Visitor.findById(id);
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found.' });
        }

        visitor.checkOutTime = checkOutTime || new Date().toISOString();
        const updatedVisitor = await visitor.save();
        res.status(200).json(updatedVisitor);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating visitor.' });
    }
};

// Export named functions
export { getVisitors, addVisitor, updateVisitor };

// Default export for backward compatibility
export default { getVisitors, addVisitor, updateVisitor };