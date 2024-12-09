const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  checkRegistration,
  unregisterFromEvent,
} = require("../controllers/eventController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.route("/").get(getEvents).post(protect, admin, createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

// Registration routes
router
  .route("/:id/register")
  .post(protect, registerForEvent)
  .delete(protect, unregisterFromEvent);

// Check registration status
router.get("/:id/check-registration", protect, checkRegistration);

module.exports = router;
