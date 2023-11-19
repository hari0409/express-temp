const mongoose = require("mongoose");
const slugify = require("slugify");

const toureSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    ratingsAverage: {
      type: mongoose.Schema.Types.Number,
      default: 0.0,
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: [true, "A tour must have a price"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "Must have a rating"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Must have a summary"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Must have a desc"],
    },
    imageCover: {
      type: String,
      required: [true, "Must have a cover image"],
    },
    images: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    slug: {
      type: String,
    },
    secretTour: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    startDates: [Date],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual Data
toureSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document Middleware
toureSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
toureSchema.pre("/^find/", function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation Middleware


const Tour = mongoose.model("Tour", toureSchema);

module.exports = Tour;
