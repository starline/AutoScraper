
/**
 * @author Andri Huga
 * @version 1.2
 * 
 */

(function () {

    const config = {
        columns: {
            name: 1,
            mileage: 4,
            state: 11,
            link: 22
        },
    };

    const url = window.location.hostname;

    const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
    };

    let name = '', link = '', mileage = '', state = '';

    if (url.includes('iaai.com')) {

        // name
        name = getText('h1.heading-2');

        // Odometer
        mileage = getOdometerValueFromList();

        // state
        state = getStateFromSellingBranch();

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

    link = window.location.href;

    const cols = config.columns;
    const max = Math.max(cols.name, cols.mileage, cols.state, cols.link);
    const rowArr = new Array(max).fill('');
    rowArr[cols.name - 1] = name;
    rowArr[cols.mileage - 1] = mileage;
    rowArr[cols.state - 1] = state;
    rowArr[cols.link - 1] = link;
    const row = rowArr.join('\t');

    chrome.runtime.sendMessage({ action: 'copyData', text: row });
})();


function getOdometerValueFromList() {
    const items = document.querySelectorAll('li.data-list__item');
    for (const item of items) {
        const label = item.querySelector('.data-list__label')?.textContent.trim();
        if (label === 'Odometer:') {
            const value = item.querySelector('.data-list__value')?.textContent.trim() || '';
            const match = value.match(/[\d,]+/); // находит 37,965
            if (match) {
                return match[0].replace(/,/g, ''); // убираем запятые: 37965
            }
        }
    }
    return '';
}


function getStateFromSellingBranch() {
    const items = document.querySelectorAll('li.data-list__item');
    for (const item of items) {
        const label = item.querySelector('.data-list__label')?.textContent.trim();
        if (label === 'Selling Branch:') {
            const value = item.querySelector('.data-list__value')?.textContent.trim();
            const match = value.match(/\(([^)]+)\)/); // ищем текст в скобках: (TX)
            return match ? match[1] : '';
        }
    }
    return '';
}