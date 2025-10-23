// Load saved preferences
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['randomMode', 'currentMode', 'customData'], (result) => {
    const checkbox = document.getElementById('randomMode');
    checkbox.checked = result.randomMode !== false; // default to true
    
    // Load current mode
    const currentMode = result.currentMode || 'random';
    switchMode(currentMode);
    
    // Load custom data
    if (result.customData) {
      loadCustomData(result.customData);
    }
  });
});

// Mode switching
function switchMode(mode) {
  const modeBtns = document.querySelectorAll('.mode-btn');
  const randomContainer = document.getElementById('randomModeContainer');
  const customForm = document.getElementById('customForm');
  
  modeBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  
  if (mode === 'random') {
    randomContainer.style.display = 'flex';
    customForm.classList.remove('active');
  } else {
    randomContainer.style.display = 'none';
    customForm.classList.add('active');
  }
  
  chrome.storage.local.set({ currentMode: mode });
}

// Mode button click handlers
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    switchMode(mode);
  });
});

// Save preference when checkbox changes
document.getElementById('randomMode').addEventListener('change', (e) => {
  chrome.storage.local.set({ randomMode: e.target.checked });
});

// Load custom data into form
function loadCustomData(data) {
  document.getElementById('customName').value = data.name || '';
  document.getElementById('customEmail').value = data.email || '';
  document.getElementById('customPhone').value = data.phone || '';
  document.getElementById('customAddress').value = data.address || '';
  document.getElementById('customCompany').value = data.company || '';
}

// Save custom data
document.getElementById('saveCustom').addEventListener('click', () => {
  const customData = {
    name: document.getElementById('customName').value,
    email: document.getElementById('customEmail').value,
    phone: document.getElementById('customPhone').value,
    address: document.getElementById('customAddress').value,
    company: document.getElementById('customCompany').value
  };
  
  chrome.storage.local.set({ customData }, () => {
    // Show success feedback
    const saveBtn = document.getElementById('saveCustom');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Đã lưu!';
    saveBtn.style.background = '#34C759';
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.background = '#34C759';
    }, 1500);
  });
});

document.getElementById("fill").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Determine current mode
  const activeModeBtn = document.querySelector('.mode-btn.active');
  const currentMode = activeModeBtn.dataset.mode;
  
  let mode;
  if (currentMode === 'random') {
    const isRandomMode = document.getElementById('randomMode').checked;
    mode = isRandomMode ? 'random' : 'fixed';
  } else {
    mode = 'custom';
  }
  
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
