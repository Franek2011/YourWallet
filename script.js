const supabaseUrl = 'https://gqqgumirzeqhbgpwdzcb.supabase.co';
const supabaseAnonKey = 'sb_publishable_eZy_VDCijleReuLyzCy0kw_j8w0CZK4';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const loader = document.getElementById('loader');

const authScreen = document.getElementById('auth-screen');
const passwordScreen = document.getElementById('password-screen');
const walletScreen = document.getElementById('wallet-screen');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const emailNextBtn = document.getElementById('emailNextBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

const balanceEl = document.getElementById('balance');
const reportContent = document.getElementById('reportContent');

const addAppleWalletBtn = document.getElementById('addAppleWallet');
const addGoogleWalletBtn = document.getElementById('addGoogleWallet');
const addSamsungWalletBtn = document.getElementById('addSamsungWallet');

let currentUser = null;

// Hilfsfunktion: Ladeanzeige
function showLoader(sec = 2) {
  loader.classList.remove('hidden');
  return new Promise(resolve => setTimeout(() => {
    loader.classList.add('hidden');
    resolve();
  }, sec * 1000));
}

// Schritt 1: E-Mail prüfen
emailNextBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if(!email) return alert('Bitte E-Mail eingeben!');
  await showLoader(2);

  // Prüfen, ob User schon existiert
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', email);

  if(error) return alert(error.message);

  authScreen.classList.add('hidden');
  passwordScreen.classList.remove('hidden');

  if(users.length === 0) {
    // Neuer User → Registrierung
    passwordScreen.querySelector('p').innerText = "Du bist neu? Klicke 'Registrieren', um E-Mail zu bestätigen.";
    passwordInput.style.display = 'none';
  } else {
    // User existiert → Passwortfeld sichtbar
    passwordScreen.querySelector('p').innerText = "Bitte Passwort eingeben:";
    passwordInput.style.display = 'block';
  }
});

// Login
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if(!email || !password) return alert('Bitte E-Mail und Passwort eingeben!');

  await showLoader(2);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if(error) return alert(error.message);

  currentUser = data.user;
  loadDashboard();
});

// Registrierung
registerBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if(!email) return alert('Bitte E-Mail eingeben!');

  await showLoader(2);
  const { data, error } = await supabase.auth.signUp({
    email,
    options: {
      emailRedirectTo: window.location.href
    }
  });
  if(error) return alert(error.message);
  alert('Bestätigungsmail geschickt! Bitte dort Passwort setzen.');
});

// Dashboard laden
async function loadDashboard() {
  passwordScreen.classList.add('hidden');
  walletScreen.classList.remove('hidden');

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('coins')
    .eq('username', emailInput.value)
    .single();

  if(userError) return console.error(userError);
  balanceEl.textContent = userData?.coins || 0;

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userData?.id)
    .order('date', { ascending: false });

  if(txError) return console.error(txError);

  reportContent.innerHTML = '';
  transactions.forEach(t => {
    reportContent.innerHTML += `${new Date(t.date).toLocaleDateString()}: ${t.type} (${t.amount} Coins)<br>`;
  });
}

// Wallet Buttons (Test-Links)
addAppleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addGoogleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addSamsungWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
