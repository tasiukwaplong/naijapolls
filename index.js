const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('docs'))

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
require('./src/routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Endpoint does not exist yet'
}));

app.post('*', (req, res) => res.status(400).send({
  message: 'Enpoint does not exist yet'
}));

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

module.exports = app;
