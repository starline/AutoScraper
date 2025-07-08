
/**
 * @author Andri Huga
 * @version 1.3
 *
 */

(async function () {

    const config = {
        columns: {
            name: 1,
            mileage: 4,
            state: 11,
            link: 22
        },
    };

    const url = window.location.hostname;

    let name = '', link = '', mileage = '', state = '';

    if (url.includes('iaai.com')) {
        const { default: parseIaai } = await import(chrome.runtime.getURL('content/parsers/iaai.js'));
        ({ name, mileage, state } = parseIaai());
    } else if (url.includes('copart.com')) {
        const { default: parseCopart } = await import(chrome.runtime.getURL('content/parsers/copart.js'));
        ({ name, mileage, state } = parseCopart());
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