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

async function getClimbPoints(eventKey) {
    let data = await getMatchData(eventKey);
    let organizedTeams = {};
    for(let match of data.filter(item => item.comp_level === "qm")) {
        let teams = { "blue": Object.values(match.alliances.blue.team_keys), "red": Object.values(match.alliances.red.team_keys)};
        for (let alliance of ["blue", "red"]) {
            let { endgameRobot1, endgameRobot2, endgameRobot3 } = match.score_breakdown[alliance]
            let endGameScores = [endgameRobot1, endgameRobot2, endgameRobot3];
            teams[alliance].forEach((team, i) => {
                if(!organizedTeams.hasOwnProperty(team)) {
                    organizedTeams[team] = [];
                }
                organizedTeams[team].push(endGameScores[i])
            })
        }
    }
    let averageTeam = {}
    for(const [team, climbs] of Object.entries(organizedTeams)) {
        averageTeam[team] = climbPointsMap[mostCommon(climbs)];
    }
    return averageTeam;
}

module.exports.getMatchData = getMatchData;
module.exports.getAllTeams = getAllTeams;
module.exports.getAllCategories = getAllCategories;
module.exports.getAllEvents = getAllEvents;
module.exports.getClimbPoints = getClimbPoints;