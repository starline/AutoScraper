
/**
 * @author Andri Huga
 * @version 1.2
 * 
 */

(function () {

    const config = {
        columns: {
            name: 1,
            price: 2,
            mileage: 3,
            state: 4,
        },
    };

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

    const cols = config.columns;
    const max = Math.max(cols.name, cols.price, cols.mileage, cols.state);
    const rowArr = new Array(max).fill('');
    rowArr[cols.name - 1] = name;
    rowArr[cols.price - 1] = price;
    rowArr[cols.mileage - 1] = mileage;
    rowArr[cols.state - 1] = state;
    const row = rowArr.join('\t');

    chrome.runtime.sendMessage({ action: 'copyData', text: row });
})();
