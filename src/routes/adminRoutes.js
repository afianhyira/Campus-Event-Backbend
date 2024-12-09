const express = require("express");
const { protect, admin } = require("../middleware/auth");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

const router = express.Router();

// Get admin dashboard stats
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const [totalEvents, totalRegistrations, upcomingEvents] = await Promise.all(
      [
        Event.countDocuments(),
        Registration.countDocuments(),
        Event.countDocuments({ date: { $gte: new Date() } }),
      ]
    );

    res.json({
      totalEvents,
      totalRegistrations,
      upcomingEvents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get registrations for an event
router.get(
  "/events/:eventId/registrations",
  protect,
  admin,
  async (req, res) => {
    try {
      const registrations = await Registration.find({
        event: req.params.eventId,
      })
        .populate("user", "name email")
        .sort("-registeredAt");

      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
