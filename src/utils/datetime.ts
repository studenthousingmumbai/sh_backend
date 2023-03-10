export function getDaysLeftUntilOneYearFromMongoDBTimestamp(mongoDBTimestamp: string) {
    // Convert the MongoDB timestamp to a Date object
    const date = new Date(mongoDBTimestamp);
  
    // Calculate the timestamp for one year from the MongoDB timestamp
    const oneYearFromTimestamp = new Date(date.getTime());
    oneYearFromTimestamp.setFullYear(date.getFullYear() + 1);
  
    // Get the time difference in milliseconds between one year from the MongoDB timestamp and the current date
    const timeDiffInMs = oneYearFromTimestamp.getTime() - Date.now();
  
    // Convert the time difference to days
    const daysDiff = Math.ceil(timeDiffInMs / (1000 * 60 * 60 * 24));
  
    return daysDiff;
  }

export function getMinutesDiff(timestamp1: number, timestamp2: number) {
  const diffInMs = Math.abs(timestamp1 - timestamp2);
  return Math.round(diffInMs / 60000);
}