export default function parseIaai() {
    const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
    };

    const name = getText('h1.heading-2');
    const mileage = getOdometerValueFromList();
    const state = getStateFromSellingBranch();

    return { name, mileage, state };
}

function getOdometerValueFromList() {
    const items = document.querySelectorAll('li.data-list__item');
    for (const item of items) {
        const label = item.querySelector('.data-list__label')?.textContent.trim();
        if (label === 'Odometer:') {
            const value = item.querySelector('.data-list__value')?.textContent.trim() || '';
            const match = value.match(/[\d,]+/);
            if (match) {
                return match[0].replace(/,/g, '');
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
            const match = value.match(/\(([^)]+)\)/);
            return match ? match[1] : '';
        }
    }
    return '';
}
