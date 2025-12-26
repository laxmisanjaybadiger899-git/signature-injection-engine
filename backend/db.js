const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "PASTE_YOUR_MONGODB_URI_HERE",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
