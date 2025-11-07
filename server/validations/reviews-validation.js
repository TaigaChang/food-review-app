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
Validations["ingredients"] = async function(val) {
    return isScore(val);
}
Validations["ambiance"] = async function(val) {
    return isScore(val);
}
Validations["pricing"] = async function(val) {
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
    return Number.isInteger(val) && val >= 0 && val <= 100;
}

export default Validations;
