/**
 * This function will load templates to your html
 */
async function includeHTML() {
    console.log("Loading templates...");
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("w3-include-html"); // z. B. "templates/header.html"
        try {
            let resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
                console.log(`Loaded template: ${file}`);
            } else {
                element.innerHTML = 'Page not found';
                console.error(`Template not found: ${file}`);
            }
        } catch (error) {
            element.innerHTML = 'Error loading template';
            console.error(`Error fetching template: ${file}`, error);
        }
    }

    console.log("Templates loaded. Updating navbar links...");
    setNavBarLinks(); // Navbar-Links aktualisieren, nachdem alle Templates geladen sind
    console.log("Navbar links updated.");
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
// function userFromURL() {
//     let currentUser = getCurrentUserVariable();
//     return currentUser;
// }

// neu vom 13-12-2024
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
    console.log('Setting navbar links...');
    try {
        let summaryLink, boardLink, addTaskLink, contactsLink, legalNoticeLink, helpLink;

        // Unterscheidung zwischen Desktop- und Mobile-Ansicht
        if (window.innerWidth > 999) {
            summaryLink = document.getElementById("summaryHTML");
            boardLink = document.getElementById("boardHTML");
            addTaskLink = document.getElementById("addTaskHTML");
            contactsLink = document.getElementById("contactsHTML");
            legalNoticeLink = document.getElementById("legalNoticeHTML");
            helpLink = document.getElementById("helpHTML");
        } else {
            summaryLink = document.getElementById("summaryHTML_mobile");
            boardLink = document.getElementById("boardHTML_mobile");
            addTaskLink = document.getElementById("addTaskHTML_mobile");
            contactsLink = document.getElementById("contactsHTML_mobile");
        }

        // Überprüfen, ob die Links existieren, bevor wir sie setzen
        if (summaryLink) {
            summaryLink.href = `summary.html?user=${userFromURL()}`;
            console.log(`Summary link set to: ${summaryLink.href}`);
        }
        if (boardLink) {
            boardLink.href = `board.html?user=${userFromURL()}`;
            console.log(`Board link set to: ${boardLink.href}`);
        }
        if (addTaskLink) {
            addTaskLink.href = `add_task.html?user=${userFromURL()}`;
            console.log(`Add Task link set to: ${addTaskLink.href}`);
        }
        if (contactsLink) {
            contactsLink.href = `contacts.html?user=${userFromURL()}`;
            console.log(`Contacts link set to: ${contactsLink.href}`);
        }
        if (legalNoticeLink) {
            legalNoticeLink.href = `legal_notice.html?user=${userFromURL()}`;
            console.log(`Legal Notice link set to: ${legalNoticeLink.href}`);
        }
        if (helpLink) {
            helpLink.href = `help.html?user=${userFromURL()}`;
            console.log(`Help link set to: ${helpLink.href}`);
        }

        console.log("Navbar links successfully updated.");
    } catch (error) {
        console.error("Error in setNavBarLinks:", error);
    }
}


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
