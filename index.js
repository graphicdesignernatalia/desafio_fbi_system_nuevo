const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const agentes = require('./agentes').results;
const app = express();
const puerto = 3000;

const key = '55c0b6cbdbff7e42ab4728ba3174f983c9b50c7b17330f9560d382dae9faaaa1';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = agentes.find(ag => ag.email === email && ag.password === password);

    if (users) {
        const token = jwt.sign({ email: users.email }, key, { expiresIn: '2m' });
        console.log('Token generado:', token);
        res.json({ token });
    } else {
        res.status(401).send('Credenciales inválidas');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Token requerido');

    jwt.verify(token, key, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
}

app.get('/agentes', authenticateToken, (req, res) => {
    res.send(`Bienvenido, ${req.user.email}`);
});

app.get('/agente.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agente.html'));
});

app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`)
  });


