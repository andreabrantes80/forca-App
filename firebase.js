import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  enableIndexedDbPersistence,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB90mBwV_FqDFzsvl7GQV-_kENIRnKEn40",
  authDomain: "game-c2251.firebaseapp.com",
  projectId: "game-c2251",
  storageBucket: "game-c2251.firebasestorage.app",
  messagingSenderId: "888886097403",
  appId: "1:888886097403:web:26b4c392c3cae78a49875e",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.error(
      "Persistência offline não está ativada, múltiplas abas abertas"
    );
  } else if (err.code === "unimplemented") {
    console.error(
      "Persistência offline não está disponível no navegador atual"
    );
  }
});

// Exporta o objeto db para ser utilizado em outros arquivos
export { db, auth };
