const mongoose = require('mongoose');

const { validateSupplier } = require('./validation');

const purchaseSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true
    },
    supplier: {
        type: String,
        required: true,
        validate: validateSupplier
    },
    price: {
        type: Number,
        required: true
    },
    partId: {
        type: Number,
        required: true
    }
});

module.exports = {
    Purchase: mongoose.model('Purchase', purchaseSchema)
};
