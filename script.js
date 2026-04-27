const nomesEspacos = {
  quadra_tenis: "Quadra de Tênis",
  quadra_poliesportiva: "Quadra Poliesportiva",
  salao_festas: "Salão de Festas",
  churrasqueira_lazer: "Churrasqueira Lazer",
  churrasqueira_garagem: "Churrasqueira Garagem"
};

// Persistência
let morador = JSON.parse(localStorage.getItem("moradorAtual")) || null;
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function salvar() {
  localStorage.setItem("moradorAtual", JSON.stringify(morador));
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function msg(tipo, texto) {
  const area = document.getElementById("msgArea");
  if (!area) return;

  const cls = tipo === "ok" ? "alert-success"
            : tipo === "erro" ? "alert-danger"
            : "alert-info";

  area.innerHTML = `
    <div class="alert ${cls} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function definirMorador() {
  const nome = document.getElementById("nome").value.trim();
  const apto = document.getElementById("apto").value.trim();

  if (!nome || !apto) {
    msg("erro", "Preencha nome e apartamento para continuar.");
    return;
  }

  morador = { nome, apto };
  salvar();
  renderMorador();
  msg("ok", `Morador definido: <strong>${nome}</strong> (Apto <strong>${apto}</strong>).`);
}

function trocarMorador() {
  morador = null;
  salvar();
  renderMorador();
  msg("info", "Morador removido. Informe novamente para criar novas reservas.");
}

function renderMorador() {
  const el = document.getElementById("moradorAtual");
  if (!el) return;

  if (!morador) {
    el.textContent = "(nenhum)";
    return;
  }
  el.textContent = `${morador.nome} (Apto ${morador.apto})`;
}

function criarReserva() {
  if (!morador) {
    msg("erro", "Antes de reservar, informe nome e apartamento (Identificação do morador).");
    return;
  }

  const espaco = document.getElementById("espaco").value;
  const data = document.getElementById("data").value;
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;
  const obs = (document.getElementById("obs").value || "").trim();

  if (!data || !inicio || !fim) {
    msg("erro", "Preencha data, horário início e horário fim.");
    return;
  }

  if (inicio >= fim) {
    msg("erro", "O horário final deve ser maior que o horário inicial.");
    return;
  }

  // conflito (somente reservas ATIVAS)
  for (let r of reservas) {
    if (
      r.status === "ativa" &&
      r.espaco === espaco &&
      r.data === data &&
      inicio < r.fim &&
      fim > r.inicio
    ) {
      msg("erro", "Conflito de horário! Já existe reserva ativa nesse período.");
      return;
    }
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
  reservas.push({
    id,
    espaco,
    data,
    inicio,
    fim,
    nome: morador.nome,
    apto: morador.apto,
    obs,
    status: "ativa"
  });

  salvar();
  renderReservas();
  msg("ok", `Reserva criada para <strong>${nomesEspacos[espaco]}</strong> em <strong>${data}</strong>.`);
}

function cancelarReserva(id) {
  const r = reservas.find(x => x.id === id);
  if (!r) return;
  r.status = "cancelada";
  salvar();
  renderReservas();
  msg("info", "Reserva cancelada.");
}

function editarReserva(id) {
  const r = reservas.find(x => x.id === id);
  if (!r || r.status !== "ativa") {
    msg("erro", "Somente reservas ativas podem ser editadas.");
    return;
  }

  // Edição simples via prompts (suficiente para comprovar 'edição' no PI)
  const novoInicio = prompt("Novo horário início (HH:MM):", r.inicio);
  if (!novoInicio) return;
  const novoFim = prompt("Novo horário fim (HH:MM):", r.fim);
  if (!novoFim) return;

  if (novoInicio >= novoFim) {
    msg("erro", "Horário final deve ser maior que o inicial.");
    return;
  }

  // validar conflito ignorando a própria reserva
  for (let x of reservas) {
    if (
      x.id !== r.id &&
      x.status === "ativa" &&
      x.espaco === r.espaco &&
      x.data === r.data &&
      novoInicio < x.fim &&
      novoFim > x.inicio
    ) {
      msg("erro", "Conflito de horário ao editar! Há outra reserva ativa nesse período.");
      return;
    }
  }

  r.inicio = novoInicio;
  r.fim = novoFim;

  salvar();
  renderReservas();
  msg("ok", "Reserva editada com sucesso.");
}

function renderReservas() {
  const tbody = document.getElementById("listaReservas");
  if (!tbody) return;

  const filtroEspaco = (document.getElementById("filtroEspaco")?.value || "");
  const filtroData = (document.getElementById("filtroData")?.value || "");

  const lista = reservas.slice().filter(r => {
    if (filtroEspaco && r.espaco !== filtroEspaco) return false;
    if (filtroData && r.data !== filtroData) return false;
    return true;
  });

  tbody.innerHTML = "";

  lista.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nomesEspacos[r.espaco] || r.espaco}</td>
      <td>${r.data}</td>
      <td>${r.inicio} – ${r.fim}</td>
      <td>${r.nome} (Apto ${r.apto})</td>
      <td>${r.status}</td>
      <td class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="editarReserva('${r.id}')">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="cancelarReserva('${r.id}')">Cancelar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function limparReservas() {
  reservas = [];
  salvar();
  renderReservas();
  msg("info", "Reservas apagadas (modo teste).");
}

// Inicialização
renderMorador();
renderReservas();
``
``
