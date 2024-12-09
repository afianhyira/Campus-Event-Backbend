const Event = require("../models/Event");
const Registration = require("../models/Registration");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 }) // Sort by date ascending
      .populate("createdBy", "name");
    res.json(events);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Get Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    // Delete the event
    await event.remove();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register for Event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is full
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: req.params.id,
      user: req.user._id,
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Create registration
    await Registration.create({
      event: req.params.id,
      user: req.user._id,
    });

    // Update available seats
    event.availableSeats -= 1;
    await event.save();

    res.json({ message: "Successfully registered for event" });
  } catch (error) {
    console.error("Register Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unregister from Event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find and delete registration
    const registration = await Registration.findOneAndDelete({
      event: req.params.id,
      user: req.user._id,
    });

    if (!registration) {
      return res.status(400).json({ message: "Not registered for this event" });
    }

    // Update available seats
    event.availableSeats += 1;
    await event.save();

    res.json({ message: "Successfully unregistered from event" });
  } catch (error) {
    console.error("Unregister Event Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check Registration Status
exports.checkRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      user: req.user._id,
    });

    res.json(Boolean(registration));
  } catch (error) {
    console.error("Check Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
