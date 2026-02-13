const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["in progress", "completed"],
      default: "in progress",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
