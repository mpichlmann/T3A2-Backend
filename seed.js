const students = [
    {name: 'Lachie', assessments: [1]}, 
    {name: 'Argine', assessments: [2]}, 
    {name: 'Max', assessments: [3]}
]

const users = [
    {username: 'eliteadmin', password: 'spameggs', name: 'Adam Minister', isAdmin: true},
    {username: 'elitecoach', password: 'foobar', name: 'Jay Son', isAdmin: false}
]

const skills = [
    {skillname: 'jump', level: 1},
    {skillname: 'handstand', level: 2},
    {skillname: 'somersault', level: 3},
    {skillname: 'backflip', level: 4},
]

const assessments = [
    {student: 'Lachie', doneBy: 'elitecoach', isComplete: true, skills: [{skillname: 'jump', score: 1}, {skillname: 'handstand', score: 2}]},
    {student: 'Argine', doneBy: 'elitecoach', isComplete: true, skills: [{skillname: 'somersault', score: 4}, {skillname: 'backflip', score: 3}]},
]