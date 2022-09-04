const express = require("express");
const morgan = require("morgan");

const app = express();

// For req.body
app.use(express.json());

// Morgan - HTTP request logger middleware
// https://github.com/expressjs/morgan
morgan.token("post-body", (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    }
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :post-body"
    )
);

// Request logger middleware
// const requestLogger = (req, res, next) => {
//     console.log("Method:", req.method);
//     console.log("Path:  ", req.path);
//     console.log("Body:  ", req.body);
//     console.log("---");
//     next();
// };
// app.use(requestLogger);

// Person array
let persons = [
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
    {
        id: 5,
        name: "Guilherme Dias Simoes",
        number: "6475628093",
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

// Delete a specific person
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

// Generate suitable id
const generateId = () => {
    let id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    // Unlikely to be unnecessary and duplicate ids are very unlikely
    // Should probably be removed
    while (persons.find((person) => person.id === id) !== undefined) {
        id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    return id;
};

// Add a person
app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;

    if (name === undefined) {
        res.status(400).json({ error: "name missing" });
    } else if (number === undefined) {
        res.status(400).json({ error: "number missing" });
    } else if (persons.find((person) => person.name === name) !== undefined) {
        res.status(409).json({ error: "name must be unique" });
    } else {
        const person = {
            name,
            number,
            id: generateId(),
        };

        persons.push(person);

        res.json(person);
    }
});

// Unknown endpoint middleware
// const unknownEndpoint = (req, res) => {
//     res.status(404).send({ error: "unknown endpoint" });
// };
// app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
