const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk mengizinkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint proxy untuk memanggil API 1inch.dev
app.get('/quote', async (req, res) => {
  try {
    const apiUrl = 'https://api.1inch.dev/swap/v5.2/56/quote';
    const params = {
      src: req.query.src,
      dst: req.query.dst,
      amount: req.query.amount,
    };
    const token = req.header('Authorization');
    const headers = {
        Authorization: token,
      };

    const response = await axios.get(apiUrl, { params,headers });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    if (error.response.status == 400) {
            res.status(error.response.status).json(error.response.data);
        } else if (error.response.status == 429) {
            res.status(error.response.status).json({
                "statusCode": error.response.status,
                "description": "Too Many Requests"
            })
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
  }
});

app.get('/',(req,res)=>{
    res.status(200).json('proxy nih boss!! awokawok')
})

// app.get('/*', (req, res) => {
//     res.status(404).send('NOT FOUND NIH BOSS!!')
// })

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

module.exports = app
