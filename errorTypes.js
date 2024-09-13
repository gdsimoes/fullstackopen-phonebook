class PropertyMissingError extends Error {
    constructor(message) {
        super(message);
        this.name = "PropertyMissingError";
    }
}

module.exports = PropertyMissingError;
