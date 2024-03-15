var Classroom = require('../models/classroom')

// ... Example:

module.exports.getAllClassrooms = () => {
    return Classroom
        .find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            console.log(erro)
            return erro
        })
}


// Adds a new classroom to the classroom collection
module.exports.addClassroom = classroom => {
    console.log(classroom)
    return Classroom.create(classroom)
                    .then(response => {
                        return response
                    })
                    .catch(error => {
                        console.log(error)
                        return error
                    })
}

// Deletes a classroom from the classroom collection
module.exports.deleteClassroom = classroomId => {
    return Classroom.deleteOne({_id: classroomId})
                    .then(response => {
                        return response
                    })
                    .catch(error => {
                        console.log(error)
                        return error
                    })
}

// Deletes a reservation from a classroom
module.exports.deleteReservation = (classroomId, reservationId) => {
    return Classroom.findById(classroomId)
        .then(classroom => {
            if (!classroom) {
                throw new Error('Classroom not found');
            }

            const reservationIndex = classroom.reservation.findIndex(reservation => reservation._id.toString() === reservationId);

            if (reservationIndex === -1) {
                throw new Error('Reservation not found');
            }

            classroom.reservation.splice(reservationIndex, 1); // Remove a reserva

            return classroom.save(); // Salva a sala de aula atualizada
        })
        .then(updatedClassroom => {
            return { message: 'Reservation deleted successfully', classroom: updatedClassroom };
        })
        .catch(error => {
            return { error: error.message };
        });
};
  
module.exports.getClassroomById = function(classroomId, callback) {
    Classroom.findById(classroomId, function(error, classroom) {
        if (error) {
            console.log(error);
            return callback(null);
        }
        callback(classroom);
    });
};

// Reserves a classroom in a certain date
module.exports.reserveClassroom = reservation => {
    console.log(reservation)
    return Classroom.updateOne({_id: reservation._id}, {$push: {reservation: {startDate: reservation.startDate, endDate: reservation.endDate}}})
                    .then(response => {
                        return response
                    })
                    .catch(error => {
                        console.log(error)
                        return error
                    })
}

module.exports.getAvailableClassrooms = (date, duration) => {
    const requestedStartTime = new Date(date);
    const requestedEndTime = new Date(requestedStartTime.getTime() + duration * 60 * 1000); // assuming duration is in minutes

    return Classroom.find({
        "reservation": {
            $not: {
                $elemMatch: {
                    startDate: { $lt: requestedEndTime },
                    endDate: { $gt: requestedStartTime }
                }
            }
        }
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.log(error);
        return error;
    });
}

module.exports.getClassroomById = classroomId => {
    return Classroom.findById(classroomId)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        console.log(error);
                        return null;
                    });
};
