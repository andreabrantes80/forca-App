import getWord from "./words.js";

const contentBtns = document.querySelector(".btns");
const contentGuessWords = document.querySelector(".guess-words");
const img = document.querySelector("img");
const contentClue = document.querySelector(".clue");
const btnNew = document.querySelector(".new");
const wordTypeSelect = document.getElementById("wordType");
const scoreElement = document.getElementById("score");
const fireworksContainer = document.getElementById("fireworks-container");

btnNew.onclick = () => init();

let indexImg;
let currentScore = 0;
let previousScore = localStorage.getItem("score")
  ? parseInt(localStorage.getItem("score"))
  : 0;
document.addEventListener("DOMContentLoaded", () => {
  alert(`Bem-vindo de volta! Sua última pontuação foi: ${previousScore}`);
});

const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink"];

init();

function init() {
  indexImg = 1;
  img.src = `img1.png`;

  generateGuessSection();
  generateButtons();
  updateScore();
}

function generateGuessSection() {
  contentGuessWords.textContent = "";

  const { word, clue } = getWord(wordTypeSelect.value);
  const wordWdthoutAccent = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  Array.from(wordWdthoutAccent).forEach((letter) => {
    const span = document.createElement("span");

    span.textContent = "_";
    span.setAttribute("word", letter.toUpperCase());
    contentGuessWords.appendChild(span);
  });

  contentClue.textContent = `Dica: ${clue}`;
}

function verifyLetter(letter) {
  const arr = document.querySelectorAll(`[word="${letter}"]`);

  if (!arr.length) wrongAnswer();

  arr.forEach((e) => {
    e.textContent = letter;
  });

  const spans = document.querySelectorAll(`.guess-words span`);

  const won = !Array.from(spans).find((span) => span.textContent === "_");

  if (won) {
    currentScore++;
    updateScore();
    setTimeout(() => {
      if (currentScore % 10 === 0) {
        alert(`Parabéns! Você acertou ${currentScore} palavras!`);
      }
      init();
    }, 100);
  }
}

function wrongAnswer() {
  indexImg++;
  img.src = `img${indexImg}.png`;

  if (indexImg === 7) {
    currentScore = 0;
    updateScore();
    setTimeout(() => {
      alert("Perdeu :/");
      init();
    }, 100);
  }
}

// Usando a tabela ASC para criar as letras
function generateButtons() {
  contentBtns.textContent = "";

  for (let i = 97; i < 123; i++) {
    const btn = document.createElement("button");
    const letter = String.fromCharCode(i).toUpperCase();
    btn.textContent = letter;

    btn.onclick = () => {
      btn.disabled = true;
      btn.style.backgroundColor = "gray";
      verifyLetter(letter);
    };

    contentBtns.appendChild(btn);
  }
}

function updateScore() {
  scoreElement.textContent = currentScore;
  localStorage.setItem("score", currentScore);
  if (currentScore % 10 === 0 && currentScore > 0) {
    showFireworks();
  }
}

function showFireworks() {
  fireworksContainer.style.display = "flex";
  for (let i = 0; i < 50; i++) {
    const firework = document.createElement("div");
    firework.classList.add("firework");
    firework.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    fireworksContainer.appendChild(firework);
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    setTimeout(() => {
      firework.remove();
      fireworksContainer.style.display = "none";
    }, 6000);
  }
}
