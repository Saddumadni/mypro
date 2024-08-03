// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

// Create a new account
app.post('/api/accounts', async (req, res) => {
    const { name, balance } = req.body;
    const query = `
        mutation {
            insert_accounts_one(object: { name: "${name}", balance: ${balance} }) {
                id
                name
                balance
            }
        }
    `;
    try {
        const response = await axios.post(HASURA_GRAPHQL_ENDPOINT, { query }, {
            headers: {
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            },
        });
        res.json(response.data.data.insert_accounts_one);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Deposit money
app.post('/api/deposit', async (req, res) => {
    const { accountId, amount } = req.body;
    const query = `
        mutation {
            update_accounts_by_pk(pk_columns: { id: ${accountId} }, _inc: { balance: ${amount} }) {
                id
                balance
            }
        }
    `;
    try {
        const response = await axios.post(HASURA_GRAPHQL_ENDPOINT, { query }, {
            headers: {
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            },
        });
        res.json(response.data.data.update_accounts_by_pk);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Withdraw money
app.post('/api/withdraw', async (req, res) => {
    const { accountId, amount } = req.body;
    const query = `
        mutation {
            update_accounts_by_pk(pk_columns: { id: ${accountId} }, _inc: { balance: -${amount} }) {
                id
                balance
            }
        }
    `;
    try {
        const response = await axios.post(HASURA_GRAPHQL_ENDPOINT, { query }, {
            headers: {
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            },
        });
        res.json(response.data.data.update_accounts_by_pk);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});