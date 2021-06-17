"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// Global

let activeCards = [];
let waitingRoom = false;

// Counting the rounds of play (2 cards each)
let counter = 0;

/** Shuffle array items in-place and return shuffled array. */

const colors = shuffle(COLORS);
createCards(colors);

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

// Card creation

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    let card = document.createElement("div");
    gameBoard.appendChild(card);
    card.classList.add(color);
    card.addEventListener("click", handleCardClick);
    activeCards.push(card);
  }
}

// Click on a card

function handleCardClick(evt) {
  if (waitingRoom) return;
  let card = evt.target;
  card.style.backgroundColor = card.className;
  const cardsNumber = cardCount();

  // Logic to run when second card is clicked

  let colorArr = colorArray();
  if (cardsNumber === 2 && colorArr[0] !== colorArr[1]) {
    waitingRoom = true;
    setTimeout(function () {
      waitingRoom = false;
      addRounds();
      for (let elem of activeCards) {
        elem.style.backgroundColor = "";
      }
    }, 1000);
  } else if (cardsNumber === 2 && colorArr[0] === colorArr[1]) {
    alert("Match!");
    let firstColor = colorList().indexOf(colorArr[0]);
    activeCards.splice(firstColor, 1);
    let secondColor = colorList().lastIndexOf(colorArr[1]);
    activeCards.splice(secondColor, 1);
    addRounds();
  }
}

// Keep track of the number of cards flipped over

function cardCount() {
  let count = 0;
  for (let elem of activeCards) {
    if (elem.style.backgroundColor !== "") {
      count++;
    }
  }
  return count;
}

// An array of at most two of the turned over card colors

function colorArray() {
  let colorArr = [];
  for (let elem of activeCards) {
    if (elem.style.backgroundColor !== "") {
      colorArr.push(elem.style.backgroundColor);
    }
  }
  return colorArr;
}

// List of all the colors in an array

function colorList() {
  let colorList = [];
  for (let elem of activeCards) {
    colorList.push(elem.style.backgroundColor);
  }
  return colorList;
}

// Number of rounds

function addRounds(colors) {
  counter++;
  const roundsNumber = document.getElementById("roundsNumber");
  roundsNumber.innerText = `Rounds: ${counter}`;
}
