const express = require('express');
const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27003/';
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
    
});


app.post('/api/addData', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('gwint');
        const collection = database.collection('users');
        const newData = req.body;
        await collection.insertOne(newData);

        res.status(201).send('Dodano użytkownika');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
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
