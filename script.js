/**
 * This function will load templates to your html
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("w3-include-html"); // z. B. "templates/header.html"
        try {
            let resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
            } else {
                element.innerHTML = 'Page not found';
                console.error(`Template not found: ${file}`);
            }
        } catch (error) {
            element.innerHTML = 'Error loading template';
            console.error(`Error fetching template: ${file}`, error);
        }
    }

    setNavBarLinks(); 
}

/**
 * Shows an element by removing the "dnone" class.
 * 
 * @param {string} elementID - The ID of the element to show.
 */
function showElement(elementID) {
    document.getElementById(elementID).classList.remove("dnone");
}

/**
 * Hides an element by adding the "dnone" class.
 * 
 * @param {string} elementID - The ID of the element to hide.
 */
function hideElement(elementID) {
    document.getElementById(elementID).classList.add("dnone");
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Retrieves the value of the "user" URL parameter from the current page URL.
 * 
 * @returns {string|null} The value of the "user" URL parameter, or null if it is not found.
 */
function getCurrentUserVariable() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('user');
    return user;
}

/**
 * Saves the value of the "user" URL parameter from the current page URL.
 * 
 * @returns {string|null} The value of the "user" URL parameter, or null if it is not found.
 */
function userFromURL() {
    return getCurrentUserVariable() || 'guest';
}

function navigateToPage(page) {
    const user = userFromURL();
    window.location.href = `${page}.html?user=${user}`;
}

/**
 * Adds the "user" URL parameter with the specified ID to the according href.
 * 
 * @param {string} id - The ID to append as the "user" URL parameter.
 */
function addUrlVariable(id) {
    let currentUrl = window.location.href;
    console.log(currentUrl);
    let newUrl = currentUrl + '?user=' + userFromURL();
    return newUrl;
}

/**
 * Sets the navigation bar links based on the window size.
 * 
 * @function
 * @name setNavBarLinks
 * @returns {void}
 */
function setNavBarLinks() {
    try {
        const desktopLinks = {
            summary: "summaryHTML",
            board: "boardHTML",
            addTask: "addTaskHTML",
            contacts: "contactsHTML",
            legalNotice: "legalNoticeHTML",
            help: "helpHTML"
        };

        const mobileLinks = {
            summary: "summaryHTML_mobile",
            board: "boardHTML_mobile",
            addTask: "addTaskHTML_mobile",
            contacts: "contactsHTML_mobile"
        };

        const pageFiles = {
            summary: "summary.html",
            board: "board.html",
            addTask: "add_task.html",
            contacts: "contacts.html",
            legalNotice: "legal_notice.html",
            help: "help.html"
        };

        const links = window.innerWidth > 999 ? desktopLinks : mobileLinks;

        Object.keys(links).forEach((key) => {
            const linkElement = document.getElementById(links[key]);
            if (linkElement) {
                linkElement.href = `${pageFiles[key]}?user=${userFromURL()}`;
            }
        });

    } catch (error) {
        console.error("Error in setNavBarLinks:", error);
    }
}

window.addEventListener('resize', () => {
    setNavBarLinks();
});

setNavBarLinks();

/**
 * Opens the "add_task.html" page without specifying a contact to add.
 */
function addTaskSiteWithoutContactLink() {
    return `add_task.html?contactToAddIndex=-1&user=${userFromURL()}`;
}

/**
 * Generates a URL for the "summary.html" page with user parameters.
 * 
 * @function
 * @name openSummaryLink
 * @returns {string} The URL for the "summary.html" page with user parameters.
 */
function openSummaryLink() {
    return `summary.html?user=${userFromURL() || 'guest'}`;
}

/**
 * Generates a URL for the "contacts.html" page with user parameters.
 * 
 * @function
 * @name openContactLink
 * @returns {string} The URL for the "contacts.html" page with user parameters.
 */
function openContactLink() {
    return `contacts.html?user=${userFromURL()}`;
}

/**
 * Opens the "board.html" page.
 * 
 */
function openBoardLink() {
    return `board.html?contactToAddIndex=-1&user=${userFromURL()}`;
}

/**
 * Generates a URL for the "summary.html" page with user parameters.
 * 
 * @function
 * @name openLegalNoticeLink
 * @returns {string} The URL for the "summary.html" page with user parameters.
 */
function openLegalNoticeLink() {
    return `legal_notice.html?user=${userFromURL()}`;
}

/**
 * Generates a URL for the "summary.html" page with user parameters.
 * 
 * @function
 * @name openHelpLink
 * @returns {string} The URL for the "summary.html" page with user parameters.
 */
function openHelpLink() {
    return `help.html?user=${userFromURL()}`;
}

/**
 * Navigates the user to the "board.html" page.
 * 
 * @function
 * @name goToBoard
 * @returns {void}
 */
function goToBoard() {
    window.open(openBoardLink(), "_self");
}

/**
 * Opens the "big_card_mobile.html" page with the specified card index.
 * 
 * @param {number} cardIndex - The index of the card to display.
 */
function openBigCardMobile(cardIndex) {
    window.open(`big_card_mobile.html?user=${userFromURL()}&card_ind=${cardIndex}`, "_self");
}

/**
 * Navigates the user back to the previous page in their browser history.
 *
 * @function
 * @name goBack
 * @returns {void}
 */
function goBack() {
    window.history.back();
}   
