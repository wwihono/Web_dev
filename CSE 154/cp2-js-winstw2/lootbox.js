/**
 * Name: Winston Wihono
 * Section: AF
 * Date: 4/16/2024
 *
 * This is the JavaScript for the lootbox.html page. It contains all the interactive functionality
 * and event handling specific to the lootbox feature. The script initializes the application,
 * manages the triggering of animations for opening the lootbox, handles the sound effects, and
 * dynamically displays images of cats chosen at random. The script ensures interactivity of the
 * lootbox by attaching event listeners to UI elements and by manipulating the DOM to update the
 * visuals accordingly. It's designed to work in conjunction with styles defined in styles.css
 * and lootbox.css for a consistent user experience.
 */

"use strict";
(function() {
  const UNLOCK_DELAY = 10;

  /**
   * Initializes event listeners once the window loads.
   */
  window.addEventListener("load", init);

  /**
   * Sets up the initial event listeners after page load.
   */
  function init() {
    id("lootbox-launch").addEventListener("click", lootbox);
  }

  /**
   * Retrieves a random cat image from a predefined list.
   * @returns {string} The file path to a randomly selected cat image.
   */
  function getCat() {
    let cats = ["assets/cake.png", "assets/brawlkit.png", "assets/garfield.png",
      "assets/nyan1.gif", "assets/nyan2.gif"];
    let index = Math.floor(Math.random() * cats.length);
    return cats[index];
  }

  /**
   * Handles the logic to trigger the lootbox animation and display a random cat image.
   */
  function lootbox() {
    triggerChest();

    let chest = qs(".chest");

    chest.addEventListener("animationend", displayCat);
  }

  /**
   * Triggers the animation for opening the chest and handles the setup to remove any existing
   * images.
   */
  function triggerChest() {
    let chest = qs(".chest");
    let container = qs("#lootbox-container");
    let sfx = id("chest-sfx");

    let checkImage = qs("img", container);

    // Check for existing images
    if (checkImage) {
      container.removeChild(checkImage);
    }

    /**
     * Plays the chest sound from the beginning
     * Chest sfx is from https://www.youtube.com/watch?v=jEheNftCtyQ
     */
    sfx.currentTime = 0;
    sfx.play();

    // opens chest with a delay
    chest.classList.remove("chest-unlock");
    setTimeout(() => {
      chest.classList.add("chest-unlock");
    }, UNLOCK_DELAY);
  }

  /**
   * Displays the random cat image in the lootbox container when the chest animation ends.
   * brawlkit.png from liquipedia.com
   * cake.png from adventuretime.fandom.com
   * garfield.png from youtooz.com
   * nyan1.gif from giphy
   * nyan2.gif from giphy
   */
  function displayCat() {
    let container = qs("#lootbox-container");

    // Remove the event listener to prevent multiple triggers
    container.removeEventListener('animationend', displayCat);

    // Proceed to show the cat image
    let newImage = gen("img");
    newImage.src = getCat();
    newImage.alt = "some cartoon cat";
    newImage.classList.add("generated-image");
    container.appendChild(newImage);
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