/* jshint esversion: 8*/
const Joi = require('joi');
const express = require('express');

const app = express();

const genres = [
    { id: 1, name: "action" },
    { id: 2, name: "horror" },
    { id: 3, name: "romantic" }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('WELCOME TO VIDLY');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(400).send(`No Genre with id: ${req.params.id} Found`);
    res.send(genre);
});
app.post('/api/genres', (req, res) => {
    //CHECK GENRE VALIDITY
    const { error } = validateGenre(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(400).send(`No Genre with id: ${req.params.id} Found`);

    const { error } = validateGenre(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(400).send(`No Genre with id: ${req.params.id} Found`);
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Running on Port ${port}`));

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}