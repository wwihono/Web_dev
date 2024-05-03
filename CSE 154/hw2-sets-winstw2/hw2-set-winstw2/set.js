/**
 * Name: Winston Wihono
 * Section: AF
 * Date: 4/25/2024
 *
 * This set.js script file runs a 3-set matching game that implements a visual timer, difficulty
 * settings and also dynamically changing images. The script handles all events that happens on the
 * page such as redirects, selecting and unselecting elements, as well as refreshing the game board.
 * The game also handles all the underlying events, such as setting up and generating the play
 * board and set patterns, as well as initiating end game sequences when the game timer ends.
 */

"use strict";
(function() {
  let timerId;
  let remainingSeconds;
  const STYLES = ['outline', 'solid', 'striped'];
  const COLORS = ['red', 'green', 'purple'];
  const SHAPES = ['diamond', 'oval', 'squiggle'];
  const COUNTS = [1, 2, 3];

  /**
   * Initializes event listeners once the window loads.
   */
  window.addEventListener("load", init);

  /**
   * Sets up the initial event listeners after page load.
   */
  function init() {
    id("start-btn").addEventListener("click", toggleViews);
    id("back-btn").addEventListener("click", toggleViews);
    id("refresh-btn").addEventListener("click", resetBoard);
  }

  /**
   * Toggles between the game view and menu view of the program.
   * When game view is toggled, it calls the start game function
   * and creates a new instance of the game board.
   */
  function toggleViews() {
    if (id("game-view").classList.contains("hidden")) {
      id("menu-view").classList.add("hidden");
      id("game-view").classList.remove("hidden");
      startGame();
    } else {
      id("game-view").classList.add("hidden");
      id("menu-view").classList.remove("hidden");
    }
  }

  /**
   * Resets the game board instance and begins the game timer.
   */
  function startGame() {
    resetBoard();
    startTimer();
  }

  /**
   * Executes when the timer is over, it unselects any cards currently selected and removes the
   * ability to select any more cards after time is up. Signals end of this game instance, players
   * can continue to play by restarting the game.
   */
  function endGame() {
    let allCards = qsa(".card");

    allCards.forEach(card => {
      card.classList.remove("selected");
      card.removeEventListener("click", cardSelected); // Ensures each card has its listener removed
    });
  }

  /**
   * Clears any existing elements on the board in preparation for game commencement. Then begins
   * generating uniquely generated cards according to the specified difficulty.
   */
  function resetBoard() {
    const boardElement = id('board');
    boardElement.innerHTML = ''; // Clear the board

    const isEasy = qs('input[name="diff"]:checked').value === 'easy';
    const easy = 9;
    const standard = 12;

    // Adjust the number of cards based on the difficulty
    const totalCards = isEasy ? easy : standard;

    for (let i = 0; i < totalCards; i++) {
      let cardElement = generateUniqueCard(isEasy);
      boardElement.appendChild(cardElement); // Add new unique cards to the board
    }

    qs("#refresh-btn").removeAttribute("disabled");
  }

  /**
   * Starts the game timer for the specified duration.
   */
  function startTimer() {
    const selectedTime = parseInt(qs("#menu-view select").value);
    const interval = 1000; // 1 second

    remainingSeconds = selectedTime;

    // Update the display to show the starting time
    id('time').textContent = formatTime(remainingSeconds);

    // Clear any existing timers before starting a new one
    if (timerId !== null) {
      clearInterval(timerId);
    }

    // Start the periodic calling of advanceTimer() every 1 second
    timerId = setInterval(advanceTimer, interval);
  }

  /**
   * advances the game timer by 1 second, and updates the visual timer. When timer reaches 0, it
   * stops the timer and disables the refresh button.
   */
  function advanceTimer() {
    // Decrement the remaining time by 1 second
    remainingSeconds -= 1;

    // Update the display to show the new time
    id('time').textContent = formatTime(remainingSeconds);

    // If the timer runs out, stop the game and handle end-of-game logic
    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      qs("#refresh-btn").setAttribute("disabled", "disabled");
      endGame();
    }
  }

  /**
   * Formats the time to be displayed as the desired MM:SS format
   * @param {int} seconds The amount of time left
   * @returns {string} formatted string in MM:SS format
   */
  function formatTime(seconds) {
    // Format the time to be displayed in MM:SS format
    const isUnderTen = 10;
    const sec = 60;
    let minutes = Math.floor(seconds / sec);
    let secs = seconds % sec;
    return `${minutes < isUnderTen ? '0' : ''}${minutes}:${secs < isUnderTen ? '0' : ''}${secs}`;
  }

  /**
   * Generates an array of attributes for a card based on the difficulty setting.
   * @param {boolean} isEasy - Determines if the game mode is easy.
   * @returns {Array} An array containing the style, shape, color, and count attributes for a card.
   */
  function generateRandomAttributes(isEasy) {
    let style, color, shape, count;
    if (isEasy) {
      style = "solid";
    } else {
      style = randomElement(STYLES);
    }

    // Initialize random attributes
    color = randomElement(COLORS);
    count = randomElement(COUNTS);
    shape = randomElement(SHAPES);

    return [style, shape, color, count];
  }

  /**
   * Returns a random element from an array.
   * @param {Array} array - Array from which to pick a random element.
   * @returns {*} A random element from the given array.
   */
  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a unique card that does not exist on the board.
   * @param {boolean} isEasy - Determines if the game mode is easy.
   * @returns {Element} A DOM element representing the unique card.
   */
  function generateUniqueCard(isEasy) {
    let uniqueCard;
    let existingCardIds = Array.from(qsa("#board .card")).map(card => card.id);
    let board = new Set(existingCardIds);

    do {
      uniqueCard = createCardElement(generateRandomAttributes(isEasy));
    } while (board.has(uniqueCard.id));

    uniqueCard.addEventListener('click', cardSelected); // Add click event listener to each card

    return uniqueCard;
  }

  /**
   * Creates a card element with specified attributes.
   * @param {Array} attributes - Attributes [style, shape, color, count] to create the card element.
   * @returns {Element} A card element with images corresponding to its attributes.
   */
  function createCardElement(attributes) {
    // Create a div element for the card
    let card = gen('div');
    card.id = `${attributes.join('-')}`;
    card.className = 'card';

    // Append COUNT number of img elements as children based on the attributes
    for (let i = 0; i < attributes[3]; i++) {
      let img = gen('img');
      img.src = getImageSource(attributes);
      card.appendChild(img);
    }

    return card;
  }

  /**
   * Constructs the image source URL based on the card's attributes.
   * @param {Array} attributes - Attributes [style, shape, color] used to construct the image source
   * @returns {string} The relative path to the image source.
   */
  function getImageSource(attributes) {
    const attr = `${attributes[0]}-${attributes[1]}-${attributes[2]}.png`;

    const relativePath = `img/${attr}`;

    // Construct the image source from the card attributes
    return relativePath;
  }

  /**
   * Toggles selection of cards and checks for a set of three cards.
   */
  function cardSelected() {
    this.classList.toggle("selected");

    const selectedCards = qsa(".card.selected");

    if (selectedCards.length === 3) {
      if (isASet(selectedCards)) {
        handleSet(selectedCards);
      } else {
        handleInvalidSet(selectedCards);
      }
      resetSelection(selectedCards);
    }
  }

  /**
   * Handles the valid set scenario by incrementing score and replacing valid sets with
   * new cards.
   * @param {Element[]} selectedCards - The cards that form a valid set.
   */
  function handleSet(selectedCards) {
    let isEasy = qs('input[name="diff"]:checked').value === 'easy';
    const scoreElement = id("set-count");
    const scoreZero = 0;
    let currentScore = parseInt(scoreElement.textContent) || scoreZero;
    scoreElement.textContent = currentScore + 1;

    selectedCards.forEach(card => {
      const newCard = generateUniqueCard(isEasy);
      replaceElement(card, newCard);
      displaySetOverlay(card);
    });
  }

  /**
   * Displays an overlay for a valid set and removes it after a brief period.
   * @param {Element} card - The card to display the overlay on.
   */
  function displaySetOverlay(card) {
    const cardElement = id(card.id);
    const sec = 1000;
    cardElement.classList.add('hide-imgs');
    const parag = gen('p');
    parag.textContent = "SET!";
    cardElement.appendChild(parag);

    // Remove overlay after 1 second
    setTimeout(() => {
      cardElement.classList.remove('hide-imgs');
      cardElement.removeChild(parag);
    }, sec);
  }

  /**
   * Replaces all child nodes and the ID of a target DOM element with those from another element.
   * @param {Element} oldCard The DOM element to be updated.
   * @param {Element} newCard The DOM element whose children and ID will be copied to the oldCard.
   */
  function replaceElement(oldCard, newCard) {
    // Delete all the child nodes appended to the old card
    while (oldCard.firstChild) {
      oldCard.removeChild(oldCard.firstChild);
    }

    // Clone and append children from the new card to the old card
    Array.from(newCard.childNodes).forEach(card => {
      oldCard.appendChild(card.cloneNode(true));
    });

    // update the ID of the old card to match the new card
    oldCard.id = newCard.id;
  }

  /**
   * Displays an error message on each card from the selection to indicate that they do not
   * form a valid set, then removes the message after a second.
   * @param {Element[]} selectedCards array of DOM elements representing 3 cards that don't make
   *                                  a set
   */
  function handleInvalidSet(selectedCards) {
    const sec = 1000;

    // Temporarily display the "Not a Set" message on each selected card
    selectedCards.forEach(card => {
      const cardElement = id(card.id);
      cardElement.classList.add('hide-imgs'); // Hide the images within the card
      const parag = gen('p');
      parag.textContent = "Not a Set";
      cardElement.appendChild(parag);

      // After 1 second, revert the changes
      setTimeout(() => {
        cardElement.classList.remove('hide-imgs');
        cardElement.removeChild(parag);
      }, sec);
    });
  }

  /**
   * Unselects all currently selected cards
   * @param {Element} selectedCards The DOM nodes containing the selected cards.
   */
  function resetSelection(selectedCards) {
    selectedCards.forEach(card => {
      card.classList.remove("selected");
    });
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
        attributes[1][i] !== attributes[2][i] &&
        attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
        attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
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
   * Gets the all instances of the element selected
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