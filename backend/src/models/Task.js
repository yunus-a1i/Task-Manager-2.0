import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  reminderTime: {
    type: Date
  },
  isReminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  labels: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  streak: {
    count: {
      type: Number,
      default: 0
    },
    lastCompletedDate: {
      type: Date
    }
  },
  repeatRule: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'custom'],
    default: 'none'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ user: 1, isDeleted: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ reminderTime: 1, isReminderEnabled: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;