const mongoose = require('mongoose');
const validator = require('validator');

const purchaseSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true
    },
    supplier: {
        type: String,
        required: true,
        validate: value => ['Foo Inc.', 'Bar Ltd.', 'Baz GmbH.'].includes(value)
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
