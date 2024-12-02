const mongoose = require("mongoose");

const airbnbListingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    listing_url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    space: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    neighborhood_overview: {
      type: String,
      default: "",
    },
    access: {
      type: String,
      default: "",
    },
    house_rules: {
      type: String,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
    },
    room_type: {
      type: String,
      required: true,
    },
    bed_type: {
      type: String,
      required: true,
    },
    minimum_nights: {
      type: Number,
      required: true,
    },
    maximum_nights: {
      type: Number,
      required: true,
    },
    cancellation_policy: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    number_of_reviews: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    security_deposit: {
      type: Number,
      default: 0,
    },
    cleaning_fee: {
      type: Number,
      default: 0,
    },
    extra_people: {
      type: Number,
      default: 0,
    },
    guests_included: {
      type: Number,
      required: true,
    },
    images: {
      thumbnail_url: {
        type: String,
        default: "",
      },
      medium_url: {
        type: String,
        default: "",
      },
      picture_url: {
        type: String,
        required: true,
      },
      xl_picture_url: {
        type: String,
        default: "",
      },
    },
    host: {
      host_id: {
        type: String,
        required: true,
      },
      host_url: {
        type: String,
        required: true,
      },
      host_name: {
        type: String,
        required: true,
      },
      host_location: {
        type: String,
        required: true,
      },
      host_about: {
        type: String,
        required: true,
      },
      host_response_time: {
        type: String,
        required: true,
      },
      host_picture_url: {
        type: String,
        required: true,
      },
      host_neighbourhood: {
        type: String,
        default: "",
      },
      host_response_rate: {
        type: Number,
        required: true,
      },
      host_has_profile_pic: {
        type: Boolean,
        required: true,
      },
      host_listings_count: {
        type: Number,
        required: true,
      },
      host_total_listings_count: {
        type: Number,
        required: true,
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      suburb: {
        type: String,
        default: "",
      },
      government_area: {
        type: String,
        required: true,
      },
      market: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      country_code: {
        type: String,
        required: true,
      },
    },
    
  },
  { collection: "listingsAndReviews" }
);

module.exports = mongoose.model("listingsAndReviews", airbnbListingSchema);
