const mongoose = require('mongoose');
const validator = require('validator');

function validateAuthor(value) {
    return value.match(/^[a-zA-Z ]{1,64}$/);
}

function validateDescription(value) {
    return value.match(/^[a-zA-Z.,?!\s]{1,256}$/);
}

const partSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        validate: value => ['ok', 'good', 'bad'].includes(value)
    },
    nextReview: {
        type: Date
    }
});

const reviewSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true,
        validate: validateAuthor
    },
    passed: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        validate: validateDescription
    },
    partId: {
        type: Number,
        required: true
    }
});

const issueSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true,
        validate: validateAuthor
    },
    text: {
        type: String,
        required: true,
        validate: validateDescription
    },
    img: {
        type: String,
        validate: value => validator.isURL(value) && value.length < 256
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    z: {
        type: Number,
        required: true
    },
    partId: {
        type: Number,
        required: true
    }
});

module.exports = {
    Part: mongoose.model('Part', partSchema),
    Review: mongoose.model('Review', reviewSchema),
    Issue: mongoose.model('Issue', issueSchema)
};
