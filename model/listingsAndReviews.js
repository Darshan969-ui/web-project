const mongoose = require("mongoose");

const airbnbListingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,  
      required: true,
    },

    listing_url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    space: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
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
      default: "",
    },
    property_type: {
      type: String,
      default: "",
    },
    room_type: {
      type: String,
      default: "",
    },
    bed_type: {
      type: String,
      default: "",
    },
    minimum_nights: {
      type: Number,
      default: 1,
    },
    maximum_nights: {
      type: Number,
      default: 365,
    },
    cancellation_policy: {
      type: String,
      default: "",
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    beds: {
      type: Number,
      default: 1,
    },
    number_of_reviews: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      default: 0,
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
      default: 1,
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
        default: "",
      },
      xl_picture_url: {
        type: String,
        default: "",
      },
    },
    host: {
      host_id: {
        type: String,
        default: "",
      },
      host_url: {
        type: String,
        default: "",
      },
      host_name: {
        type: String,
        default: "",
      },
      host_location: {
        type: String,
        default: "",
      },
      host_about: {
        type: String,
        default: "",
      },
      host_response_time: {
        type: String,
        default: "",
      },
      host_picture_url: {
        type: String,
        default: "",
      },
      host_neighbourhood: {
        type: String,
        default: "",
      },
      host_response_rate: {
        type: Number,
        default: 0,
      },
      host_has_profile_pic: {
        type: Boolean,
        default: false,
      },
      host_listings_count: {
        type: Number,
        default: 0,
      },
      host_total_listings_count: {
        type: Number,
        default: 0,
      },
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      suburb: {
        type: String,
        default: "",
      },
      government_area: {
        type: String,
        default: "",
      },
      market: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      country_code: {
        type: String,
        default: "",
      },
    },
  },
  { collection: "listingsAndReviews" }
);

module.exports = mongoose.model("listingsAndReviews", airbnbListingSchema);