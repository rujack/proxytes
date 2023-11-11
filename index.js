const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());


app.get('/swap/:version/:network/quote', async (req, res) => {
    try {
        const apiUrl = `https://api.1inch.dev/swap/${req.params.version}/${req.params.network}/quote`;

        const params = {
            src: req.query.src,
            dst: req.query.dst,
            amount: req.query.amount,
            protocols: req.query.protocols,
            fee: req.query.fee,
            gasPrice: req.query.gasPrice,
            complexityLevel: req.query.complexityLevel,
            parts: req.query.parts,
            mainRouteParts: req.query.mainRouteParts,
            gasLimit: req.query.gasLimit,
            includeTokensInfo: req.query.includeTokensInfo,
            includeProtocols: req.query.includeProtocols,
            includeGas: req.query.includeGas,
            connectorTokens: req.query.connectorTokens,
        };
        const token = req.header('Authorization');
        const headers = {
            Authorization: token,
        };

        const response = await axios.get(apiUrl, { params, headers });

        res.json(response.data);
    } catch (error) {
        // res.json(error)
        switch (error.response.status) {
            case 400:
                res.status(error.response.status).json({
                    "statusCode": error.response.status,
                    "description": error.response.data.description
                });
                break
            case 401:
                res.status(error.response.status).json({
                    "statusCode": error.response.status,
                    "description": "Unauthorized"
                })
                break
            case 404:
                res.status(error.response.status).json({
                    "statusCode": error.response.status,
                    "description": "Not Found"
                })
                break
            case 429:
                res.status(error.response.status).json({
                    "statusCode": error.response.status,
                    "description": "Too Many Requests"
                })
                break
            default:
                res.status(500).json({ error: 'Internal Server Error' });
                break

        }
    }
});

app.get('/url', async (req, res) => {
    try {
        const url = Object.keys(req.query)
            .map(key => `${key}=${req.query[key]}`)
            .join('&');

        const token = req.header('Authorization');
        const headers = {
            Authorization: token,
        };

        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        if (error.response.status) {
            if (error.response.data) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(error.response.status).json(error.message);
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

});

app.get('/', (_, res) => {
    res.status(200).send('proxy nih boss!!')
})

app.get('/*', (_, res) => {
    res.status(404).send('NOT FOUND NIH BOSS!!')
})

// Jalankan server
app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});

module.exports = app
