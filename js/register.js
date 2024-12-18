// register.js
let users = [];
let email;
let user;

/**
 * Initializes the page by loading email and password data and users data.
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
 * Loads the email and password values from localStorage and populates the login form.
 */
function loadEmailPassword() {
  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  let checkbox = document.getElementById("login-checkbox");
  let rememberMeChecked = localStorage.getItem("rememberMeChecked");
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
 * Loads the users data from the Realtime Database.
 * Falls die "users"-Daten nicht existieren, wird ein leerer Array angelegt.
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
 * Switches to the registration form view.
 */
function register() {
  document.getElementById('signup-btn').classList.remove('dnone');
  document.getElementById('login-section').classList.remove('dnone');
  document.getElementById('signup-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.add('dnone');
}

/**
 * Performs user registration.
 */
async function signup() {
  registerBtn.disabled = true;
  let name = document.getElementById("name-signup");
  let email = document.getElementById("email-signup");
  let password = document.getElementById("password-signup");
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
 * Resets the signup form.
 * 
 * @param {HTMLElement} name - The name input element.
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} password - The password input element.
 */
function resetSignup(name, email, password) {
  name.value = "";
  email.value = "";
  password.value = "";
  registerBtn.disabled = false;
}

/**
 * Performs user login.
 */
async function login() {
  await loadUsers();
  let emailInput = document.getElementById("email-login");
  let passwordInput = document.getElementById("password-login");
  let email = emailInput.value;
  let password = passwordInput.value;
  let user = users.find(u => u.email === email);

  if (!user) {
    emailInput.setCustomValidity("Unbekannte E-Mail-Adresse");
    passwordInput.setCustomValidity("");
    emailInput.value = "";
    passwordInput.value = "";
    return;
  }

  if (password !== user.password) {
    emailInput.setCustomValidity("");
    passwordInput.setCustomValidity("Falsches Passwort");
    passwordInput.value = "";
    passwordInput.reportValidity(); 
  } else {
    rememberLogin(email, password);
    emailInput.value = "";
    passwordInput.value = "";
    emailInput.setCustomValidity("");
    passwordInput.setCustomValidity("");
    window.location.href = `summary.html?user=${user.name}`;
  }

  passwordInput.addEventListener("input", function () {
    passwordInput.setCustomValidity(""); 
  });

  users = [];
}

/**
 * Stores the login email and password in localStorage based on the remember me checkbox.
 * 
 * @param {string} email - The login email.
 * @param {string} password - The login password.
 */
function rememberLogin(email, password) {
  let checkbox = document.getElementById("login-checkbox");
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
 * Logs in as a guest user.
 */
async function loginGuest() {
  await loadUsers();
  let guestEmail = "guest@guest.com";
  let guestPassword = "123456";

  let guestUser = users.find(u => u.email === guestEmail);

  if (!guestUser) {
      users.push({
          name: "Guest",
          email: guestEmail,
          password: guestPassword,
      });
      await setItem("users", JSON.stringify(users));
  }

  let email = document.getElementById("email-login");
  let password = document.getElementById("password-login");
  email.value = guestEmail;
  password.value = guestPassword;

  window.location.href = `summary.html?user=Guest`;
}

/**
 * Switches to the signup form view.
 */
function signupButton() {
  document.getElementById('signup-btn').classList.add('dnone');
  document.getElementById('login-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.add('dnone');
  document.getElementById('signup-section').classList.remove('dnone');
}

/**
 * Switches to the forgot password form view.
 */
function forgotPassword() {
  document.getElementById('signup-btn').classList.add('dnone');
  document.getElementById('login-section').classList.add('dnone');
  document.getElementById('signup-section').classList.add('dnone');
  document.getElementById('forgot-password').classList.remove('dnone');
}

/**
 * Opens the logout button.
 */
function openLogout() {
  document.getElementById('logout-btn').classList.remove('dnone');
  setTimeout(() => {
    document.addEventListener('click', checkLogout);
  }, 0);
}

/**
 * Closes the logout button.
 */
function closeLogout() {
  document.getElementById('logout-btn').classList.add('dnone');
  document.removeEventListener('click', checkLogout);
}

/**
 * Checks if a click event occurred outside the logout button and closes it if true.
 * 
 * @param {Event} event - The click event.
 */
function checkLogout(event) {
  if (event.target.id !== 'logout-btn') {
    closeLogout();
  }
}

/**
 * Performs the logout action by redirecting to the index.html page.
 */
function logout() {
  window.location.href = 'index.html';
}

/**
 * Resets the password using the provided form data.
 * 
 * @param {Event} event - The form submit event.
 */
async function resetPassword(event) {
  event.preventDefault();
  let formData = new FormData(event.target);
  let response = await action(formData);
  if (response.ok) {
    confirmEmailBanner();
  } else {
    alert('E-Mail was not sent!');
  }
}

/**
 * Displays a confirmation banner after successful email confirmation.
 */
function confirmEmailBanner() {
  let forgotBtn = document.querySelector('.forgot-btn');
  let sendEmail = document.getElementById('confirmemail');
  let gray = document.querySelector('.login-section');
  let gray2 = document.querySelector('.fullscreen-img');
  sendEmail.classList.remove('dnone');
  forgotBtn.classList.add('disabled');
  sendEmail.classList.add('sendemailiframe');
  gray.style.background = 'lightgray';
  gray2.style.backgroundColor = 'lightgray';
  setTimeout(() => {
    sendEmail.classList.remove('sendemailiframe');
    gray.style.background = '#f6f7f8';
    gray2.style.backgroundColor = '#f6f7f8';
    forgotBtn.classList.remove('disabled');
    sendEmail.classList.add('dnone');
  }, 2500);
}

/**
 * Performs an action using the provided form data.
 * 
 * @param {FormData} formData - The form data to be sent.
 * @returns {Promise<Response>} - A Promise that resolves to the fetch response.
 */
function action(formData) {
  const input = 'https://join.gloriacodes.de/send_mail.php';
  const requestInit = {
    method: 'post',
    body: formData
  };

  return fetch(input, requestInit);
}

/**
 * Performs necessary actions on page load.
 */
async function onPageLoad() {
  await loadUsers();
  email = getEmailUrl();
  user = await getPasswordResetUser();
}

/**
 * Retrieves the email from the URL query parameters.
 * 
 * @returns {string|null} - The email value from the URL, or null if not found.
 */
function getEmailUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("email");
}

/**
 * Retrieves the user object for password reset based on the email.
 * 
 * @returns {Object|null} - The user object for password reset, or null if not found.
 */
async function getPasswordResetUser() {
  await loadUsers();
  let user = users.find(u => u.email == email);
  return user;
}

/**
 * Performs the final password reset process.
 * 
 * @param {Event} event - The event object.
 */
async function finalPasswordReset(event) {
  event.preventDefault();

  if (!email) {
      email = getEmailUrl();
  }

  let user = await getPasswordResetUser();
  if (!user) {
      alert("User mit dieser Email wurde nicht gefunden!");
      return;
  }

  let name = user.name;
  let password = document.getElementById("reset-password").value;
  let confirmPassword = document.getElementById("reset-password2").value;

  if (password === confirmPassword) {
      // Passwort speichern
      users = users.filter(u => u.email !== email); 
      users.push({ name, email, password }); 

      await setItem("users", JSON.stringify(users)); 
      resettedPassword(); 
      setTimeout(() => {
          window.location.href = "index.html";
      }, 2000);
  } else {
      alert("Passwörter stimmen nicht überein!");
  }
}

/**
 * Saves the user information.
 * 
 * @param {string} name - The name of the user.
 * @param {HTMLInputElement} password - The password input element.
 * @param {string} email - The email of the user.
 * @returns {number} - The new length of the users array.
 */
async function saveUser(name, password, email) {
  return users.push({
    name: name,
    email: email,
    password: password.value,
  });
}

/**
 * Displays a confirmation banner after the password has been reset.
 */
function resettedPassword() {
  let continueBtn = document.querySelector('.change-password-btn')
  let resetPassword = document.getElementById('resetted-password');
  let gray = document.querySelector('.login-section');
  let gray2 = document.querySelector('.login-join-img');
  
  resetPassword.classList.remove('dnone');
  continueBtn.classList.add('disabled');
  resetPassword.classList.add('sendemailiframe');
  gray.style.background = 'lightgray';
  gray2.style.backgroundColor = 'lightgray';
  
  setTimeout(() => {
    resetPassword.classList.remove('sendemailiframe');
    gray.style.background = '#f6f7f8';
    gray2.style.backgroundColor = '#f6f7f8';
    continueBtn.classList.remove('disabled');
    resetPassword.classList.add('dnone');
  }, 2500);
}

/**
 * Redirects to the index.html page.
 */
function backToIndex() {
  window.location.href = 'https://join.gloriacodes.de/index.html';
}