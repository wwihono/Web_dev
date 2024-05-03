/*
 * Name: Winston Wihono
 * Section: AF
 * Date: 4/16/2024
 *
 * This is the JavaScript for the index.html page. It contains all the functionality for handling
 * button click events, such as revealing and hiding answers, as well as toggling the rocket
 * animation sequence. The script attaches event listeners to the buttons and manipulates the
 * overall DOM tree to display the visuals correctly. The script is designed to coincide with
 * styles.css for all the functionality and to create a consistent experience for the user.
 */

"use strict";
(function() {
  /**
   * Initializes event listeners once the window loads.
   */
  window.addEventListener("load", init);

  /**
   * Sets up the initial event listeners after page load.
   */
  function init() {
    /**
     * call anonymous functions so that it gets called on click, not during the process of creating
     * the event listeners.
     */
    qs("#reveal1").addEventListener("click", function() {
      toggleAns("#answer1", "#reveal1");
    });
    qs("#reveal2").addEventListener("click", function() {
      toggleAns("#answer2", "#reveal2");
    });
    qs("#reveal1").addEventListener("click", addRocket);
  }

  /**
   * toggle answers to the question when button is pressed, modifying visibility property.
   * @param {string} answer - CSS selector for the answer element
   * @param {string} button - CSS selector for the button element
   */
  function toggleAns(answer, button) {
    let visibility = qs(answer);

    if (visibility.classList.contains('answer-hidden')) {
      visibility.classList.replace('answer-hidden', 'answer-revealed');
      qs(button).textContent = "Hide Fact";
    } else {
      visibility.classList.replace('answer-revealed', 'answer-hidden');
      qs(button).textContent = "Reveal Fact";
    }
  }

  /**
   * generate and toggle image of a rocket and add animation floating across the screen.
   * rocket img from Clker.com
   */
  function addRocket() {

    // if a rocket already appeared, toggles the image off
    if (id("rocket")) {
      id("rocket-container").removeChild(id("rocket"));
    } else {
      let rocket = gen("img");

      rocket.id = "rocket";

      // append rocket to the question container
      rocket.src = "assets/rocket.png";
      id("rocket-container").appendChild(rocket);
    }
  }

  /**
   * Getter function for element with specific id
   * @param {string} id - HTML id selector
   * @returns {Element} - element associated with the selector
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Gets the first instance of the element selected
   * @param {string} selector - HTML query selector
   * @returns {Element} - element associated with the selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Tag generator for new DOM nodes
   * @param {string} tagName - element tag type
   * @returns {Element} - a new DOM element with the specified tag
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();