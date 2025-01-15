import { db } from "./firebase.js";
import getWord from "./words.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const contentBtns = document.querySelector(".btns");
const contentGuessWords = document.querySelector(".guess-words");
const img = document.querySelector("img");
const contentClue = document.querySelector(".clue");
const btnNew = document.querySelector(".new");
const wordTypeSelect = document.getElementById("wordType");
const scoreElement = document.getElementById("score");
const fireworksContainer = document.getElementById("fireworks-container");
const accessCountElement = document.getElementById("access-count");
const accessLastScoreElement = document.getElementById("last-score");

btnNew.onclick = () => restart();
wordTypeSelect.onchange = () => changeWordType();

let indexImg;
let accessCount;
let lastscoreCount;
let score;

init();
document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();
  updateAccessCount();
  displayPreviousScore();
  updateLastScore();
});

async function initializeData() {
  try {
    const accessDoc = doc(db, "gameData", "accessCount");
    const scoreDoc = doc(db, "gameData", "score");
    const lastScoreDoc = doc(db, "gameData", "lastscore");

    const acessSnapshot = await getDoc(accessDoc);
    const scoreSnapshot = await getDoc(scoreDoc);
    const lastScoreSnapshot = await getDoc(lastScoreDoc);

    if (acessSnapshot.exists()) {
      accessCount = acessSnapshot.data().count;
      console.log(`Access count: ${accessCount}`);
    } else {
      console.error("Documento 'accessCount' não encontrado!");
      accessCount = 0;
      await setDoc(accessDoc, { count: accessCount });
      console.log("Documento 'accessCount' criado");
    }

    if (scoreSnapshot.exists()) {
      score = scoreSnapshot.data().count;
    } else {
      score = 0;
      await setDoc(scoreDoc, { count: score });
      console.log("Documento 'score' criado");
    }
    if (lastScoreSnapshot.exists()) {
      lastscoreCount = lastScoreSnapshot.data().count;
      accessLastScoreElement.textContent = `Última Pontuação: ${lastscoreCount}`;
    } else {
      lastscoreCount = 0;
      await setDoc(lastScoreDoc, { count: lastscoreCount });
      console.log("Documento 'latscore' criado");
    }
  } catch (error) {
    console.error("Erro ao inicializar os dados:", error);
  }
}

async function updateAccessCount() {
  try {
    accessCount++;
    const accessDoc = doc(db, "gameData", "accessCount");
    await updateDoc(accessDoc, { count: increment(1) });
    console.log(`Access count atualizado para: ${accessCount}`);
    accessCountElement.textContent = `Acessos: ${accessCount}`;
  } catch (error) {
    console.error("Erro ao atualizar o contador de acessos:", error);
  }
}

// async function updateLastScore() {
//   try {
//     const lastScoreDoc = doc(db, "gameData", "lastscore");
//     const lastScoreSnapshot = await getDoc(lastScoreDoc);
//     if (lastScoreSnapshot.exists()) {
//       const lastScore = lastScoreSnapshot.data().count;
//       if (score > lastScore) {
//         await updateDoc(lastScoreDoc, { count: score });
//         console.log(`Última pontuação atualizada para: ${score}`);
//         accessLastScoreElement.textContent = `Última Pontuação: ${lastscoreCount}`;
//       } else {
//         console.log("A nova pontuação não é maior que a pontuação anterior.");
//         // accessLastScoreElement.textContent = `Última Pontuação: ${lastscoreCount}`;
//       }
//     } else {
//       console.error("Documento 'lastscore' não encontrado!");
//     }
//   } catch (error) {
//     console.error("Erro ao atualizar a última pontuação:", error);
//   }
// }

async function updateLastScore() {
  try {
    document.getElementById("loading-spinner").style.display = "block";
    const lastScoreDoc = doc(db, "gameData", "lastscore");

    console.log(`Score atual: ${score}`);
    console.log(`Última pontuação registrada: ${lastscoreCount}`);

    if (score > lastscoreCount) {
      lastscoreCount = score;
      await updateDoc(lastScoreDoc, { count: lastscoreCount });
      console.log(`Última pontuação atualizada para: ${lastscoreCount}`);
      accessLastScoreElement.textContent = `Última Pontuação: ${lastscoreCount}`;
    } else {
      console.log("A nova pontuação não é maior que a pontuação anterior.");
    }
  } catch (error) {
    console.error("Erro ao atualizar a última pontuação:", error);
  } finally {
    document.getElementById("loading-spinner").style.display = "none";
  }
}
async function updateScoreinFirebase() {
  try {
    const scoreDoc = doc(db, "gameData", "score");
    await updateDoc(scoreDoc, { count: score });
    console.log(`Pontuação atualizada no Firestore: ${score}`);
    scoreElement.textContent = score;
    updateLastScore();
  } catch (error) {
    console.error("Erro ao atualizar a pontuação no Firestore:", error);
  }
}

async function resetScoreInFirebase() {
  try {
    const scoreDoc = doc(db, "gameData", "score");
    await setDoc(scoreDoc, { count: 0 });
    score = 0;
    scoreElement.textContent = 0;
  } catch (error) {
    console.error("Erro ao resetar a pontuação no Firestore:", error);
  }
}

function displayPreviousScore() {
  console.log("Recuperando última pontuação...");
  if (typeof lastscoreCount !== "undefined") {
    alert(`Bem-vindo de volta! Sua última pontuação foi: ${lastscoreCount}`);
    console.log(`Última pontuação recuperada: ${lastscoreCount}`);
  } else {
    console.log("Não foi possível recuperar a última pontuação.");
    alert(
      "Bem-vindo de volta! Não foi possível recuperar sua última pontuação."
    );
  }
}
function updateScore() {
  scoreElement.textContent = score;
  updateScoreinFirebase(score);
  if (score % 10 === 0 && score > 0) {
    showFireworks();
  }
}

const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink"];

function init() {
  indexImg = 1;
  img.src = `img1.png`;
  generateGuessSection();
  generateButtons();
}

function restart() {
  resetScoreInFirebase();
  init();
}

function changeWordType() {
  generateGuessSection();
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
    score++;
    updateScore();
    setTimeout(() => {
      if (score % 10 === 0) {
        alert(`Parabéns! Você acertou ${score} palavras!`);
      }
      init();
    }, 100);
  }
}

function wrongAnswer() {
  indexImg++;
  img.src = `img${indexImg}.png`;

  if (indexImg === 7) {
    score = 0;
    updateScore();
    updateLastScore();
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
