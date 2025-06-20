function navigate(page) {
  const content = document.getElementById('content');

  if (page === 'home') {
    content.innerHTML = '<h2>Benvenuto in NeoHospital</h2><p>Seleziona una sezione dal menu a sinistra.</p>';
  } else if (page === 'anagrafica') {
    content.innerHTML = `
      <h2>Anagrafica Pazienti</h2>
      <button onclick="showFormPaziente()" style="margin-bottom: 10px;">+ Nuovo Paziente</button>
      <div id="form-container"></div>
      <p>Caricamento dati...</p>
    `;
    loadPazienti();
  } else {
    content.innerHTML = `<h2>${page}</h2><p>Contenuto in costruzione...</p>`;
  }
}

async function loadPazienti() {
  const { data, error } = await supabase.from('anagrafica_pazienti').select('*');

  if (error) {
    document.getElementById('content').innerHTML = '<p>Errore nel caricamento dati.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    document.getElementById('content').innerHTML += '<p>Nessun paziente trovato.</p>';
    return;
  }

  let table = '<table border="1" style="width:100%;margin-top:20px;"><tr><th>Cognome</th><th>Nome</th><th>Codice Fiscale</th></tr>';
  data.forEach(p => {
    table += `<tr><td>${p.cognome}</td><td>${p.nome}</td><td>${p.codice_fiscale}</td></tr>`;
  });
  table += '</table>';

  document.getElementById('content').innerHTML += table;
}

function showFormPaziente() {
  const formHTML = `
    <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
      <label>Cognome: <input type="text" id="cognome"></label><br><br>
      <label>Nome: <input type="text" id="nome"></label><br><br>
      <label>Codice Fiscale: <input type="text" id="codice_fiscale"></label><br><br>
      <button onclick="salvaPaziente()">Salva</button>
      <button onclick="annullaForm()">Annulla</button>
    </div>
  `;
  document.getElementById('form-container').innerHTML = formHTML;
}

function annullaForm() {
  document.getElementById('form-container').innerHTML = '';
}

async function salvaPaziente() {
  const cognome = document.getElementById('cognome').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const codiceFiscale = document.getElementById('codice_fiscale').value.trim();

  if (!cognome || !nome || !codiceFiscale) {
    alert('Compila tutti i campi.');
    return;
  }

  const { error } = await supabase.from('anagrafica_pazienti').insert([
    { cognome, nome, codice_fiscale: codiceFiscale }
  ]);

  if (error) {
    alert('Errore durante il salvataggio.');
    console.error(error);
    return;
  }

  annullaForm();
  loadPazienti();
}

const supabaseUrl = "https://uzukdoqaxkzprqwoudbe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
