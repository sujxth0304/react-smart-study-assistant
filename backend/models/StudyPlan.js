const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
});

const StudyPlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    tasks: [TaskSchema],  // Array of tasks
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
