const express = require("express");
const app = express();

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello, World!</h1>");
});

// Show info
app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

// Show all persons
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

// Show a single person
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

// Delete a person
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

// Create a new person
app.post("/api/persons", (req, res) => {
    const person = req.body;
    person.id = crypto.randomUUID();
    persons = persons.concat(person);
    res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
