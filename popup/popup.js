document.getElementById('copy').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.startsWith('chrome://')) {
    alert('❌ Расширение не работает на системных страницах Chrome.');
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content/content.js'],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'copyData') {
    navigator.clipboard.writeText(message.text).then(() => {
      alert('✅ Данные скопированы:\n' + message.text);
    });
  }
});
