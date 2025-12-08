const supabaseUrl = 'https://gqqgumirzeqhbgpwdzcb.supabase.co';
const supabaseAnonKey = 'sb_publishable_eZy_VDCijleReuLyzCy0kw_j8w0CZK4';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const emailForm = document.getElementById('emailForm');
const continueBtn = document.getElementById('continueBtn');
const passwordWrapper = document.getElementById('passwordWrapper');

const walletSection = document.getElementById('wallet');
const balanceEl = document.getElementById('balance');
const reportContent = document.getElementById('reportContent');

const addAppleWalletBtn = document.getElementById('addAppleWallet');
const addGoogleWalletBtn = document.getElementById('addGoogleWallet');
const addSamsungWalletBtn = document.getElementById('addSamsungWallet');

let currentUser = null;

emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  // Prüfen ob User existiert
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return alert(listError.message);

  const exists = users.find(u => u.email === email);

  if (exists) {
    // User existiert → Passwortfeld zeigen, Buttontext ändern
    passwordWrapper.style.display = 'block';
    continueBtn.textContent = 'Login';
    continueBtn.onclick = async () => {
      const password = document.getElementById('password').value;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      currentUser = data.user;
      loadDashboard();
    };
  } else {
    // User existiert nicht → Mail-Link schicken
    const { data, error } = await supabase.auth.signUp({
      email: email,
      options: { emailRedirectTo: 'https://franek2011.github.io/YourWallet/' }
    });
    if (error) return alert(error.message);
    alert('Bestätigungsmail geschickt! Bitte dort Passwort setzen.');
  }
});

// Dashboard laden
async function loadDashboard() {
  document.getElementById('auth').style.display = 'none';
  walletSection.style.display = 'block';

  // Coins laden
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('coins')
    .eq('id', currentUser.id)
    .single();
  if (userError) return console.error(userError);
  balanceEl.textContent = userData.coins;

  // Monatsbericht laden
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (txError) return console.error(txError);

  reportContent.innerHTML = '';
  transactions.forEach(t => {
    reportContent.innerHTML += `${new Date(t.created_at).toLocaleDateString()}: ${t.description} (${t.amount} Coins)<br>`;
  });
}

// Wallet Buttons (Test-Links)
addAppleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addGoogleWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
addSamsungWalletBtn.addEventListener('click', () => { window.location.href = 'https://google.com'; });
