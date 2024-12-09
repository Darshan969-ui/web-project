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

  const { page = 1, perPage = 6, minimum_nights } = req.query;

  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(perPage, 10);

  // Validate page and perPage
  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  if (isNaN(perPageNumber) || perPageNumber <= 0 || perPageNumber > 100) { // Maximum perPage limit
    return res.status(400).json({ message: "Invalid perPage value" });
  }

  const query = {};

  // If minimum_nights filter is provided, validate and add to the query
  if (minimum_nights) {
    const minNights = Number(minimum_nights);
    if (isNaN(minNights)) {
      return res.status(400).json({ message: "Invalid minimum_nights value" });
    }
    query.minimum_nights = { $gte: minNights }; // MongoDB query to filter by minimum_nights
  }

  // Define the default sorting order
  const sortOption = { 
    availability_30: 1,  // First by availability_30
    availability_60: 1,  // Then by availability_60
    availability_90: 1,  // Then by availability_90
    availability_365: 1, // Finally by availability_365
  };

  // Custom sorting logic: prioritize based on availability order and push zero values to the end
  const customSort = (listing) => {
    // Check availability and prioritize fields
    let availability = listing.availability_30 > 0 ? 30 :
                       listing.availability_60 > 0 ? 60 :
                       listing.availability_90 > 0 ? 90 :
                       listing.availability_365 > 0 ? 365 : null;

    // If all availability values are zero, push it to the end
    if (availability === null) {
      availability = Infinity; // Move to the end
    }

    // Return listing with its priority (priority value is based on availability)
    return {
      ...listing,
      availabilityPriority: availability
    };
  };

  // Calculate pagination parameters
  const skip = (pageNumber - 1) * perPageNumber;

  try {
    // Fetch listings based on pagination, filter, and sorting
    const listings = await listing.find(query).lean()
      .skip(skip)
      .limit(perPageNumber)
      .sort(sortOption);  // Apply default sorting by availability fields

    // Apply custom sorting to prioritize availability fields
    const sortedListings = listings.map(customSort);

    // Sort listings by availability priority (move listings with all zero availability fields to the end)
    const finalListings = sortedListings.sort((a, b) => a.availabilityPriority - b.availabilityPriority);

    // Get total count of listings matching the query
    const totalListings = await listing.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalListings / perPageNumber);

    const pagination = {
      totalListings,
      totalPages,
      currentPage: pageNumber,
      perPage: perPageNumber,
    };

    // Render listings page with pagination and listings data
    res.render('listings', {
      listings: finalListings,
      pagination,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};



exports.getListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundListing = await listing.findById(id).lean(); // Assuming 'Listing' is your Mongoose model
    if (!foundListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.render('details.hbs', {
      listing: foundListing,
      title: foundListing.title || 'Listing Details', // Optional: Pass a title for the page
    });
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