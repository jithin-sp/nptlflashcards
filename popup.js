// Function to display the last shown status
async function displayStatus() {
  const statusElement = document.getElementById('status');
  const { lastShownDate } = await chrome.storage.local.get('lastShownDate');
  
  if (lastShownDate) {
    const lastDate = new Date(lastShownDate);
    const today = new Date().toDateString();
    
    if (lastShownDate === today) {
      statusElement.textContent = `Reminder already shown today`;
      statusElement.style.backgroundColor = '#e2f0cb';
    } else {
      const formattedDate = lastDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      statusElement.textContent = `Last shown: ${formattedDate}`;
      statusElement.style.backgroundColor = '#e8f0fe';
    }
  } else {
    statusElement.textContent = `Reminder not shown yet`;
    statusElement.style.backgroundColor = '#fff4e5';
  }
}

// When popup is loaded
document.addEventListener('DOMContentLoaded', () => {
  displayStatus();
}); 