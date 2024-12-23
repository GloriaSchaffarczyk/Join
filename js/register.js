// register.js
let users = [];
let email;
let user;

/**
 * Initialisiert die Seite durch Laden von Benutzerdaten und Login-Informationen.
 */
function init() {
    setTimeout(function() {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        loadEmailPassword();
        loadUsers();
        document.body.style.overflow = 'visible';
    }, 0);
}

/**
 * Lädt gespeicherte E-Mail- und Passwort-Informationen aus dem LocalStorage.
 */
function loadEmailPassword() {
    const email = document.getElementById("email-login");
    const password = document.getElementById("password-login");
    const checkbox = document.getElementById("login-checkbox");
    const rememberMeChecked = localStorage.getItem("rememberMeChecked");

    if (rememberMeChecked === "true") {
        checkbox.checked = true;
        email.value = localStorage.getItem("email");
        password.value = localStorage.getItem("password");
    } else {
        checkbox.checked = false;
        email.value = "";
        password.value = "";
    }
}

/**
 * Lädt die Benutzerdaten aus der Datenbank. 
 * Falls keine vorhanden sind, wird ein leerer Array erstellt.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (error) {
        console.warn(error);
        users = [];
        await setItem('users', JSON.stringify(users));
    }
}

/**
 * Öffnet das Registrierungsformular.
 */
function register() {
    document.getElementById('signup-btn').classList.remove('dnone');
    document.getElementById('login-section').classList.remove('dnone');
    document.getElementById('signup-section').classList.add('dnone');
    document.getElementById('forgot-password').classList.add('dnone');
}

/**
 * Registriert einen neuen Benutzer.
 */
async function signup() {
    const name = document.getElementById("name-signup");
    const email = document.getElementById("email-signup");
    const password = document.getElementById("password-signup");
    const registerBtn = document.querySelector('.login-btn');

    registerBtn.disabled = true;
    await loadUsers();
    users.push({
        name: name.value,
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetSignup(name, email, password);
    register();
}

/**
 * Setzt das Registrierungsformular zurück.
 */
function resetSignup(name, email, password) {
    name.value = "";
    email.value = "";
    password.value = "";
    document.querySelector('.login-btn').disabled = false;
}

/**
 * Führt die Benutzeranmeldung durch.
 */
async function login() {
    await loadUsers();
    const emailInput = document.getElementById("email-login");
    const passwordInput = document.getElementById("password-login");
    const email = emailInput.value;
    const password = passwordInput.value;
    const user = users.find(u => u.email === email);

    if (!user) {
        emailInput.setCustomValidity("Unbekannte E-Mail-Adresse");
        emailInput.reportValidity();
        emailInput.value = "";
        passwordInput.value = "";
        return;
    }

    if (password !== user.password) {
        passwordInput.setCustomValidity("Falsches Passwort");
        passwordInput.reportValidity();
        passwordInput.value = "";
        return;
    }

    rememberLogin(email, password);
    window.location.href = `summary.html?user=${user.name}`;
}

/**
 * Speichert Login-Informationen basierend auf der "Remember Me"-Einstellung.
 */
function rememberLogin(email, password) {
    const checkbox = document.getElementById("login-checkbox");
    if (checkbox.checked) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMeChecked", "true");
    } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.setItem("rememberMeChecked", "false");
    }
}

/**
 * Loggt als Gastbenutzer ein.
 */
async function loginGuest() {
    await loadUsers();
    const guestEmail = "guest@guest.com";
    const guestPassword = "123456";
    let guestUser = users.find(u => u.email === guestEmail);

    if (!guestUser) {
        users.push({ name: "Guest", email: guestEmail, password: guestPassword });
        await setItem("users", JSON.stringify(users));
    }

    window.location.href = `summary.html?user=Guest`;
}

/**
 * Öffnet das Formular zum Zurücksetzen des Passworts.
 */
function forgotPassword() {
    document.getElementById('signup-btn').classList.add('dnone');
    document.getElementById('login-section').classList.add('dnone');
    document.getElementById('signup-section').classList.add('dnone');
    document.getElementById('forgot-password').classList.remove('dnone');
}

/**
 * Initialisiert die Passwort-Reset-Seite.
 */
async function onPageLoad() {
    await loadUsers();
    email = getEmailUrl();
    user = await getPasswordResetUser();
}

/**
 * Extrahiert die E-Mail aus der URL.
 */
function getEmailUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("email");
}

/**
 * Holt den Benutzer basierend auf der E-Mail.
 */
async function getPasswordResetUser() {
    await loadUsers();
    return users.find(u => u.email === email);
}

/**
 * Führt den endgültigen Passwort-Reset durch.
 */
async function finalPasswordReset(event) {
    event.preventDefault();

    if (!email) {
        email = getEmailUrl();
    }

    const user = await getPasswordResetUser();
    if (!user) {
        alert("User with this email was not found!");
        return;
    }

    const password = document.getElementById("reset-password").value;
    const confirmPassword = document.getElementById("reset-password2").value;

    if (password === confirmPassword) {
        users = users.filter(u => u.email !== email);
        users.push({ ...user, password });
        await setItem("users", JSON.stringify(users));
        resettedPassword();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        alert("Passwords do not match!");
    }
}

/**
 * Zeigt eine Bestätigung nach dem erfolgreichen Passwort-Reset an.
 */
function resettedPassword() {
    const resetPassword = document.getElementById("resetted-password");
    const continueBtn = document.querySelector(".change-password-btn");
    const gray = document.querySelector(".login-section");
    const gray2 = document.querySelector(".login-join-img");

    resetPassword.classList.remove("dnone");
    continueBtn.classList.add("disabled");
    resetPassword.classList.add("sendemailiframe");
    gray.style.background = "lightgray";
    gray2.style.backgroundColor = "lightgray";

    setTimeout(() => {
        resetPassword.classList.remove("sendemailiframe");
        gray.style.background = "#f6f7f8";
        gray2.style.backgroundColor = "#f6f7f8";
        continueBtn.classList.remove("disabled");
        resetPassword.classList.add("dnone");
    }, 2500);
}

/**
 * Redirects to the index.html page.
 */
function backToIndex() {
  window.location.href = 'https://join.gloriacodes.de/index.html';
}