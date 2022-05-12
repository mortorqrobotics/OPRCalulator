const { default: axios } = require("axios");
const { TBAKey } = require('./config.json')
const categories = require('./categories.json')

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

module.exports.getMatchData = getMatchData;
module.exports.getAllTeams = getAllTeams;
module.exports.getAllCategories = getAllCategories;
module.exports.getAllEvents = getAllEvents;