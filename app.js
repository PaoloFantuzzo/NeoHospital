window.onload = function () {
  const supabaseUrl = "https://uzukdoqaxkzprqwoudbe.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  function navigate(page) {
    const content = document.getElementById('content');
    document.getElementById('content').innerHTML = '';

    if (page === 'home') {
      content.innerHTML = '<h2>Benvenuto in NeoHospital</h2><p>Seleziona una sezione dal menu a sinistra.</p>';
    } else if (page === 'anagrafica') {
      content.innerHTML = `
        <h2>Anagrafica Pazienti</h2>
        <button onclick="showFormPaziente()" style="margin-bottom: 10px;">+ Nuovo Paziente</button>
        <div id="form-container"></div>
        <div id="pazienti-table"><p>Caricamento dati...</p></div>
      `;
      loadPazienti();
    } else if (page === 'farmaci') {
      content.innerHTML = `
        <h2>Farmaci</h2>
        <button onclick="showFormFarmaco()" style="margin-bottom: 10px;">+ Nuovo Farmaco</button>
        <div id="form-farmaco"></div>
        <div id="farmaci-table"><p>Caricamento dati...</p></div>
      `;
      loadFarmaci();
    } else {
      content.innerHTML = `<h2>${page}</h2><p>Contenuto in costruzione...</p>`;
    }
  }

  async function loadPazienti() {
    const { data, error } = await client.from('anagrafica_pazienti').select('*');
    const container = document.getElementById('pazienti-table');

    if (error) {
      container.innerHTML = '<p>Errore nel caricamento dati.</p>';
      console.error(error);
      return;
    }

    if (data.length === 0) {
      container.innerHTML = '<p>Nessun paziente trovato.</p>';
      return;
    }

    let table = '<table border="1" style="width:100%;margin-top:20px;"><tr><th>Cognome</th><th>Nome</th><th>Codice Fiscale</th></tr>';
    data.forEach(p => {
      table += `<tr><td>${p.cognome}</td><td>${p.nome}</td><td>${p.codice_fiscale}</td></tr>`;
    });
    table += '</table>';
    container.innerHTML = table;
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

  window.salvaPaziente = async function () {
    const cognome = document.getElementById('cognome').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const codiceFiscale = document.getElementById('codice_fiscale').value.trim();

    if (!cognome || !nome || !codiceFiscale) {
      alert('Compila tutti i campi.');
      return;
    }

    const { error } = await client.from('anagrafica_pazienti').insert([
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

  window.showFormPaziente = showFormPaziente;
  window.annullaForm = annullaForm;

  function showFormFarmaco() {
    const formHTML = `
      <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
        <label>Principio Attivo: <input type="text" id="principio_attivo"></label><br><br>
        <label>Forma Farmaceutica: 
          <select id="forma_farmaceutica">
            <option value="">-- Seleziona --</option>
            <option value="cpr">cpr</option>
            <option value="cpr riv">cpr riv</option>
            <option value="cps">cps</option>
            <option value="gtt">gtt</option>
            <option value="cpr orodispersibile">cpr orodispersibile</option>
            <option value="fl">fl</option>
            <option value="flac">flac</option>
            <option value="supp">supp</option>
            <option value="cerotto">cerotto</option>
          </select>
        </label><br><br>
        <label>Triturabile: 
          <select id="triturabile">
            <option value="Sì">Sì</option>
            <option value="No">No</option>
          </select>
        </label><br><br>
        <label><input type="checkbox" id="nominativo"> Nominativo (per singolo paziente)</label><br><br>
        <label>Unità per Confezione: <input type="number" id="unita_per_confezione"></label><br><br>
        <label>Raccomandazioni: <textarea id="raccomandazioni"></textarea></label><br><br>
        <label>Avvertenze per Operatori: <textarea id="avvertenze_operatori"></textarea></label><br><br>
        <button onclick="salvaFarmaco()">Salva</button>
        <button onclick="annullaFormFarmaco()">Annulla</button>
      </div>
    `;
    document.getElementById('form-farmaco').innerHTML = formHTML;
  }

  function annullaFormFarmaco() {
    document.getElementById('form-farmaco').innerHTML = '';
  }

  window.salvaFarmaco = async function () {
    const principio = document.getElementById('principio_attivo').value.trim();
    const forma = document.getElementById('forma_farmaceutica').value;
    const triturabile = document.getElementById('triturabile').value;
    const nominativo = document.getElementById('nominativo').checked;
    const unita = parseInt(document.getElementById('unita_per_confezione').value);
    const raccomandazioni = document.getElementById('raccomandazioni').value.trim();
    const avvertenze = document.getElementById('avvertenze_operatori').value.trim();

    if (!principio) {
      alert('Il principio attivo è obbligatorio.');
      return;
    }

    const { error } = await client.from('farmaci').insert([
      {
        principio_attivo: principio,
        forma_farmaceutica: forma || null,
        triturabile,
        nominativo,
        unita_per_confezione: isNaN(unita) ? null : unita,
        raccomandazioni: raccomandazioni || null,
        avvertenze_operatori: avvertenze || null
      }
    ]);

    if (error) {
      alert('Errore durante il salvataggio del farmaco.');
      console.error(error);
      return;
    }

    annullaFormFarmaco();
    loadFarmaci();
  }

  async function loadFarmaci() {
    const { data, error } = await client.from('farmaci').select('*');
    const container = document.getElementById('farmaci-table');

    if (error) {
      container.innerHTML = '<p>Errore nel caricamento dati.</p>';
      console.error(error);
      return;
    }

    if (data.length === 0) {
      container.innerHTML = '<p>Nessun farmaco registrato.</p>';
      return;
    }

    let table = '<table border="1" style="width:100%;margin-top:20px;"><tr><th>Principio Attivo</th><th>Forma</th><th>Triturabile</th><th>Nominativo</th><th>Unità/Conf.</th><th>Raccomandazioni</th><th>Avvertenze Operatori</th></tr>';
    data.forEach(f => {
      table += `<tr>
        <td>${f.principio_attivo}</td>
        <td>${f.forma_farmaceutica || ''}</td>
        <td>${f.triturabile}</td>
        <td>${f.nominativo ? '✔️' : ''}</td>
        <td>${f.unita_per_confezione || ''}</td>
        <td>${f.raccomandazioni || ''}</td>
        <td>${f.avvertenze_operatori || ''}</td>
      </tr>`;
    });
    table += '</table>';
    container.innerHTML = table;
  }

  window.showFormFarmaco = showFormFarmaco;
  window.annullaFormFarmaco = annullaFormFarmaco;
  window.navigate = navigate;

  const links = [
    ['home-link', 'home'],
    ['anagrafica-link', 'anagrafica'],
    ['ricoveri-link', 'ricoveri'],
    ['terapia-link', 'terapia'],
    ['diario-link', 'diario'],
    ['parametri-link', 'parametri'],
    ['schede-link', 'schede'],
    ['agenda-link', 'agenda'],
    ['farmaci-link', 'farmaci']
  ];
  links.forEach(([id, page]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        navigate(page);
      });
    }
  });

  navigate('home');
};
