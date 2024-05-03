"use strict";
(function() {
  window.addEventListener("load", init);

  function init() {
    let buttons = qsa(".item button");
    console.log("it runs!");

    buttons.forEach(button => {
      button.addEventListener("mouseenter", setDisplay);
      button.addEventListener("mouseleave", resetDisplay);
    });
  }

  function setDisplay() {
    this.querySelector(".button-txt").classList.add("material-symbols-outlined");
    this.querySelector(".button-txt").textContent = "add_shopping_cart";
  }

  function resetDisplay() {
    this.querySelector(".button-txt").classList.remove("material-symbols-outlined");
    this.querySelector(".button-txt").textContent = "Add to Cart";
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
   * Gets the first instance of the element selected
   * @param {string} selector - HTML query selector
   * @returns {Element} - element associated with the selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
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