
"use strict";
(function() {
  const API_URL = 'https://bymykel.github.io/CSGO-API/api/en/';

  // Loads the page and content before adding any event listeners.
  window.addEventListener("load", init);

  function init() {
    const inputBtns = qsa(".gun-container");
    qs("button").addEventListener("click", displayLoadout);
    inputBtns.forEach(btn => {
      btn.addEventListener("click", randomSkin);
    });
  }

  async function randomSkin() {
    let currentElement = this.lastElementChild;
    
    try {
      if(currentElement.classList.contains("item-name")) {
        const file = await makeRequest('skins.json');
        await updateSkin(file, currentElement);
      } else if(currentElement.classList.contains("melee-name")) {
        const file = await makeRequest('skins.json');
        await updateSkin(file, currentElement);
      } else {
        const file = await makeRequest('agents.json');
        await updateSkin(file, currentElement);
      }
    } catch (error) {
      console.error("Failed to update skin: ", error);
    }
    
  }

  async function updateSkin(res, oldElement) {
    let name = oldElement.textContent.trim();
    try {
      if (name === 'Knives' || name === 'Gloves') 
      {
        let container = oldElement.parentElement.querySelector(".melee-img");
        let filtered = res.filter(skins => skins.category.name === name);
        if (filtered.length > 0) {
            setRandom(container, filtered);
        }
      } else if (name === 'Agents') {
          let container = oldElement.parentElement.querySelector(".agent-img");
          if(res.length > 0) {
            setRandom(container, res);
          }
      } else { // gun skins, since they are categorized by name
        let container = oldElement.parentElement.querySelector(".gun-img");
        let filtered = res.filter(skins => skins.weapon.name === name);
        if (filtered.length > 0) {
          setRandom(container, filtered);
        }
      }
    } catch (error) {
      console.error("Failed to update image", error);
    }
  }

  function setRandom(container, arr) {
    // Check for existing imges
    if(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    let random = Math.floor(Math.random() * arr.length);
    let img = gen("img");
    img.src = arr[random].image;
    img.alt = arr[random].name;
    container.appendChild(img);
  }

  async function displayLoadout() {
    id("start-btn").classList.add("hidden");
    qs(".content-bar").classList.remove("hidden");
    let parentElement = document.getElementById('loadout-builder'); // Select the parent element
    let directChildren = parentElement.children; // Get only direct children of the parent element

    for (let child of directChildren) {
        child.classList.remove('hidden'); // remove 'hidden' class from direct child
        child.classList.add('visible');
    }
    let res = await makeRequest('skins.json');
    setDefaultMelee(res);
    setDefaultGuns(res);
    setDefaultAgent(await makeRequest('agents.json'));
  }

  async function makeRequest(param){
    try {
      let res = await fetch(API_URL + param);
      await statusCheck(res);
      res = await res.json();
      return await res;
    } catch(err) {
      console.error("Failed to fetch: ", err);
    }
  }

  function setDefaultGuns(res){
    const itemNames = document.querySelectorAll(".item-name");
    try {
      for (let i = 0; i < itemNames.length; i++) {
        const imgContainer = itemNames[i].parentElement.querySelector(".gun-img");
        let current = itemNames[i].textContent.trim();
        let data = res.find(skin => skin.weapon.name === current);
        
        if (data) { // Check if data is found
          let defaultImage = gen("img"); // Create the image element
          defaultImage.src = data.image; // Set image source
          defaultImage.alt = data.id; // Set image alt text
          
          // Clear the container before appending new image
          while (imgContainer.firstChild) {
            imgContainer.removeChild(imgContainer.firstChild);
          }
          imgContainer.appendChild(defaultImage); // Append the new image to the container
        } else {
          console.log("No data found for:", current); // Log if no data is found
        }
      }
    } catch (err) {
        console.error("Error processing data: ", err);
    }
  }

  function setDefaultAgent(res){
    try {
      const imgContainer = qs('.agent-name').parentElement.querySelector(".agent-img");
      let defaultImage = gen("img");
      let data = res[0];
      defaultImage.src = data.image;
      defaultImage.alt = data.id;
      if(data) {
        while(imgContainer.firstChild) {
          imgContainer.removeChild(imgContainer.firstChild);
        }
        imgContainer.appendChild(defaultImage);
      }
    } catch (err) {
      console.error("Error processing data: ", err);
    }
  }

  function setDefaultMelee(res){
    const itemNames = qsa(".melee-name");
    try {
      for(let i = 0; i < itemNames.length; i++) {
        let defaultImage = gen("img");
        let current = itemNames[i].textContent.trim();
        const data = res.find(skin => skin.category.name === current);
        
        if (data) { // Check if data is found
          // Navigate correctly to the img element
          defaultImage.src = data.image;
          defaultImage.alt = data.id;
          let imgContainer = itemNames[i].parentElement.querySelector(".melee-img");
          while(imgContainer.firstChild) {
            imgContainer.removeChild(imgContainer.firstChild);
          }
          imgContainer.appendChild(defaultImage);
        } 
      }
    } catch (err) {
      console.error("Error processing data: ", err);
    }
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
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