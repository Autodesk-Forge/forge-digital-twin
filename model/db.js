const mongoose = require('mongoose');

class Database {
    async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URL);
            console.log('Database connection successfull.');
        } catch(err) {
            console.log('Database connection error:', err);
        }
    }
}

module.exports = new Database();