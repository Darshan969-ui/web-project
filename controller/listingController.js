const listing = require("../model/listingsAndReviews");
const { validationResult } = require("express-validator");
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Get listings with pagination and filtering
exports.getListings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = 'Invalid query parameters';
    res.render('error', { message: errorMessage });

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
    const errorMessage = err.message;
    res.render('error', { message: errorMessage });
    console.error(err);

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
    const errorMessage = err.message;
    res.render('error', { message: errorMessage });
  }
  
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

exports.renderCreateListingPage = (req, res) => {
  const isLoggedIn = res.locals.isLoggedIn;
  if(isLoggedIn){
  res.render('createlisting', {
    title: 'Create New Listing',
  });
}
else{
  res.redirect('/auth/login');
}
};

exports.addListing = async (req, res) => {
  try {
    // Retrieve form data from the request body 
    const {
      _id,
      name, 
      description, 
      house_rules, 
      property_type, 
      cancellation_policy, 
      amenities, 
      price, 
      security_deposit, 
      cleaning_fee, 
      extra_people, 
      guests_included, 
      images, 
      host,
      address,
    } = req.body;

    const listingImages = {
      picture_url: images?.picture_url || "",
    };
    console.log(req.body);
    const newListing = new listing({
      _id: uuidv4(),
      name,
      description,
      house_rules,
      property_type,
      cancellation_policy,
      amenities: amenities || [],
      price,
      security_deposit,
      cleaning_fee,
      extra_people,
      guests_included,
      images: listingImages,
      host: {
        host_id: host?.host_id || "",
        host_name: host?.host_name || "",
        host_location: host?.host_location || "",
        host_about: host?.host_about || "",
        host_picture_url: host?.host_picture_url || "",
      },
      address: {
        street: address?.street || "",
        country: address?.country || "",
        country_code: address?.country_code || "",
      },
    });
    console.log(newListing);

    await newListing.save();

    // Respond with success
    if(newListing){
    res.status(201).json({ message: 'Listing created successfully!', listing: newListing });
    }
    else{
      res.status(400).json({message:'chutiya'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
};

exports.renderUpdateListing = async(req,res)=>{
  const isLoggedIn = res.locals.isLoggedIn;
  if(isLoggedIn){
  const id = req.params.id;
  console.log(id);
  const foundListing = await listing.findById(id).lean();
  console.log(foundListing);
  if (!foundListing) {
    return res.status(404).send('Airbnb not found');
  }

  res.render('updatelisting', { listing: foundListing});
}
else{
  res.redirect('/auth/login');
}
}


exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedData = await listing.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedData) {
        const errorMessage =  'Listing not found';
        res.render('error', { message: errorMessage });
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).redirect(`/api/list/${id}`);
    } catch (error) {
      const errorMessage = err.message;
    res.render('error', { message: errorMessage });

    }
  };

  exports.getAirbnbFees = async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, numberOfGuests } = req.query; // Get user input from query params
  
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
        const errorMessage = "Airbnb listing not found";
        res.render('error', { message: errorMessage });
       
      }
  
      // Check if all required parameters (startDate, endDate, numberOfGuests) are provided
      if (!startDate || !endDate || !numberOfGuests) {
        const errorMessage = "Missing required parameters (startDate, endDate, numberOfGuests)";
        res.render('error', { message: errorMessage });
      }
  
      // Parse dates
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (isNaN(start) || isNaN(end)) {
        const errorMessage = "Invalid date format";
        res.render('error', { message: errorMessage });
      
      }
  
      // Calculate the number of nights
      const nights = (end - start) / (1000 * 3600 * 24); // Convert milliseconds to days
  
      // Calculate the cost
      const pricePerNight = airbnb.price;
      const totalPriceForNights = pricePerNight * nights;
      const cleaningFee = airbnb.cleaning_fee;
      const securityDeposit = airbnb.security_deposit;
  
      // Calculate extra people fee if applicable
      let extraPeopleFee = 0;
      if (numberOfGuests > airbnb.guests_included) {
        extraPeopleFee = (numberOfGuests - airbnb.guests_included) * airbnb.extra_people;
      }
  
      // Total cost calculation
      const totalCost = totalPriceForNights + cleaningFee + securityDeposit + extraPeopleFee;
  
      // Send the response back with the calculated fees
      res.status(200).render('checkout', {
        title: "Fee Calculation",
        totalCost: totalCost,
        nights: nights,
        startDate: startDate,
        endDate: endDate,
        numberOfGuests: numberOfGuests,
        pricePerNight: pricePerNight,
        totalPriceForNights: totalPriceForNights,
        cleaningFee: cleaningFee,
        securityDeposit: securityDeposit,
        extraPeopleFee: extraPeopleFee,
        guestFee: airbnb.guests_included * airbnb.price, // Optional: Show guest fees based on the number of guests
        street: airbnb.address.street, // Address
      });
  
    } catch (err) {
      const errorMessage = err.message;
      res.render('error', { message: errorMessage });
      console.error(err);
    }
  };


// New search route
exports.searchlist = async (req, res) => {
  const searchQuery = req.query.search || '';  // Capture search query from URL
  const page = req.query.page || 1;  // Page number for pagination
  const perPage = 5; // Number of results per page

  let filter = {};
  console.log(searchQuery);
  if (searchQuery) {
    // Build filter condition to search within 'address.street' and 'name'
    filter = {
      $or: [
        { 'address.street': { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
        { 'name': { $regex: searchQuery, $options: 'i' } }
      ]
    };
  }

  // Pagination logic
  const limit = perPage;
  const skip = (page - 1) * limit;

  // Fetch search results from the database
  try {
    const list = await listing.find(filter).skip(skip).limit(limit);
    const totalListings = await listing.countDocuments(filter);

    // Render the 'listing' view with search results and pagination
    res.render('listing', {
      list,
      query: searchQuery, // Pass search query to the view
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalListings / perPage),
        totalListings
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching listings');
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
      
      const errorMessage = err.message;
    res.render('error', { message: errorMessage });
      console.error(err);
      
    }
  };