const calculateOPR = require('./oprcalc')
const matchdata = require('./matchdata.json')
const oprs = require('./oprs.json')

let value = calculateOPR();
console.log(value)

console.log(value.frc1515.toFixed(2))
console.log(value.frc4.toFixed(2))
console.log(value.frc3476.toFixed(2))

// console.log(value.frc1515.toFixed(2) === oprs.oprs.frc1515.toFixed(2), `our: ${value.frc1515}, blue: ${oprs.dprs.frc1515}`);
// console.log(value.frc4.toFixed(2) === oprs.oprs.frc4.toFixed(2), `our: ${value.frc4}, blue: ${oprs.dprs.frc4}`);
// console.log(value.frc696.toFixed(2) === oprs.oprs.frc696.toFixed(2), `our: ${value.frc696}, blue: ${oprs.dprs.frc696}`);

// console.log(calculateOPR.findAgllTeams()[1])
// console.assert(calculateOPR.findAllTeams()[1] === "frc294", "correct")