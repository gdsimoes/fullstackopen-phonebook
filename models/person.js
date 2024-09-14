const mongoose = require("mongoose");

// Is this really necessary?
// mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
    .connect(url)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: {
        type: String,
        validate: {
            validator: (value) => /^(\d{2,3})-(\d+)$/.test(value) && value.length >= 8,
            message:
                "The number should consist of 2 or 3 digits, followed by a hyphen, " +
                "and then followed by only digits, with a total of at least 7 digits.",
        },
        required: true,
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
