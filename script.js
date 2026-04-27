const nomesEspacos = {
  quadra_tenis: "Quadra de Tênis",
  quadra_poliesportiva: "Quadra Poliesportiva",
  salao_festas: "Salão de Festas",
  churrasqueira_lazer: "Churrasqueira Lazer",
  churrasqueira_garagem: "Churrasqueira Garagem"
};
``
let reservas = [];
let morador = null;

function definirMorador() {
  const nome = document.getElementById("nome").value.trim();
  const apto = document.getElementById("apto").value.trim();

  if (!nome || !apto) {
    alert("Preencha nome e apartamento.");
    return;
  }

  morador = { nome, apto };
  document.getElementById("moradorAtual").innerText =
    `Morador atual: ${nome} (Apto ${apto})`;
}

function criarReserva() {
  if (!morador) {
    alert("Antes de reservar, informe seu nome e apartamento.");
    return;
  }

  const espaco = document.getElementById("espaco").value;
  const data = document.getElementById("data").value;
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;

  if (!data || !inicio || !fim) {
    alert("Preencha data e horários.");
    return;
  }

  for (let r of reservas) {
    if (
      r.espaco === espaco &&
      r.data === data &&
      inicio < r.fim &&
      fim > r.inicio
    ) {
      alert("Conflito de horário!");
      return;
    }
  }

  reservas.push({
    espaco,
    data,
    inicio,
    fim,
    nome: morador.nome,
    apto: morador.apto
  });

  atualizarLista();
}

function atualizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  reservas.forEach((r) => {
    const item = document.createElement("li");
    item.textContent =
       `${nomesEspacos[r.espaco]} - ${r.data} ` +
      `(${r.inicio} às ${r.fim}) | ` +
      `${r.nome} (Apto ${r.apto})`;
    lista.appendChild(item)
;
  });
}
``
