function navigate(page) {
  const content = document.getElementById('content');
  if (page === 'home') {
    content.innerHTML = '<h2>Benvenuto su NeoHospital</h2><p>Seleziona una sezione.</p>';
  } else if (page === 'anagrafica') {
    content.innerHTML = '<h2>Anagrafica Pazienti</h2><p>Dati caricati da Supabase...</p>';
  } else if (page === 'ricoveri') {
    content.innerHTML = '<h2>Ricoveri</h2><p>Visualizzazione ricoveri in corso...</p>';
  } else if (page === 'terapia') {
    content.innerHTML = '<h2>Terapia</h2><p>Lista delle terapie assegnate...</p>';
  } else if (page === 'diario') {
    content.innerHTML = '<h2>Diario Clinico</h2><p>Note cliniche in corso...</p>';
  }
}
document.addEventListener('DOMContentLoaded', () => navigate('home'));
