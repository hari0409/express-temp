const Tour = require("../models/toursModel");
const APIFeatures = require("../utils/apifeatures");

exports.top5Getter = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

exports.getAllTours = async (req, res, next) => {
  try {
    // Awaiting the result
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const tour = await features.query;

    res.status(200).json({
      status: "success",
      results: tour.length,
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      msg: "Cannot retreive all tours",
      error,
    });
    next(error);
  }
};

exports.createTour = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      status: "success",
      msg: "Tour Created successfully",
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      msg: "Failed to create a new tour",
      error,
    });
    next(error);
  }
};

exports.getTourByID = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (error) {
    next(error);
    res.status(404).json({
      status: "failures",
      msg: "Couldnt get data",
    });
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (error) {
    next(error);
    res.status(401).json({
      status: "failure",
      msg: "Not able to update the data",
    });
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      msg: "Deleted the object",
    });
  } catch (error) {
    next(error);
    res.status(401).json({
      status: "failure",
      msg: "Not able to delete the data",
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5,
          },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: {
            $sum: 1,
          },
          numRatings: {
            $sum: "$ratingsQuantity",
          },
          averageRating: {
            $avg: "$ratingsAverage",
          },
          averagePrice: {
            $avg: "$price",
          },
          minPrice: {
            $min: "$price",
          },
          maxPrice: {
            $max: "$price",
          },
        },
      },
      {
        $sort: {
          averagePrice: 1,
        },
      },
      {
        $match: {
          _id: {
            $ne: "easy",
          },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      msg: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numTourStarts: {
            $sum: 1,
          },
          tours: {
            $push: "$name",
          },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
