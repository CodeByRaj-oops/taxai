/**
 * Tax Routes
 * Handles tax calculation and tax information
 */

const express = require('express');
const router = express.Router();
const taxController = require('../controllers/tax.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public route for tax slab information
router.get('/slabs', taxController.getTaxSlabs);

// Private route for tax calculation
router.post('/calculate', authenticate, taxController.calculateTax);

module.exports = router; 