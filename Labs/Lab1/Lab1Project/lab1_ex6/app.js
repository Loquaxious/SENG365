const express = require('express');
const {response} = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send('HTTP request: GET /');
});

app.post( '/', (req, res) => {
    res.send('HTTP request: POST /');
});

app.put( '/', (req, res) => {
    res.send('HTTP request: PUT /');
});

app.delete( '/', (req, res) => {
    res.send('HTTP request: DELETE /');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});