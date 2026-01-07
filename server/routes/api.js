const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// POST /api/submit - Submit a new guess
router.post('/submit', async (req, res) => {
    try {
        const { groupNumber, email, questionNumber, lowerBound, upperBound } = req.body;

        // Basic validation (redundant with frontend but good practice)
        if (!groupNumber || !email || !questionNumber || !lowerBound || !upperBound) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const submission = new Submission({
            groupNumber: Number(groupNumber),
            email,
            questionNumber: Number(questionNumber),
            lowerBound: Number(lowerBound),
            upperBound: Number(upperBound)
        });

        await submission.save();
        res.status(201).json({ message: 'Submission received successfully' });
    } catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/leaderboard - Get current rankings
// NOTE: This is a placeholder logic for scoring.
// In a real Estimathon, you'd calculate this based on correct answers and interval widths.
router.get('/leaderboard', async (req, res) => {
    try {
        // Basic aggregation: Get latest submission for each (groupNumber, questionNumber)
        // Then group by groupNumber and sum some dummy score or just list teams.

        // For now, let's just return a list of groups that have submitted.
        const teams = await Submission.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$groupNumber',
                    score: { $sum: 1 }, // Placeholder: score is just count of submissions
                    latestSubmission: { $first: '$$ROOT' }
                }
            },
            { $sort: { score: -1 } },
            {
                $project: {
                    team: { $concat: ['Team ', { $toString: '$_id' }] },
                    score: 1
                }
            }
        ]);

        res.json(teams);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
