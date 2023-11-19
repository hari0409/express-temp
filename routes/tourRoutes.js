const {
  getAllTours,
  createTour,
  getTourByID,
  updateTour,
  deleteTour,
  top5Getter,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tours");

const tourRouter = require("express").Router();

tourRouter.route("/top-5-best").get(top5Getter, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);


tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter.route("/:id").get(getTourByID).patch(updateTour).delete(deleteTour);


module.exports = tourRouter;
