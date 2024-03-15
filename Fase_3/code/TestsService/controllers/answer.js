var Answer = require('../models/answer');

//getAnswers(idTest, idStudent)
module.exports.getAnswers = (idTest, idStudent) => {
    return Answer.find({
        testId: idTest,
        studentId: idStudent
    })
    .then(resposta => {
        return resposta
    })
    .catch(erro => {
        return erro
    })
}

//submitTest(answers, idTest, idStudent)
module.exports.submitTest = (idTest, idUser, body) => {
    let answers = body["answers"].map(answer => new Answer({
        ...answer,
        studentId: idUser,
        testId: idTest
    }));

    console.log(answers)

    let createPromises = answers.map(answer => Answer.create(answer));

    return Promise.all(createPromises)
        .then(() => {
            console.log('Successfully saved answers.');
        })
        .catch(err => {
            console.error('Error while saving answers: ', err);
        });
}

module.exports.updateScores = async (testId, studentId, scores) => {
    try {
        const updatedAnswers = await Promise.all(scores.map(async ({ questionId, score }) => {
            console.log(testId)
            const filter = { questionId, testId, studentId };
            console.log(filter)
            const update = { score };
            console.log(update)

            return await Answer.findOneAndUpdate(filter, update, { new: true });
        }));

        return updatedAnswers;
    } catch (error) {
        throw error;
    }
}

