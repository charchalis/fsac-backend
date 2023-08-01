const bcrypt = require('bcrypt');


const hashPassword = async (password) => {
// Generate a salt and hash the password
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        // Handle the error
        console.error('Error hashing password:', error);
        throw error;
    }
}

module.exports = hashPassword;