export default function parseCopart() {
    const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
    };

    const engine = getText('span[data-uname="lotdetailEnginetype"]');
    const name = getText('h1.title') + ' - ' + engine;

    const raw = getText('span[data-uname="lotdetailOdometervalue"] > span > span');
    const mileage = raw.split('mi')[0].trim();

    const rawState = getText('span[data-uname="lotdetailTitledescriptionvalue"] > span > span');
    const state = rawState.split('-')[0].trim();

    return { name, mileage, state };
}
