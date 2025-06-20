window.onload = function () {
  const supabaseUrl = "https://uzukdoqaxkzprqwoudbe.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  // Stato attuale scheda e sottoscheda aperte
  let schedaAperta = null;
  let subSchedaAperta = null;

  // Naviga tra le pagine principali
  window.navigate = function (page) {
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
      // reset eventuale stato cartella
      document.getElementById("cartella-ricovero").style.display = "none";
    }

    if (page !== "cartella-ricovero") {
      document.getElementById("cartella-ricovero").style.display = "none";
    }
  };

  // Apri scheda principale nella cartella ricovero
  window.openScheda = function (id) {
    if (schedaAperta) {
      document.getElementById(schedaAperta).style.display = "none";
    }
    schedaAperta = id;
    document.getElementById(id).style.display = "block";

    // Nascondi eventuali sottoschede quando cambio scheda
    if (subSchedaAperta) {
      document.getElementById(subSchedaAperta).style.display = "none";
      subSchedaAperta = null;
    }
  };

  // Apri sottoscheda nelle schede Diari o Valutazioni
  window.openSubScheda = function (id) {
    if (subSchedaAperta) {
      document.getElementById(subSchedaAperta).style.display = "none";
    }
    subSchedaAperta = id;
    document.getElementById(id).style.display = "block";
  };

  // Carica elenco ricoveri da Supabase
  async function loadRicoveri() {
    const { data, error } = await client.from("ricoveri").select("*, paziente:anagrafica_pazienti(*)");
    const tbody = document.getElementById("ricoveri-body");
    tbody.innerHTML = "";

    if (error) {
      tbody.innerHTML = `<tr><td colspan="5">Errore caricamento ricoveri: ${error.message}</td></tr>`;
      return;
    }

    if (!data || data.length === 0) {
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
        <td><button onclick='apriCartellaRicovero(${JSON.stringify(ricovero).replace(/'/g, "\\'")})'>Apri</button></td>
      `;
      tbody.appendChild(riga);
    });
  }

  // Apri cartella ricovero con i dettagli
  window.apriCartellaRicovero = function (ricovero) {
    navigate("cartella-ricovero");

    // Visualizza dati anagrafica
    const anagraficaDiv = document.getElementById("scheda-anagrafica");
    anagraficaDiv.innerHTML = `
      <p><strong>Nome:</strong> ${ricovero.paziente.nome}</p>
      <p><strong>Cognome:</strong> ${ricovero.paziente.cognome}</p>
      <p><strong>Codice Fiscale:</strong> ${ricovero.paziente.codice_fiscale}</p>
      <p><strong>Reparto:</strong> ${ricovero.reparto || ""}</p>
      <p><strong>Stanza:</strong> ${ricovero.stanza || ""}</p>
      <p><strong>Letto:</strong> ${ricovero.letto || ""}</p>
    `;

    // Apri scheda Anagrafica come default
    openScheda("scheda-anagrafica");
  };

  // Avvio con pagina Home
  navigate("home");

  // Link menù laterale
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
};
