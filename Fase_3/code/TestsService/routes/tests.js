var express = require('express');
var router = express.Router();
var Test = require('../controllers/test')
var Answer = require('../controllers/answer');
const { version } = require('mongoose');

/* GET all classrooms associated to tests */
// getOccupiedClassrooms(classroomsIds) --
router.get('/tests/occupiedclassrooms', function(req, res) {
    Test.getOccupiedClassrooms(req.body)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(523).json({
                error: error,
                message: `Erro na obtenção das salas ocupadas.`,
            })
        })
})

/* GET test from a user. */
// getTests(idUser) --
router.get('/tests/:idUser', function (req, res, next) {
    Test.getTests(req.params.idUser)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(521).json({
                error: error,
                message: `Erro na obtenção da lista de testes do utilizador ${req.params.idUser}`,
            })
        })
});

/* GET test with certain id. */
// getTest(idTest) --
router.get('/test/:idTest', function (req, res, next) {
    Test.getTest(req.params.idTest)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(522).json({
                error: error,
                message: `Erro na obtenção do teste com identificador ${req.params.idTest}`,
            })
        })
});

/* GET test version with certain id. */
// getTestVersion(idTest, idVersion) --
router.get('/test/:idTest/version/:idVersion', function (req, res, next) {
    Test.getTestVersion(req.params.idTest, req.params.idVersion)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(523).json({
                error: error,
                message: `Erro na obtenção da versão do teste com identificador ${req.params.idTest}`,
            })
        })
});

/* GET test version with certain id. */
// getAnswers --
router.get('/test/:idTest/answers/:idUser', function (req, res, next) {
    Answer.getAnswers(req.params.idTest, req.params.idUser)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(524).json({
                error: error,
                message: `Erro na obtenção das respostas do aluno ${req.params.idUser} no teste ${req.params.idTest}`,
            })
        })
});


/* GET students associated to the test */
// getStudents(testId) --
router.get('/tests/:idTest/students', function(req, res) {
    Test.getStudents(req.params.idTest)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(521).json({
            error: error,
            message: `Erro na obtenção da lista de alunos associados ao teste ${req.params.idTest}`,
        })
    })
})



/* GET test version with certain id. */
// createTest --
router.post('/tests', function (req, res, next) {
    Test.createTest(req.body)
        .then(data => {
            res.status(200).json(data) 
        })
        .catch(error => {
            res.status(525).json({
                error: error,
                message: `Erro na criação do teste`,
            })
        })
});


// addTestDetails e editTestDetails --
router.put('/tests/:idTest/details', function (req, res, next) {
    Test.addTestDetails(req.params.idTest, req.body)
        .then(data => {
            console.log(data)
            res.status(200).json(data) // mandar a data?
        })
        .catch(error => {
            res.status(526).json({
                error: error,
                message: `Erro na adição dos detalhes do teste`,
            })
        })
});


// createVersionRequest e updateQuestions --
router.put('/tests/:idTest/version/:idVersion', function (req, res, next) {
    Test.manageVersion(req.params.idTest, req.params.idVersion,req.body)
        .then(data => {
            res.status(200).json(data) // mandar a data?
        })
        .catch(error => {
            res.status(527).json({
                error: error,
                message: `Erro na criação da nova versão`,
            })
        })
});


// shareTest --
router.put('/tests/:idTest/share', function (req, res, next) {
    Test.shareTest(req.params.idTest, req.body)
        .then(data => {
            res.status(200).json(data) // mandar a data?
        })
        .catch(error => {
            res.status(528).json({
                error: error,
                message: `Erro na partilha da prova`,
            })
        })
});


// submitTest -- 
router.put('/tests/:idTest/submit/:idUser', function (req, res, next) {
    Answer.submitTest(req.params.idTest, req.params.idUser,req.body)
        .then(data => {
            res.status(200).json(data) // mandar a data?
        })
        .catch(error => {
            res.status(529).json({
                error: error,
                message: `Erro na submissão das respostas`,
            })
        })
});

//startTest --
router.get('/startTest/:idTest/student/:idStudent', function (req, res, next) {
    Test.getQuestions(req.params.idTest, req.params.idStudent)
        .then(data => {
            // Exclude the "solution" field from each question's options
            const questionsWithoutSolution = data.map(question => {
                const sanitizedOptions = question.options.map(option => {
                    const { solution, ...optionWithoutSolution } = option.toObject();
                    return optionWithoutSolution;
                });

                const { options, ...questionWithoutSolution } = question.toObject();
                questionWithoutSolution.options = sanitizedOptions;

                return questionWithoutSolution;
            });
            let throwback = false

            Test.getTest(req.params.idTest)
            .then(data => {
                throwback = data.throwback
                console.log(throwback)
                res.status(200).json({"throwback": throwback, "questions": questionsWithoutSolution}) 
            })
            .catch(error => {
                console.log(error)
                res.status(529).json({
                    error: error,
                    message: `Erro ao buscar o teste.`,
                })
            })
            
        })
        .catch(error => {
            console.log(error)
            res.status(529).json({
                error: error,
                message: `Erro ao buscar as questões.`,
            })
        })
});


// Delete test version
router.delete('/test/:idTest/version/:idVersion', function(req, res) {
    Test.deleteVersion(req.params.idTest, req.params.idVersion)
    .then(data => {
        res.status(200).json(data) 
    })
    .catch(error => {
        res.status(529).json({
            error: error,
            message: `Erro ao buscar as questões.`,
        })
    })
})

// Publish classifications --
router.get('/publishClassifications/:idTest', function(req, res) {
    Test.getStudentScores(req.params.idTest)
    .then(data => {
        res.status(200).json(data) 
    })
    .catch(error => {
        res.status(529).json({
            error: error,
            message: `Erro ao buscar as classificações.`,
        })
    })
})

//Consultar teste - talvez seja mais completo do que só o getAnswers --
router.get('/viewtest/:idTest/student/:idStudent', function(req,res) {
    Test.studentVersion(req.params.idTest, req.params.idStudent)
        .then(version => {
            Test.getTestVersion(req.params.idTest, version)
                .then(test => {
                        Answer.getAnswers(req.params.idTest, req.params.idStudent)
                        .then(answers => {
                            res.status(200).json({test: test, answers: answers, version: version}) 
                        })
                        .catch(error => {
                            res.status(529).json({
                                error: error,
                                message: `Erro ao buscar as respostas.`,
                            })
                        })
                })
                .catch(error => {
                    res.status(529).json({
                        error: error,
                        message: `Erro ao buscar o teste.`,
                    })
                })

            
        })
        .catch(error => {
            res.status(529).json({
                error: error,
                message: `Erro ao buscar o id da versão associada ao aluno.`,
            })
        })
})

/*
Assumindo que UI vai disponibilizar para cada questão a resposta do aluno então 
aqui apenas salva o score do aluno dado pelo prof nas questões
*/
router.put('/evaluateTest/:idTest/:idStudent', function (req, res) {
    const scoresToUpdate = req.body.scores || [];
    
    const totalScore = scoresToUpdate.reduce((accumulator, scoreObj) => {
        return accumulator + (scoreObj.score || 0);
    }, 0);

    Answer.updateScores(req.params.idTest, req.params.idStudent, req.body.scores)
    .then(data => {
        Test.updateTotalScoreStudent(req.params.idTest, req.params.idStudent, totalScore)
            .then(() => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).json({
                    error: error,
                    message: 'Erro ao atualizar a nota total do aluno.',
                });
            });
    })
    .catch(error => {
        res.status(529).json({
            error: error,
            message: `Erro ao atualizar as correções das respostas.`,
        })
    })
})

router.get('/evaluateTest/:idTest/student/:idStudent', function(req, res) {
    let totalScore = 0;
    Test.getQuestions(req.params.idTest, req.params.idStudent)
    .then(questions => {
        Answer.getAnswers(req.params.idTest, req.params.idStudent)
        .then(answers => {
            const scoresToUpdate = answers.map(answer => {
               
                const question = questions.find(q => q._id === answer.questionId);

                if (question && question.type === 1) {
                    const correctOptions = question.options.filter(opt => opt.solution === 'true').map(opt => opt.description);
                    const isCorrect = correctOptions.every(opt => answer.options.includes(opt));
                    const questionScore = isCorrect ? question.grade : 0;
                    totalScore += questionScore; 
                    return { questionId: answer.questionId, score: questionScore };
                }

                return null;
            }).filter(score => score !== null);

            
            Answer.updateScores(req.params.idTest, req.params.idStudent, scoresToUpdate)
                .then(updatedAnswers => {
                    Test.updateTotalScoreStudent(req.params.idTest, req.params.idStudent, totalScore)
                        .then(() => {
                            res.status(200).json(updatedAnswers);
                        })
                        .catch(error => {
                            res.status(500).json({
                                error: error,
                                message: 'Erro ao atualizar a nota total do aluno.',
                            });
                        });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error,
                        message: 'Erro ao salvar as avaliações.',
                    });
                });
            
        })
        .catch(error => {
            console.log(error)
            res.status(529).json({
                error: error,
                message: `Erro ao obter as respostas do aluno.`,
            })
        })
    })
    .catch(error => {
        res.status(529).json({
            error: error,
            message: `Erro ao obter as questões do teste.`,
        })
    })
})

module.exports = router;
