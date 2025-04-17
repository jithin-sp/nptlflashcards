# Exam Time Reminder Extension

A Chrome extension that displays a motivational popup between 9:45 AM and 10:00 AM on exam day.

## Features

- Shows a reminder popup between 9:45 AM and 10:00 AM
- Automatically shows the popup when Chrome is opened during exam time
- Attractive popup with thumbs up and golden star animations
- "I Got It" button to close the popup
- Only shows once per day (saved to local storage)
- Confetti animation effect

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## How It Works

- The extension runs a background script that checks the time every minute
- When the time is between 9:45 AM and 10:00 AM, it checks if the popup has already been shown today
- The popup also appears when Chrome is started during the exam time window
- If the popup hasn't been shown today, it displays an attractive popup with a motivational message
- The notification only appears once per day, even if you keep Chrome open or restart it multiple times

## Files

- `manifest.json` - Configuration for the Chrome extension
- `background.js` - Background script that checks the time and triggers the popup
- `notification.html` - The attractive popup that appears at exam time
- `popup.html` & `popup.js` - The popup that appears when clicking the extension icon

## Icons

The extension requires icon files in the `icons` folder:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

You can create these icons yourself or use placeholder icons for testing.
