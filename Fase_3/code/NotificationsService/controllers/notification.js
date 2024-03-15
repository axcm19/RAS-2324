var Notification = require('../models/notification')
const nodemailer = require('nodemailer');

module.exports.getIdUser = id => {
    return Notification
        .find({ user: id })
        .then(resp => {
            return resp;
        })
        .catch(error => {
            console.log("Controller mongoDB:" + error);
            return error;
        });
};
module.exports.getUnreadCount = id => {
    return Notification
        .countDocuments({ user: id, status: false })
        .then(count => {
            return count;
        })
        .catch(error => {
            console.log("Controller mongoDB:" + error);
            return error;
        });
};

module.exports.createNotificationForUser = function(salaId, testId,teachersId) {
    console.log(salaId)
    console.log(testId)
    if (!Array.isArray(teachersId)) {
        throw new Error('A lista de ids dos professores deve ser um array.');
    }

    const currentDate = new Date();

    // Mapear e criar registros de notificação para cada email
    
        const notificationText = `${salaId}: Sala removida, interferiu com o teste ${testId} `; // Correção do template literal

        return Promise.all(teachersId.map(teacherId => {
            return Notification.create({
                user: teacherId,
                date: currentDate,
                text: notificationText,
                status: false,
                type: 0 // Número 1 para tipo de notificação
            });
        }))
    .then(notifications => {
            return notifications;
        })
        .catch(error => {
            throw new Error('Erro ao criar notificações.');
        });
};

module.exports.notificationType1 = ( testID, emails ) => {

    if (!Array.isArray(emails)) {
        throw new Error('A lista de emails deve ser um array.');
    }

    const currentDate = new Date();

    // Mapear e criar registros de notificação para cada email

        const notificationText = `O teste ${testID} foi partilhado consigo.`; // Correção do template literal

        return Promise.all(emails.map(email => {
            return Notification.create({
                user: email,
                date: currentDate,
                text: notificationText,
                status: false,
                type: 1 // Número 1 para tipo de notificação
            });
        }))
    .then(notifications => {
            return notifications;
        })
        .catch(error => {
            throw new Error('Erro ao criar notificações.');
        });
};

module.exports.notificationType2 = ({studentID, testID, grade}) => {

        // Data atual
        const currentDate = new Date();

        // Criar e salvar a notificação
        return Notification.create({
            user: studentID,
            date: currentDate,
            text: `Nota do teste ${testID} está disponível. Resultado: ${grade}`,
            status: false,
            type: 2
        })
        .then(notifications => {
            return notifications; // Retorna as notificações criadas
        })
        .catch(error => {
            throw new Error('Erro ao criar notificações.');
        });
}

module.exports.notificationType3 = emails => {
    // Verifique se 'emails' é uma lista/array
    if (!Array.isArray(emails)) {
        throw new Error('A lista de emails deve ser um array.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',             // Usando o serviço do Gmail
        auth: {
            user: 'probum.2b@gmail.com', // Seu endereço de e-mail do Gmail
            pass: 'ollz bcfr bimw aulx'        // Sua senha do Gmail ou uma senha de aplicativo
        }
    });


    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Conexão SMTP do Gmail verificada com sucesso.');
        }
    });

    // Data atual
    const currentDate = new Date();

    // Texto de boas-vindas
    const welcomeText = 'Bem-vindo ao nosso sistema!';

    // Mapear e criar registros de notificação para cada email
    return Promise.all(emails.map(email => {
        const mailOptions = {
            from: 'probum.2B@gmail.com',
            to: email,
            subject: 'PROBUM Grupo 2-B',
            text: welcomeText
        };

        // Enviar o e-mail
        return transporter.sendMail(mailOptions)
            .then(() => {
                // Criar registro de notificação
                return Notification.create({
                    user: email,
                    date: currentDate,
                    text: welcomeText,
                    status: false,
                    type: 3
                });
            });

    }))
    .then(notifications => {
        return notifications; // Retorna as notificações criadas
    })
    .catch(error => {
        throw new Error('Erro ao criar notificações.');
    });
}


// ... Example:
/*
module.exports.list = () => {
    return User
        .find()
        .sort('name')
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}
*/