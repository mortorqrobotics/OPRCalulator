const calculateOPR = require('./index')
const matchdata = require('./matchdata.json')
const oprs = require('./oprs.json')

let value = calculateOPR("frc1515");
console.log(value)

console.assert(value.frc1515 === oprs.oprs.frc1515, `our: ${value.frc1515}, blue: ${oprs.oprs.frc1515}`);
console.assert(value.frc4 === oprs.oprs.frc4, `our: ${value.frc4}, blue: ${oprs.oprs.frc4}`);
console.assert(value.frc696 === oprs.oprs.frc696, `our: ${value.frc696}, blue: ${oprs.oprs.frc696}`);

// console.log(calculateOPR.findAgllTeams()[1])
// console.assert(calculateOPR.findAllTeams()[1] === "frc294", "correct")