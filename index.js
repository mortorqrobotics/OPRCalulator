const data = require("./matchdata.json")
const math = require('mathjs')
const fs = require('fs')

function findAllTeams() {
    let teams = new Set();
    for(let match of data) {
        match.alliances.blue.team_keys.forEach(team => teams.add(team.slice(3)))
        match.alliances.red.team_keys.forEach(team => teams.add(team.slice(3)))
    }

    return Array.from(teams).sort((a, b) => parseInt(a)-parseInt(b)).map(item => "frc" + item)
}

function getTeamsIndex(teams) {
    let map = {}
    teams.forEach((team, i) => {
        map[team] = i;
    })
    return map;
}

function getTeamsInAlliance(match, alliance) {
    return match.alliances[alliance].team_keys;
}

function getAllMatrices() {
    let teamMatrix = []
    let scoreMatrix = [];
    let allTeams = findAllTeams();
    let map = getTeamsIndex(allTeams);
    for(let match of data) {
        for(let alliance of ["blue", "red"]) {
            let teams = getTeamsInAlliance(match, alliance);
            let row = new Array(allTeams.length).fill(0);
            for(let team of teams) {
                let teamIndex = map[team];
                row[teamIndex] = 1
            }
            teamMatrix.push(row);
            scoreMatrix.push(match.score_breakdown[alliance].totalPoints)
        }        
    }
    return [teamMatrix, scoreMatrix]
}

function calculateOPR(teamCode) {
    let [teamMatrix, scoreMatrix] = getAllMatrices();
    fs.writeFileSync('file', JSON.stringify(teamMatrix, null, 4))
    
    let teamsTransposed = math.transpose(teamMatrix);
    let normalTeams = math.multiply(teamsTransposed, teamMatrix);
    let normalScores = math.multiply(teamsTransposed, scoreMatrix);

    let oprs = math.usolve(normalTeams, normalScores)
    let formatted = {}

    let allTeams = findAllTeams();
    oprs.forEach((opr, i) => {
        formatted[allTeams[i]] = opr;
    })
    return formatted;
}

module.exports = calculateOPR;