// Collegamento a Supabase
const SUPABASE_URL = "https://uzukdoqaxkzprqwoudbe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dWtkb3FheGt6cHJxd291ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzgyNDYsImV4cCI6MjA2NTgxNDI0Nn0.-aJjM8EEOU8VSZ3xmGcG3DV75OCRSkeLgLvoipi2z8w";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test di connessione: legge la tabella "reparti"
document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase.from("reparti").select("*");

  if (error) {
    document.body.innerHTML += `<p style="color:red;">Errore Supabase: ${error.message}</p>`;
    console.error("Errore Supabase:", error);
  } else {
    document.body.innerHTML += `<h3>Reparti (dati Supabase):</h3>`;
    document.body.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
});
