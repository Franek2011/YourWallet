const supabaseUrl = 'https://gqqgumirzeqhbgpwdzcb.supabase.co';
const supabaseAnonKey = 'sb_publishable_eZy_VDCijleReuLyzCy0kw_j8w0CZK4';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const emailForm = document.getElementById('emailForm');
const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');

const startScreen = document.getElementById('startScreen');
const loadingScreen = document.getElementById('loadingScreen');
const authSection = document.getElementById('auth');
const walletSection = document.getElementById('wallet');

const balanceEl = document.getElementById('balance');
const reportContent = document.getElementById('reportContent');

const addAppleWalletBtn = document.getElementById('addAppleWallet');
const addGoogleWalletBtn = document.getElementById('addGoogleWallet');
const addSamsungWalletBtn = document.getElementById('addSamsungWallet');

let currentUser = null;

// Schritt 1: E-Mail eingeben
emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  // Ladebildschirm einblenden
  startScreen.style.display = 'none';
  loadingScreen.style.display = 'block';

  setTimeout(() => {
    loadingScreen.style.display = 'none';
    authSection.style.display = 'block';
  }, 2000); // 2 Sekunden Ladezeit

  // Optional: hier prüfen, ob User existiert und Passwortfeld anpassen
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  currentUser = data.user;
  loadDashboard();
});

// Registrierung
registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    options: {
      emailRedirectTo: 'https://franek2011.github.io/YourWallet/'
    }
  });

  if (error) return alert(error.message);
  alert('Bestätigungsmail geschickt! Bitte dort Passwort setzen.');
});

// Dashboard laden
async function loadDashboard() {
  authSection.style.display = 'none';
  walletSection.style.display = 'block';

  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('coins')
    .eq('id', currentUser.id)
    .single();
  if (!userError) balanceEl.textContent = userData.coins;

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (!txError) {
    reportContent.innerHTML = '';
    transactions.forEach(t => {
      reportContent.innerHTML += `${new Date(t.created_at).toLocaleDateString()}: ${t.description} (${t.amount} Coins)<br>`;
    });
  }
}

// Wallet Buttons (Testlinks)
addAppleWalletBtn.addEventListener('click', () => window.location.href = 'https://google.com');
addGoogleWalletBtn.addEventListener('click', () => window.location.href = 'https://google.com');
addSamsungWalletBtn.addEventListener('click', () => window.location.href = 'https://google.com');
