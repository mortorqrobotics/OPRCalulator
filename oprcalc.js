const math = require("mathjs");
const { getMatchData, climbPointsMap, mostCommon } = require("./bluealliance");

let data = [];

async function updateData(eventKey) {
  data = await getMatchData(eventKey);
}

function findAllTeams() {
  let teams = new Set();
  for (let match of data) {
    match.alliances.blue.team_keys.forEach((team) => teams.add(team.slice(3)));
    match.alliances.red.team_keys.forEach((team) => teams.add(team.slice(3)));
  }

  return Array.from(teams)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((item) => "frc" + item);
}

function getTeamsIndex(teams) {
  let map = {};
  teams.forEach((team, i) => {
    map[team] = i;
  });
  return map;
}

function getTeamsInAlliance(match, alliance) {
  return match.alliances[alliance].team_keys;
}

function getAllMatrices(category) {
  let teamMatrix = [];
  let scoreMatrix = [];
  let allTeams = findAllTeams();
  let map = getTeamsIndex(allTeams);
  for (let match of data.filter((item) => item.comp_level === "qm")) {
    for (let alliance of ["blue", "red"]) {
      let teams = getTeamsInAlliance(match, alliance);
      let row = new Array(allTeams.length).fill(0);
      for (let team of teams) {
        let teamIndex = map[team];
        row[teamIndex] = 1;
      }
      teamMatrix.push(row);
      scoreMatrix.push(match.score_breakdown[alliance][category]);
    }
  }
  return [teamMatrix, scoreMatrix];
}

async function calculateOPR(category, eventKey) {
  try {
    if (category === "climbPoints") {
      return await getClimbPoints(eventKey);
    }
    await updateData(eventKey);
    let [teamMatrix, scoreMatrix] = getAllMatrices(category);

    let teamsTransposed = math.transpose(teamMatrix);
    let normalTeams = math.multiply(teamsTransposed, teamMatrix);
    let normalScores = math.multiply(teamsTransposed, scoreMatrix);

    let oprs = math.multiply(math.inv(normalTeams), normalScores);
    let formatted = {};

    let allTeams = findAllTeams();
    oprs.forEach((opr, i) => {
      formatted[allTeams[i]] = opr;
    });
  } catch (e) {
    return {};
  }

  return formatted;
}

async function getClimbPoints(eventKey) {
  let organizedTeams = {};
  let climbData = data.length === 0 ? await getMatchData(eventKey) : data;
  for (let match of climbData.filter((item) => item.comp_level === "qm")) {
    let teams = {
      blue: Object.values(match.alliances.blue.team_keys),
      red: Object.values(match.alliances.red.team_keys),
    };
    for (let alliance of ["blue", "red"]) {
      let { endgameRobot1, endgameRobot2, endgameRobot3 } =
        match.score_breakdown[alliance];
      let endGameScores = [endgameRobot1, endgameRobot2, endgameRobot3];
      teams[alliance].forEach((team, i) => {
        if (!organizedTeams.hasOwnProperty(team)) {
          organizedTeams[team] = [];
        }
        organizedTeams[team].push(endGameScores[i]);
      });
    }
  }
  // Gets median score
  // let averageTeam = {}
  // for(const [team, climbs] of Object.entries(organizedTeams)) {
  //     averageTeam[team] = climbPointsMap[mostCommon(climbs)];
  // }
  // return averageTeam;

  //Gets mean score
  let averageTeam = {};
  console.log(organizedTeams);
  for (const [team, climbs] of Object.entries(organizedTeams)) {
    averageTeam[team] =
      climbs.map((climb) => climbPointsMap[climb]).reduce((a, b) => a + b) /
      climbs.length;
  }
  return averageTeam;
}

module.exports = calculateOPR;
module.exports.getClimbPoints = getClimbPoints;
