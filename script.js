import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDO14kBC-P6K08cYuhgxlAV-c_lHxbP244",
  authDomain: "studiohemaagendamentos.firebaseapp.com",
  projectId: "studiohemaagendamentos",
  storageBucket: "studiohemaagendamentos.firebasestorage.app",
  messagingSenderId: "61758217017",
  appId: "1:61758217017:web:63dad6f7c6dd3f2a72e6e8",
  measurementId: "G-LWRYWS4GMN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const confirmacao = document.getElementById('confirmacao');
const agendamentosDiv = document.getElementById('agendamentos');
const form = document.getElementById('formAgendamento');
const dataInput = document.getElementById('data');
const horaSelect = document.getElementById('hora');

const agendamentoArea = document.getElementById('agendamentoArea');
const loginArea = document.getElementById('loginArea');
const painelArea = document.getElementById('painelArea');

const hoje = new Date().toISOString().split("T")[0];
dataInput.min = hoje;

function gerarHorarios() {
  horaSelect.innerHTML = "";
  for (let h = 6; h <= 22; h++) {
    const hora = h.toString().padStart(2, '0') + ":00";
    horaSelect.innerHTML += `<option>${hora}</option>`;
  }
}

dataInput.addEventListener('change', () => {
  const dia = new Date(dataInput.value).getDay();
  if (dia === 1) {
    alert("Agendamentos apenas de terça a domingo.");
    dataInput.value = "";
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const servico = document.getElementById('servico').value;
  const profissional = document.getElementById('profissional').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const agendamento = { nome, servico, profissional, data, hora };
  await push(ref(db, 'agendamentos'), agendamento);

  confirmacao.style.display = "block";
  confirmacao.innerHTML = `<strong>Agendamento confirmado!</strong><br>Nome: ${nome}<br>Serviço: ${servico}<br>Profissional: ${profissional}<br>Data: ${data}<br>Hora: ${hora}`;

  form.reset();
  gerarHorarios();
});

function mostrarLogin() {
  agendamentoArea.classList.add("hidden");
  loginArea.classList.remove("hidden");
}

function voltar() {
  loginArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
}

function fazerLogin() {
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
  const erro = document.getElementById('loginErro');

  if ((user === "mayra" || user === "karina") && pass === "studiohema") {
    loginArea.classList.add("hidden");
    painelArea.classList.remove("hidden");
    carregarAgendamentos();
  } else {
    erro.style.display = "block";
  }
}

function carregarAgendamentos() {
  onValue(ref(db, 'agendamentos'), (snapshot) => {
    agendamentosDiv.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const a = childSnapshot.val();
      agendamentosDiv.innerHTML += `
        <div class="agenda-item">
          <strong>${a.nome}</strong> - ${a.servico}<br>
          Profissional: ${a.profissional}<br>
          Data: ${a.data} às ${a.hora}
        </div>`;
    });
  });
}

function logout() {
  painelArea.classList.add("hidden");
  agendamentoArea.classList.remove("hidden");
}

window.onload = gerarHorarios;
