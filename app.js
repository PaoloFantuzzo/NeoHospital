const supabaseUrl = "https://uzukdoqaxkzprqwoudbe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
function navigate(page) {
  async function loadPazienti() {
  const { data, error } = await supabase.from('anagrafica_pazienti').select('*');

  if (error) {
    document.getElementById('content').innerHTML = '<p>Errore nel caricamento dati.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    document.getElementById('content').innerHTML = '<p>Nessun paziente trovato.</p>';
    return;
  }

  let table = '<table border="1" style="width:100%;margin-top:20px;"><tr><th>Cognome</th><th>Nome</th><th>Codice Fiscale</th></tr>';
  data.forEach(p => {
    table += `<tr><td>${p.cognome}</td><td>${p.nome}</td><td>${p.codice_fiscale}</td></tr>`;
  });
  table += '</table>';

  document.getElementById('content').innerHTML = '<h2>Anagrafica Pazienti</h2>' + table;
}

  const content = document.getElementById('content');
  if (page === 'home') {
    content.innerHTML = '<h2>Benvenuto su NeoHospital</h2><p>Seleziona una sezione.</p>';
  else if (page === 'anagrafica') {
  content.innerHTML = '<h2>Anagrafica Pazienti</h2><p>Caricamento dati...</p>';
  loadPazienti();
}
  } else if (page === 'ricoveri') {
    content.innerHTML = '<h2>Ricoveri</h2><p>Visualizzazione ricoveri in corso...</p>';
  } else if (page === 'terapia') {
    content.innerHTML = '<h2>Terapia</h2><p>Lista delle terapie assegnate...</p>';
  } else if (page === 'diario') {
    content.innerHTML = '<h2>Diario Clinico</h2><p>Note cliniche in corso...</p>';
  }
}
document.addEventListener('DOMContentLoaded', () => navigate('home'));
