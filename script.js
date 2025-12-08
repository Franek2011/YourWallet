const supabaseUrl = 'https://gqqgumirzeqhbgpwdzcb.supabase.co';
const supabaseAnonKey = 'sb_publishable_eZy_VDCijleReuLyzCy0kw_j8w0CZK4';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const startScreen = document.getElementById('startScreen');
const loadingScreen = document.getElementById('loadingScreen');
const passwordScreen = document.getElementById('passwordScreen');
const walletSection = document.getElementById('wallet');

const emailForm = document.getElementById('emailForm');
const passwordForm = document.getElementById('passwordForm');
const balanceEl = document.getElementById('balance');
const reportContent = document.getElementById('reportContent');

const addAppleWalletBtn = document.getElementById('addAppleWallet');
const addGoogleWalletBtn = document.getElementById('addGoogleWallet');
const addSamsungWalletBtn = document.getElementById('addSamsungWallet');

let currentUser = null;

// Email weiter
emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  // Ladeanimation
  startScreen.style.display = 'none';
  loadingScreen.style.display = 'flex';

  setTimeout(async () => {
    loadingScreen.style.display = 'none';

    // Prüfen, ob User existiert
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: ''
    });

    if (error && error.message.includes("Invalid login credentials")) {
      // Passwort noch nicht gesetzt → Passwortscreen zeigen
      passwordScreen.style.display = 'flex';
      currentUser = { email };
    } else {
      // Login erfolgreich
      currentUser = data.user;
      loadDashboard();
    }
  }, 2000);
});

// Passwort setzen/Login
passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const email = currentUser.email;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  currentUser = data.user;
  passwordScreen.style.display = 'none';
  loadDashboard();
});

// Dashboard laden
async function loadDashboard() {
  walletSection.style.display = 'block';

  // Coins laden
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('coins')
    .eq('id', currentUser.id)
    .single();
  if (!userError) balanceEl.textContent = userData.coins;

  // Monatsbericht laden
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

// Wallet Buttons (Test-Links)
addAppleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addGoogleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addSamsungWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
