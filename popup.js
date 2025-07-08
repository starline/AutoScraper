document.getElementById('copy').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractAndCopyData
  });
});

function extractAndCopyData() {
  const url = window.location.hostname;

  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  };

  let name = '', price = '', mileage = '', state = '';

  if (url.includes('iaai.com')) {
    name = getText('h1.vehicle-title') || getText('.title-info__title');
    price = getText('.final-bid span.amount') || getText('.vehicle-pricing__price');
    mileage = getText('.vehicle-info__odometer .value') || getText('li:has(.odometer) .value');
    state = getText('.branch-location__address') || getText('.branch-location__name');
  } else if (url.includes('copart.com')) {
    name = getText('.lot-title h1') || getText('h1 span');
    price = getText('.lot-details-right span.lot-details-item-value[data-uname="lotdetailCurrentBid"]');
    mileage = getText('span[data-uname="lotdetailOdometer"]');
    state = getText('span[data-uname="lotdetailLocation"]');
  } else {
    alert('Сайт не поддерживается!');
    return;
  }

  const row = [name, price, mileage, state].join('\t');
  navigator.clipboard.writeText(row).then(() => {
    alert('✅ Данные скопированы:\n' + row);
  });
}
