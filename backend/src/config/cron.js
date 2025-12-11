import cron from 'node-cron';
import Task from '../models/Task.js';
import { checkReminders } from '../utils/reminder.js';

// Run every minute to check reminders
export const startReminderCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await checkReminders();
    } catch (error) {
      console.error('Reminder cron error:', error);
    }
  });
  console.log('⏰ Reminder cron job started');
};

// Run daily at midnight to clean up trash (30 days old)
export const startTrashCleanupCron = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Task.deleteMany({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo }
      });

      console.log(`🗑️ Deleted ${result.deletedCount} tasks from trash (30+ days old)`);
    } catch (error) {
      console.error('Trash cleanup cron error:', error);
    }
  });
  console.log('🗑️ Trash cleanup cron job started');
};