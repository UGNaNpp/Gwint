const express = require('express');


const app = express();

const port = 7500;

app.all('/', (req, res) => {
    res.send('Hello World');
});