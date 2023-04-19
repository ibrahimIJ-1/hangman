const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);
const figureParts = document.querySelectorAll(".figure-part");
const displayHint = document.getElementById("hint");
const words = [];
const hint = [];
const wordsObj = {};
const correctLetters = [];
const wrongLetters = [];
let playable = true;
let selectedWord;
let selectedhint;
let randomNumber;

createWordsArray();
// getting the json file
function getJsonFile(path) {
  return fetch(path)
    .then((response) => response.json())
    .then((data) => {
      Object.assign(wordsObj, data);
    });
}
// filling the json object into two arrays (word and hint)
async function createWordsArray() {
  await getJsonFile("./../assets/files/data.json");
  for (let x in wordsObj) {
    words.push(wordsObj[x].word);
    hint.push(wordsObj[x].hint);
  } 
  pickWordHint();
  displayWord();
}
// generate random word and its hint and display them
function pickWordHint() {
  randomNumber = Math.floor(Math.random() * words.length);
  selectedWord = words[randomNumber];
  selectedhint = hint[randomNumber];
  displayHint.innerHTML = selectedhint;
}
// Show hidden word
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;
  const innerWord = wordEl.innerText.replace(/[ \n]/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";

    playable = false;
  }
}
// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;
  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}
// Show notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}
// Keydown letter press
window.addEventListener("keydown", (e) => {
  if (playable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
  playable = true;

  //  Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);
  pickWordHint();
  displayWord();
  updateWrongLettersEl();
  popup.style.display = "none";
});
