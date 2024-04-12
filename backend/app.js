const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Parse JSON bodies for POST requests
app.use(bodyParser.json());

// Define a route that responds with a message
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define a POST route that accepts JSON data in the request body and responds with a message
app.post('/api/echo', (req, res) => {
    const data = req.body;
    res.json({ message: 'Received data:', data : data });
});




// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
