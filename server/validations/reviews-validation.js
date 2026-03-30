const Validations = {};


Validations["user_id"] = async function(val) {
    return Number.isInteger(val) && val > 0;
}

Validations["restaurant_id"] = async function(val) {
    return Number.isInteger(val) && val > 0;
}

Validations["taste"] = async function(val) {
    return isScore(val);
}
Validations["service"] = async function(val) {
    return isScore(val);
}
Validations["ambiance"] = async function(val) {
    return isScore(val);
}
Validations["price"] = async function(val) {
    return isScore(val);
}

Validations["comment"] = async function(val) {
    return typeof val === "undefined" || typeof val === "string";
}

Validations["created_at"] = async function(val) {
    // Accept undefined (DB will set), or valid ISO date string
    if (typeof val === "undefined") return true;
    if (typeof val !== "string") return false;
    // Simple ISO date check
    return !isNaN(Date.parse(val));
}

function isScore(val) {
    // Allow numbers between 0 and 5, with up to 1 decimal place
    return typeof val === "number" && val >= 0 && val <= 5;
}

export default Validations;
