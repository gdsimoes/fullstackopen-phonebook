const express = require("express");
const app = express();

// Person array
const persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// Display info
app.get("/info", (req, res) => {
    const page = `
        <p>Phonebook has infor for ${persons.length}</p>
        <p>${new Date().toString()}</p>
    `;

    res.send(page);
});

// Get all persons
app.get("/api/persons", (req, res) => {
    res.send(persons);
});

// Get a specific person
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person !== undefined) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
