document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM completamente caricato');

  const supabaseUrl = "https://uzukdoqaxkzprqwoudbe.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  let schedaAperta = null;
  let subSchedaAperta = null;

  window.navigate = function (page) {
    console.log(`Navigazione a pagina: ${page}`);
    const sezioni = document.querySelectorAll(".view");
    sezioni.forEach((sec) => {
      sec.style.display = sec.id === page ? "block" : "none";
    });

    if (page === "ricoveri") {
      loadRicoveri();
    }

    if (page === "home") {
      schedaAperta = null;
      subSchedaAperta = null;
      document.getElementById("cartella-ricovero").style.display = "none";
    }

    if (page !== "cartella-ricovero") {
      document.getElementById("cartella-ricovero").style.display = "none";
    }
  };

  window.openScheda = function (id) {
    console.log(`Apro scheda: ${id}`);
    if (schedaAperta) {
      document.getElementById(schedaAperta).style.display = "none";
    }
    schedaAperta = id;
    document.getElementById(id).style.display = "block";

    if (subSchedaAperta) {
      document.getElementById(subSchedaAperta).style.display = "none";
      subSchedaAperta = null;
    }
  };

  window.openSubScheda = function (id) {
    console.log(`Apro sottoscheda: ${id}`);
    if (subSchedaAperta) {
      document.getElementById(subSchedaAperta).style.display = "none";
    }
    subSchedaAperta = id;
    document.getElementById(id).style.display = "block";
  };

  async function loadRicoveri() {
    console.log('Carico ricoveri da Supabase...');
    const { data, error } = await client
      .from("ricoveri")
      .select("*, paziente:anagrafica_pazienti(*)");
    const tbody = document.getElementById("ricoveri-body");
    tbody.innerHTML = "";

    if (error) {
      console.error('Errore caricamento ricoveri:', error);
      tbody.innerHTML = `<tr><td colspan="5">Errore caricamento ricoveri: ${error.message}</td></tr>`;
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nessun ricovero trovato');
      tbody.innerHTML = "<tr><td colspan='5'>Nessun ricovero attivo</td></tr>";
      return;
    }

    data.forEach((ricovero) => {
      const riga = document.createElement("tr");
      riga.innerHTML = `
        <td>${ricovero.paziente.nome}</td>
        <td>${ricovero.paziente.cognome}</td>
        <td>${ricovero.reparto || ""}</td>
        <td>${ricovero.stanza || ""} / ${ricovero.letto || ""}</td>
        <td><button onclick='apriCartellaRicovero(${JSON.stringify(
          ricovero
        ).replace(/'/g, "\\'")})'>Apri</button></td>
      `;
      tbody.appendChild(riga);
    });
  }

  window.apriCartellaRicovero = function (ricovero) {
    console.log('Apro cartella ricovero:', ricovero);
    navigate("cartella-ricovero");

    const anagraficaDiv = document.getElementById("scheda-anagrafica");
    anagraficaDiv.innerHTML = `
      <p><strong>Nome:</strong> ${ricovero.paziente.nome}</p>
      <p><strong>Cognome:</strong> ${ricovero.paziente.cognome}</p>
      <p><strong>Codice Fiscale:</strong> ${ricovero.paziente.codice_fiscale}</p>
      <p><strong>Reparto:</strong> ${ricovero.reparto || ""}</p>
      <p><strong>Stanza:</strong> ${ricovero.stanza || ""}</p>
      <p><strong>Letto:</strong> ${ricovero.letto || ""}</p>
    `;

    openScheda("scheda-anagrafica");
  };

  navigate("home");

  const links = [
    ["home-link", "home"],
    ["anagrafica-link", "pazienti"],
    ["ricoveri-link", "ricoveri"],
    ["agenda-link", "agenda"],
    ["farmaci-link", "farmaci"],
  ];
  links.forEach(([id, page]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(page);
      });
    }
  });
});
