var Test = require('../models/test')

//getTests(userId)
module.exports.getTests = (userId) => {
    return Test.find({
        $or: [
            { 'teachers': userId }, 
            { 'students._id': userId }
        ]
    }).select('-versions')
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
}

//getTest(idTest)
module.exports.getTest = (idTest) => {
    return Test.findById(idTest).select('-versions')
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
}

//getTestVersion(idTest, version)
module.exports.getTestVersion = (idTest, versionId) => {
    return Test.findOne({ _id: idTest })
        .then(test => {
            if (!test) {
                console.log('Test not found');
                return null; // Retorna null se não encontrar o teste
            }

            const versionIdNumber = Number(versionId);
            // Filtra para encontrar a versão específica dentro do array 'versions'
            const selectedVersion = test.versions.find(v => v._id === versionIdNumber);

            if (!selectedVersion) {
                console.log('Version not found');
                return null; // Retorna null se não encontrar a versão
            }

            return selectedVersion;
        })
        .catch(erro => {
            console.error('Error while trying to get test version:', erro);
            return null;
        });
};

//getStudents(idTest) - retorna apenas studentID
module.exports.getStudents = (idTest) => {
    return Test.findById(idTest)
        .then(test => {
            if (!test) {
                console.log('Could not find test.');
                return [];
            }

            const studentIds = test.students.map(student => student._id);
            return studentIds;
        })
        .catch(err => {
            console.error('Error while trying to get students: ', err);
            return [];
        });
}


//shareTest(idTest, idTeachers)
module.exports.shareTest = (idTest, body) => {
    return Test.updateOne(
        { _id: idTest },
        { $addToSet: { teachers: { $each: body["teachers"] } } }
    )
    .then(result => {
        if (result.matchedCount === 0) {
            console.log('Could not find test with id ' + idTest);
        } else if (result.modifiedCount === 0) {
            console.log('Teachers already added.');
        } else {
            console.log('Successfully added teachers.');
        }
    })
    .catch(err => {
        console.error('Error while adding teachers: ', err);
    });
}


//getOccupiedClassrooms(classroomIds)
module.exports.getOccupiedClassrooms = (body) => {
    return Test.find({
        'classrooms._id': { $in: body["classrooms"] }
    })
    .then(tests => {
        let allTeachers = [];
        let allTestIds = [];

        tests.forEach(test => {
            allTeachers = allTeachers.concat(test.teachers);
            allTestIds.push(test._id);
        });

        return {
            teachers: allTeachers,
            testIds: allTestIds
        };
    })
    .catch(err => {
        console.error('Error while trying to get occupied classrooms: ', err);
        return [];
    });

}

//createTest(name,students,classrooms, idTeacher)
module.exports.createTest = (test) => {
    return Test.create(test)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

//addTestDetails(idTest, versions, randomness, goBack, associations)
/* Acho que aqui não precisa passar versions. Pelo diagrama de seq. entendi que versions seria a quantidade de versões.
Mas temos o schema de test com versions: [versionSchema]
E este numero de versoes pode ser so pro frontend fazer um ciclo por este número. Mas aqui não seria preciso
porque a createVersionRequest já adiciona cada versão ao test.
Acho que é mais fácil do que andar a criar versionSchema só com id e depois ter que ir pra id x adicionar as questions ao inves de so dar push de cada version.
Aqui tbm faz sentido passar o id do Teste pq ele ja foi criado
*/
module.exports.addTestDetails = (idTest, details) => {
    return Test.updateOne(
        { _id: idTest },
        { $set: { randomness: details["randomness"], throwback: details["throwback"], classrooms: details["associations"]} }
    )
    .then(result => {
        if (result.matchedCount === 0) {
            return 'Could not find test.'
        } else if (result.modifiedCount === 0) {
            return 'Already up to date.';
        } else {
            return result;
        }
    })
    .catch(err => {
        console.error('Error while updating test details: ', err);
        return err;
    });
}

module.exports.manageVersion = async (idTest, idVersion, version) => {
    try {
        // Primeiro, remove a versão antiga, se existir
        const resultRemove = await Test.updateOne(
            { _id: idTest },
            { $pull: { versions: { _id: idVersion } } }
        );

        if (resultRemove.matchedCount === 0) {
            console.log('Could not find test.');
            return;
        }

        // Em seguida, adiciona a nova versão
        const resultAdd = await Test.updateOne(
            { _id: idTest },
            { $push: { versions: version } }
        );

        if (resultAdd.modifiedCount === 0) {
            console.log('Could not add version.');
        } else {
            console.log('Successfully added version to the test.');
        }
    } catch (err) {
        console.error('Error while trying to add version: ', err);
    }
};

module.exports.deleteVersion = (idTest, idVersion) => {
    return Test.updateOne(
        { _id: idTest },
        { $pull: { versions: { _id: idVersion } } }
    );
}

module.exports.studentVersion = async (idTest, idStudent) => {
    try {
        // get test
        const test = await Test.findById(idTest);
        if (!test) {
            console.log('Test not found');
            return null;
        }

        // find student and its classroom
        const student = test.students.find(student => student._id === idStudent);
        if (!student) {
            console.log('Student not found');
            return null;
        }
        const classroomId = student.classroom;

        // get version associated to the classroom
        const classroom = test.classrooms.find(classroom => classroom._id === classroomId);
        if (!classroom) {
            console.log('Classroom not found');
            return null;
        }
        const versionNumber = classroom.version;

        return versionNumber;
    } catch (err) {
        console.error('Error while trying to get questions:', err);
        return null;
    }
}

module.exports.getQuestions = async (idTest, idStudent) => {
    try {
        
        const versionNumber = await this.studentVersion(idTest, idStudent);
        const test = await Test.findById(idTest);
        if (!test) {
            console.log('Test not found');
            return null;
        }
       
        // get questions
        const version = test.versions.find(version => version._id === versionNumber);
        if (!version) {
            console.log('Version not found');
            return null;
        }

        return version.questions
    } catch (err) {
        console.error('Error while trying to get questions:', err);
        return null;
    }
}


module.exports.getStudentScores = async (idTest) => {
    try {
        const test = await Test.findById(idTest);
        if (!test) {
            console.log('Test not found');
            return [];
        }

        // studentId, score
        const studentScores = test.students.map(student => {
            return {
                studentId: student._id,
                score: student.score
            };
        });

        return studentScores;
    } catch (err) {
        console.error('Error while trying to get student scores:', err);
        return [];
    }
}

module.exports.updateTotalScoreStudent = async (idTest, idStudent, newScore) => {
    try {
        // Obter o score atual do aluno
        const test = await Test.findOne({"_id": idTest, "students._id": idStudent });
        const currentScore = test.students.find(student => student._id === idStudent).score;

        // Calcular o novo score somando o atual com o novo
        const updatedScore = currentScore + newScore;

        // Atualizar o score do aluno no documento do teste
        const result = await Test.updateOne({"_id": idTest, "students._id": idStudent }, { $set: { "students.$.score": updatedScore } });

        return result;
    } catch (error) {
        return error;
    }
};