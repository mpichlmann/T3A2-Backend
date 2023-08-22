import { StudentModel, UserModel, SkillModel, AssessmentModel, dbClose } from './db.js'

const seedAssessments = async () => {
    try {
        const students = await StudentModel.find()
        const coach = await UserModel.findOne({ username: 'elitecoach' })
        const skills = await SkillModel.find()

        const assessments = [
            // Assessment for Lachie
            {
                student: students.find(student => student.name === 'Lachie')._id,
                doneBy: coach._id,
                isCompleted: true,
                skills: [
                    { skill: skills.find(skill => skill.skillname === 'jump')._id, score: 1 },
                    { skill: skills.find(skill => skill.skillname === 'handstand')._id, score: 2 }
                ]
            },
            // Assessment for Argine
            {
                student: students.find(student => student.name === 'Argine')._id,
                doneBy: coach._id,
                isCompleted: true,
                skills: [
                    { skill: skills.find(skill => skill.skillname === 'somersault')._id, score: 4 },
                    { skill: skills.find(skill => skill.skillname === 'backflip')._id, score: 3 }
                ]
            },
            // Assessment for Max
            {
                student: students.find(student => student.name === 'Max')._id,
                doneBy: coach._id,
                isCompleted: true,
                skills: [
                    { skill: skills.find(skill => skill.skillname === 'jump')._id, score: 1 },
                    { skill: skills.find(skill => skill.skillname === 'backflip')._id, score: 1 }
                ]
            }
        ];

        const as = await AssessmentModel.insertMany(assessments)

        // Update students' assessments
        await Promise.all(
            students.map(async student => {
                const studentAssessments = as.filter(assessment => assessment.student.equals(student._id))
                student.assessments = studentAssessments.map(assessment => assessment._id)
                await student.save()
            })
        );

        console.log('Assessments seeded')
    } catch (error) {
        console.error(error)
    } finally {
        dbClose()
    }
}

seedAssessments()
