/**
 * Writes the current year into the footer.
 *
 * @returns {void}
 */
function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

/**
 * Deletes the saved sound setting from the browser's local storage
 * and shows a confirmation message.
 *
 * @returns {void}
 */
function resetSoundSetting() {
  const message = document.getElementById("resetMsg");
  try {
    localStorage.removeItem("muted");
    message.textContent = "Your sound setting has been deleted.";
  } catch (error) {
    message.textContent = "Local storage is not available in your browser.";
  }
}

/**
 * Connects the reset button, if the current page has one.
 *
 * @returns {void}
 */
function initResetButton() {
  const button = document.getElementById("resetSettingBtn");
  if (button) button.addEventListener("click", resetSoundSetting);
}

setCurrentYear();
initResetButton();
