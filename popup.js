// Load saved preference
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['randomMode'], (result) => {
    const checkbox = document.getElementById('randomMode');
    checkbox.checked = result.randomMode !== false; // default to true
  });
});

// Save preference when checkbox changes
document.getElementById('randomMode').addEventListener('change', (e) => {
  chrome.storage.local.set({ randomMode: e.target.checked });
});

document.getElementById("fill").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isRandomMode = document.getElementById('randomMode').checked;
  const mode = isRandomMode ? 'random' : 'fixed';
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  }).then(() => {
    // Execute the function with the selected mode
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (mode) => {
        if (window.autoFillForm) {
          window.autoFillForm(mode);
        }
      },
      args: [mode]
    });
  });
});
