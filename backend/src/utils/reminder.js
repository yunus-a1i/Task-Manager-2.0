import Task from '../models/Task.js';
import User from '../models/User.js';

export const checkReminders = async () => {
  try {
    const now = new Date();
    
    // Find tasks with reminders due
    const tasksWithReminders = await Task.find({
      isReminderEnabled: true,
      reminderSent: false,
      reminderTime: { $lte: now },
      status: 'pending',
      isDeleted: false
    }).populate('user', 'name email notificationPreference');

    for (const task of tasksWithReminders) {
      // Check if user has notifications enabled
      if (task.user && task.user.notificationPreference) {
        // Send reminder (console log for now, can be extended to email/push)
        console.log(`
🔔 REMINDER: Task "${task.title}" is due!
   User: ${task.user.name} (${task.user.email})
   Due Date: ${task.dueDate.toISOString()}
   Priority: ${task.priority}
        `);

        // Mark reminder as sent
        task.reminderSent = true;
        await task.save();

        // TODO: Integrate with email service (Nodemailer) or push notification service
        // await sendEmailReminder(task.user.email, task);
      }
    }

    if (tasksWithReminders.length > 0) {
      console.log(`✅ Processed ${tasksWithReminders.length} reminder(s)`);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

export const calculateReminderTime = (dueDate, minutesBefore) => {
  const reminder = new Date(dueDate);
  reminder.setMinutes(reminder.getMinutes() - minutesBefore);
  return reminder;
};