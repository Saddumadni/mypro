// frontend/script.js
document.getElementById('account-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const balance = document.getElementById('balance').value;

    const response = await fetch('http://localhost:5000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, balance }),
    });
    
    const account = await response.json();
    displayAccount(account);
});

async function displayAccount(account) {
    const accountsDiv = document.getElementById('accounts');
    accountsDiv.innerHTML += `<p>Account Created: ${account.name} with balance: ${account.balance}</p>`;
}