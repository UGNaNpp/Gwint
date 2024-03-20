const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
    
});


app.patch('/mm')
app.get('/session/:sessionID')
app.patch('/session/:sessionID/move')
app.patch('/session/:sessionID/round')

app.get('/player/:playerID')
app.get('/player/:playerID/history')
app.get('/player/:playerID/info') 
app.patch('/player/:playerID/edit')

app.get('/ranking')

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});