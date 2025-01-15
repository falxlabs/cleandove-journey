import { format, getDate, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const shouldShowRecurringTask = (
  recurringConfig: {
    frequency: string;
    interval: number;
    weekdays: string[] | null;
    monthly_pattern: string | null;
    monthly_day_of_week: string | null;
    monthly_week_of_month: string | null;
    start_date: string;
    end_date: string | null;
  },
  today = new Date()
) => {
  const todayStr = format(today, 'yyyy-MM-dd');
  
  // Check start and end dates
  if (todayStr < recurringConfig.start_date) return false;
  if (recurringConfig.end_date && todayStr > recurringConfig.end_date) return false;

  const startDate = new Date(recurringConfig.start_date);
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  switch (recurringConfig.frequency) {
    case 'daily':
      // For daily tasks, check if today matches the interval and weekdays
      if (daysSinceStart % recurringConfig.interval !== 0) return false;
      if (recurringConfig.weekdays?.length) {
        const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const todayWeekDay = weekDays[getDay(today) === 0 ? 6 : getDay(today) - 1];
        return recurringConfig.weekdays.includes(todayWeekDay);
      }
      return true;

    case 'weekly':
      // For weekly tasks, check if the week matches the interval and if today is a selected weekday
      const weeksSinceStart = Math.floor(daysSinceStart / 7);
      if (weeksSinceStart % recurringConfig.interval !== 0) return false;
      if (!recurringConfig.weekdays?.length) return false;
      
      const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const todayWeekDay = weekDays[getDay(today) === 0 ? 6 : getDay(today) - 1];
      return recurringConfig.weekdays.includes(todayWeekDay);

    case 'monthly':
      // For monthly tasks, check if the month matches the interval
      const monthsSinceStart = (today.getFullYear() - startDate.getFullYear()) * 12 + 
        (today.getMonth() - startDate.getMonth());
      if (monthsSinceStart % recurringConfig.interval !== 0) return false;

      if (recurringConfig.monthly_pattern === 'day_of_month') {
        // Check if today is the same day of the month as the start date
        return getDate(today) === getDate(startDate);
      } else if (recurringConfig.monthly_pattern === 'day_of_week' && 
                 recurringConfig.monthly_day_of_week && 
                 recurringConfig.monthly_week_of_month) {
        // Get all days in the current month
        const daysInMonth = eachDayOfInterval({
          start: startOfMonth(today),
          end: endOfMonth(today)
        });

        // Convert day names to numbers (0-6, where 0 is Sunday)
        const dayMap: { [key: string]: number } = {
          'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
          'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };
        const targetDayNum = dayMap[recurringConfig.monthly_day_of_week];

        // Get all occurrences of the target day in this month
        const targetDays = daysInMonth.filter(d => getDay(d) === targetDayNum);

        // Get the target occurrence based on week_of_month
        let targetDate;
        switch (recurringConfig.monthly_week_of_month) {
          case 'first': targetDate = targetDays[0]; break;
          case 'second': targetDate = targetDays[1]; break;
          case 'third': targetDate = targetDays[2]; break;
          case 'fourth': targetDate = targetDays[3]; break;
          case 'last': targetDate = targetDays[targetDays.length - 1]; break;
        }

        return targetDate && format(today, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
      }
      return false;

    default:
      return false;
  }
};