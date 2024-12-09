 const User = require("../models/User");
 const jwt = require("jsonwebtoken");

 const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
     expiresIn: "30d",
   });
 };

 exports.register = async (req, res) => {
   try {
     const { name, email, password, preferences, isAdmin } = req.body;

     // Check if user exists
     const userExists = await User.findOne({ email });
     if (userExists) {
       return res.status(400).json({ message: "User already exists" });
     }

     // Create user
     const user = await User.create({
       name,
       email,
       password,
       preferences,
       isAdmin: isAdmin || false,
     });

     // Generate token
     const token = generateToken(user._id);

     res.status(201).json({
       token,
       user: {
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         preferences: user.preferences,
       },
     });
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };

 exports.login = async (req, res) => {
   try {
     const { email, password } = req.body;

     // Check user exists
     const user = await User.findOne({ email });
     if (!user) {
       return res.status(401).json({ message: "Invalid credentials" });
     }

     // Check password
     const isMatch = await user.comparePassword(password);
     if (!isMatch) {
       return res.status(401).json({ message: "Invalid credentials" });
     }

     // Generate token
     const token = generateToken(user._id);

     res.json({
       token,
       user: {
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         preferences: user.preferences,
       },
     });
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };

 exports.getMe = async (req, res) => {
   try {
     const user = await User.findById(req.user._id).select("-password");
     res.json(user);
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };