import express from 'express';
const router = express.Router();
import visitorController from '../controllers/visitorController.js';

// GET all visitors: /api/visitors
router.get('/', visitorController.getVisitors);

// POST a new visitor: /api/visitors
router.post('/', visitorController.addVisitor);

// PUT to update a visitor: /api/visitors/:id
router.put('/:id', visitorController.updateVisitor);

export default router;