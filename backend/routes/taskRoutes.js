const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// ====================
// CREATE TASK
// ====================
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task creation failed" });
  }
});

// ====================
// GET TASKS (FILTER + SORT)
// ====================
router.get("/", auth, async (req, res) => {
  try {
    const { status, search, sort } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let tasksQuery = Task.find(query);

    if (sort === "deadline") tasksQuery = tasksQuery.sort({ deadline: 1 });
    if (sort === "priority") tasksQuery = tasksQuery.sort({ priority: -1 });

    const tasks = await tasksQuery;
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetching tasks failed" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Task.deleteOne({ _id: task._id });
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Deleting task failed" });
  }
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deleting task failed" });
  }
});

// UPDATE TASK (edit or toggle status)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Mettre à jour seulement les champs envoyés
    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Updating task failed" });
  }
});

module.exports = router;
