
(function () {
    const url = window.location.hostname;

    const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
    };

    let name = '', price = '', mileage = '', state = '';

    if (url.includes('iaai.com')) {

        // name
        name = getText('h1.vehicle-title') || getText('.title-info__title');

        // Odometer
        mileage = getText('.vehicle-info__odometer .value') || getText('li:has(.odometer) .value');

        // state
        state = getText('.branch-location__address') || getText('.branch-location__name');

    } else if (url.includes('copart.com')) {

        // Name
        let engine = getText('span[data-uname="lotdetailEnginetype"]');
        name = getText('h1.title') + ' - ' + engine;

        // Odometer
        let raw = getText('span[data-uname="lotdetailOdometervalue"] > span > span');
        mileage = raw.split('mi')[0].trim(); // вернёт "125,606"

        // state
        let raw_state = getText('span[data-uname="lotdetailTitledescriptionvalue"] > span > span');
        state = raw_state.split('-')[0].trim(); // вернёт "CO"
    }

    const row = [name, price, mileage, state].join('\\t');
    chrome.runtime.sendMessage({ action: 'copyData', text: row });
})();
