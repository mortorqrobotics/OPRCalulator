const { default: axios } = require("axios");
const categories = require('./categories.json')
require('dotenv').config();

const TBAKey = process.env.TBA_KEY || require('./config.json').TBAKey;

async function getMatchData(eventKey) {
    let data = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`, {
        headers: {
            "X-TBA-Auth-Key": TBAKey
        }
    })
    
    return data.data;
}

async function getAllTeams(eventKey) {
    let data = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams/keys`, {
        headers: {
            "X-TBA-Auth-Key": TBAKey
        }
    })
    return data.data.map(team => parseInt(team.slice(3))).sort((a, b) => a-b).map(team => "frc" + team);
}

function getAllCategories() {
    return categories;
}

async function getAllEvents() {
    let year = new Date().getFullYear();
    let data = await axios.get(`https://www.thebluealliance.com/api/v3/events/${year}/keys`, {
        headers: {
            "X-TBA-Auth-Key": TBAKey
        }
    })
    return data.data;
}

const climbPointsMap = {
    "Traversal": 15,
    "High": 10,
    "Mid": 6,
    "Low": 4,
    "None": 0
}

function mostCommon(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

module.exports.getMatchData = getMatchData;
module.exports.getAllTeams = getAllTeams;
module.exports.getAllCategories = getAllCategories;
module.exports.getAllEvents = getAllEvents;
module.exports.climbPointsMap = climbPointsMap;
module.exports.mostCommon = mostCommon;