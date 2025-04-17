// Set an alarm to check time every minute
chrome.alarms.create('checkTime', { periodInMinutes: 1 });

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTime') {
    checkTimeAndNotify();
  }
});

// Function to check if it's between 9:45 AM and 10:00 AM and show notification
async function checkTimeAndNotify() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  
  // Check if it's between 9:45 AM and 10:00 AM
  const isTimeForExam = (hour === 9 && minutes >= 45) || (hour === 10 && minutes === 0);
  
  if (isTimeForExam) {
    // Check if notification has already been shown today
    const { lastShownDate } = await chrome.storage.local.get('lastShownDate');
    const today = now.toDateString();
    
    if (lastShownDate !== today) {
      // Save that we've shown the notification today
      await chrome.storage.local.set({ lastShownDate: today });
      
      // Create notification popup
      chrome.windows.create({
        url: 'notification.html',
        type: 'popup',
        width: 400,
        height: 300
      });
    }
  }
}

// Run check when extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  checkTimeAndNotify();
});

// Also check when Chrome starts
chrome.runtime.onStartup.addListener(() => {
  checkTimeAndNotify();
}); 