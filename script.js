// Einfacher Coin-Mechanismus
let balance = 0;

const balanceEl = document.getElementById('balance');
const earnBtn = document.getElementById('earnCoins');
const reportContent = document.getElementById('reportContent');

earnBtn.addEventListener('click', () => {
  const earned = Math.floor(Math.random() * 50) + 10; // Zufällige Coins
  balance += earned;
  balanceEl.textContent = balance;

  // Monatsbericht aktualisieren
  const now = new Date().toLocaleDateString();
  const entry = `${now}: +${earned} Coins verdient<br>`;
  reportContent.innerHTML += entry;
});

