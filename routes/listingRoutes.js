const express = require('express');
const { query } = require('express-validator');
const router = express.Router();
const {
  getListings,
  getListingById,
  addListing,
  updateListing,
  getAirbnbFees,
  deleteListing
} = require('../controller/listingController'); // Import the controller functions

router.get(
    '/list',
    [
      query('page').isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      query('perPage').isInt({ min: 1 }).withMessage('perPage must be a positive integer'),
      query('minimum_nights').optional().isString().withMessage('minimum_nights must be a string'),
    ],
    getListings
  );
  
router.get('/list/:id', getListingById);
router.post('/list', addListing);
router.put('/list/:id', updateListing);
router.get("/list/fees/:id", getAirbnbFees);
router.delete('/list/:id', deleteListing);

module.exports = router;
