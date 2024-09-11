const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
} else if (process.argv.length > 5 || process.argv.length === 4) {
    console.log("To add entry to the phonebook: node mongo.js <password> <name> <number>");
    console.log("To display all entries: node mongo.js <password>");
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@fullstackopen.9ckpd.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackopen`;

// Is this really necessary?
// mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

// Create a new entry
if (process.argv.length === 5) {
    const person = new Person({ name, number });

    person.save().then((result) => {
        console.log("entry saved!");
        mongoose.connection.close();
    });
} else {
    // Fetch all entries
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach(({ name, number }) => {
            console.log(`${name} ${number}`);
        });
        mongoose.connection.close();
    });
}
