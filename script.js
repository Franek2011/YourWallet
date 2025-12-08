const supabaseUrl = 'DEINE_SUPABASE_URL';
const supabaseAnonKey = 'DEIN_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');
const walletSection = document.getElementById('wallet');
const balanceEl = document.getElementById('balance');
const reportContent = document.getElementById('reportContent');
const addAppleWalletBtn = document.getElementById('addAppleWallet');
const addGoogleWalletBtn = document.getElementById('addGoogleWallet');

// Samsung Wallet Button hinzufügen
const addSamsungWalletBtn = document.createElement('button');
addSamsungWalletBtn.id = 'addSamsungWallet';
addSamsungWalletBtn.textContent = 'Add to Samsung Wallet';
walletSection.appendChild(addSamsungWalletBtn);

let currentUser = null;

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

// Register
registerBtn.addEventListener('click', async () => {
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const { data, error } = await supabase.auth.signUp({ email, password });
if (error) return alert(error.message);
alert('Registrierung erfolgreich! Bitte logge dich ein.');
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

// Wallet Buttons
addAppleWalletBtn.addEventListener('click', () => {
window.location.href = 'DEINE_PKPASS_URL';
});
addGoogleWalletBtn.addEventListener('click', () => {
window.location.href = 'DEINE_JWT_URL';
});
addSamsungWalletBtn.addEventListener('click', () => {
window.location.href = 'DEINE_SAMSUNG_WALLET_URL';
});
