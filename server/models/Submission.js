const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    groupNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    questionNumber: {
        type: Number,
        required: true
    },
    lowerBound: {
        type: Number,
        required: true
    },
    upperBound: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Compound index to quickly find the latest submission for a team's specific question
SubmissionSchema.index({ groupNumber: 1, questionNumber: 1, timestamp: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
