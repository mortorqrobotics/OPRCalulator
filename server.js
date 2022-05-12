const express = require('express');
const calculateOPR = require('./oprcalc');
const bluealliance = require('./bluealliance');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/api/average', async (req, res) => {
    const { category, event } = req.query;

    res.json(await calculateOPR(category, event));
})

app.get('/api/averageTeam', async (req, res) => {
    let { category, team, event } = req.query;
    team = (team.includes("frc")) ? team : "frc" + team;

    let data = await calculateOPR(category, event)
    res.json(data[team]);
})

app.get('/api/teams', async (req, res) => {
    let { event } = req.query;
    res.json(await bluealliance.getAllTeams(event));
})

app.get('/api/events', async (req, res) => {
    res.json(await bluealliance.getAllEvents());
})

app.get('/api/categories', async (req, res) => {
    res.json(bluealliance.getAllCategories());
})

app.listen(port, () => console.log(`Starting server on http://localhost:${port}`));