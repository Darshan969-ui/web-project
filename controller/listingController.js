const listing = require("../model/listingsAndReviews");
const { validationResult } = require("express-validator");

// Get listings with pagination and filtering
exports.getListings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: errors.array(),
      });
    }
    const { page = 1, perPage = 5, minimum_nights } = req.query;
  
    try {
      const pageNumber = parseInt(page, 10);
      const perPageNumber = parseInt(perPage, 10);

      const query = {};
  
      // If minimum_nights filter is provided, validate and add to the query
      if (minimum_nights) {
        const minNights = Number(minimum_nights);
        if (!isNaN(minNights)) {
          query.minimum_nights = { $gte: minNights }; // Use a MongoDB query to find listings with minimum nights greater than or equal to the provided value
        } else {
          return res.status(400).json({ message: "Invalid minimum_nights value" });
        }
      }
  
      // Calculate pagination parameters
      const skip = (pageNumber - 1) * perPageNumber;
  
      // Fetch listings based on pagination and filter
      const listings = await listing.find(query)
        .skip(skip)
        .limit(perPageNumber);
  
      // Get total count of listings matching the query (for pagination metadata)
      const totalListings = await listing.countDocuments(query);
  
      // Calculate total pages
      const totalPages = Math.ceil(totalListings / perPageNumber);
  
      // Return paginated results
      res.status(200).json({
        listings,
        pagination: {
          totalListings,
          totalPages,
          currentPage: pageNumber,
          perPage: perPageNumber,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
  };
  
exports.getListingById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const listing = await listing.findById(id);
    console.log(listing);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing); // Send the listing as JSON
  } catch (err) {
    res.status(500).json({ message: "Error fetching listing", error: err });
  }
};

exports.addListing = async (req, res) => {
    try {
      const newData = new listing(req.body);
      await newData.save();
      res.status(201).json({ message: 'Listing created successfully', listing: newData });
    } catch (error) {
      res.status(500).json({ message: 'Error creating listing', error: error.message });
    }
  };


  exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedData = await listing.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedData) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing updated successfully', listing: updatedData });
    } catch (error) {
      res.status(500).json({ message: 'Error updating listing', error: error.message });
    }
  };

  exports.getAirbnbFees = async (req, res) => {
    const { id } = req.params;
    try {
      const airbnb = await listing.findById(id, {
        price: 1,
        cleaning_fee: 1,
        security_deposit: 1,
        accommodate: 1,
        extra_people: 1,
        guest_included: 1,
        bedroom_beds: 1,
        'address.street': 1,
      });
      if (!airbnb) {
        return res.status(404).json({ message: "Airbnb listing not found" });
      }
      res.status(200).json(airbnb);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching Airbnb fees", error: err.message });
    }
  };

  exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await listing.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Airbnb listing not found" });
      }
      res.status(200).json({ message: "Airbnb listing deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting Airbnb listing", error: err.message });
    }
  };