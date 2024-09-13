require("dotenv").config({ path: [".env.local"] });

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");
const PropertyMissingError = require("./errorTypes");

const app = express();

// Middleware
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
morgan.token("req-body", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));

// Just for testing
app.get("/", (req, res) => {
    res.send("<h1>Hello, World!</h1>");
});

// Show info
app.get("/info", (req, res) => {
    Person.countDocuments()
        .then((count) => {
            res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
        })
        .catch((error) => next(error));
});

// Show all persons
app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then((person) => {
            res.json(person);
        })
        .catch((error) => next(error));
});

// Show a single person
app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            res.json(person);
        })
        .catch((error) => next(error));
});

// Delete a person
app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

// Create a new person
app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body;

    // Error handling
    if (!name) {
        throw new PropertyMissingError("name property missing");
    } else if (!number) {
        throw new PropertyMissingError("number property missing");
    }

    Person({ name, number })
        .save()
        .then((person) => {
            res.json(person);
        })
        .catch((error) => next(error));
});

// Error handling
const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "PropertyMissingError") {
        return res.status(400).send({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
