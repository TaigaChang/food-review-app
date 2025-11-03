const Validations = {};

Validations["name_first"] = async function(name) {
    if (!name || typeof name !== 'string') return false;
    
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 50) return false;

    const validPattern = /^[a-zA-Z\-'\s]+$/;
    if (!validPattern.test(trimmed)) return false;

    return true;
}

Validations["name_last"] = async function(name) {
    if (!name || typeof name !== 'string') return false;
    
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 50) return false;

    const validPattern = /^[a-zA-Z\-'\s]+$/;
    if (!validPattern.test(trimmed)) return false;

    return true;
}

Validations["email"] = async function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
        return false;
    }

    return true;
}

Validations["password"] = async function(password) {
    if (typeof password !== "string" || password.length < 9) {
        return false;
    }

    return true;
}

export default Validations;
