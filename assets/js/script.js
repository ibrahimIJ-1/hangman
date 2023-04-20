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
const startBtn = document.getElementById("startBtn");
const playerOneNameEl = document.getElementById("playerOneName");
const playerTwoNameEl = document.getElementById("playerTwoName");
const playerOneScoreEl = document.getElementById("playerOneScore");
const playerTwoScoreEl = document.getElementById("playerTwoScore");
const turnEl = document.getElementById("turn");
const timerEl = document.getElementById("timer");
const words = [];
const hint = [];
const wordsObj = {};
const correctLetters = [];
const wrongLetters = [];
let playable = true;
let selectedWord;
let selectedhint;
let randomNumber;
let playerOneName = "";
let playerTwoName = "";
let playerTurn;
let playerOneScore = 0;
let playerTwoScore = 0;
let timer = 10;
let timerId = null;

startBtn.addEventListener("click", startGame);

function changePlayer() {
  playerTurn === `${playerOneName}`
    ? (playerTurn = `${playerTwoName}`)
    : (playerTurn = `${playerOneName}`);
  turnEl.innerHTML = playerTurn;
  resetTimer();
}
function getPlayersNames() {
  playerOneName = prompt("Player one please enter your name");
  if (playerOneName == null || playerOneName == "") {
    playerOneName = "Player one";
    playerOneNameEl.innerHTML = `${playerOneName}'s Score:`;
  } else {
    playerOneNameEl.innerHTML = `${playerOneName}'s Score:`;
    playerOneScoreEl.innerHTML = playerOneScore;
  }
  playerTwoName = prompt("Player two please enter your name");
  if (playerTwoName == null || playerTwoName == "") {
    playerTwoName = "Player two";
    playerTwoNameEl.innerHTML = `${playerTwoName}'s Score:`;
  } else {
    playerTwoNameEl.innerHTML = `${playerTwoName}'s Score:`;
    playerTwoScoreEl.innerHTML = playerTwoScore;
  }
  playerTurn = playerOneName;
  turnEl.innerHTML = playerOneName;
}
// start the game
function startGame() {
  getPlayersNames();
  createWordsArray();
  startTimer();
}
// getting the json file
//now you can use this function to read the file by the path
async function getJsonFile(path) {
  return await fetch(path)
    .then((response) => response.json())
    .then((data) => {
      Object.assign(wordsObj, data);
    });
}
// filling the json object into two arrays (word and hint)
function createWordsArray() {
  getJsonFile("./assets/files/data.json").then(() => {
    for (let x in wordsObj) {
      words.push(wordsObj[x].word);
      hint.push(wordsObj[x].hint);
    }
    pickWordHint();
    displayWord();
  });
}
// generate random word and its hint and display them
function pickWordHint() {
  randomNumber = Math.floor(Math.random() * words.length);
  selectedWord = words[randomNumber];
  selectedhint = hint[randomNumber];
  displayHint.innerHTML = selectedhint;
}
// update the score
function udpateScore() {
  playerOneScoreEl.innerHTML = playerOneScore;
  playerTwoScoreEl.innerHTML = playerTwoScore;
  stopTimer();
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
    finalMessage.innerText = `Congratulations! ${playerTurn} wins! 😃`;
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playerTurn === playerOneName ? playerOneScore++ : playerTwoScore++;
    udpateScore();
    stopTimer();
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
    finalMessage.innerText = `Unfortunately you both lost!. 😕`;
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
    stopTimer();
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
          resetTimer();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          changePlayer();
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
  startTimer();
});
function countDown() {
  timer--;
  timerEl.innerHTML = timer;
  if (timer == 0) {
    changePlayer();
    resetTimer();
  }
}
function resetTimer() {
  stopTimer();
  timer = 10;
  timerEl.innerHTML = timer;
  startTimer();
}
function startTimer() {
  stopTimer();
  timerId = setInterval(countDown, 1000);
}
function stopTimer() {
  clearInterval(timerId);
}
