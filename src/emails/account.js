const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        'to': email,
        'from': 'ekshetty2410@gmail.com',
        'subject': 'Thank you for joining us!',
        'text': `Welcome to the app, ${name}.`
})
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        'to': email,
        'from': 'ekshetty2410@gmail.com',
        'subject': 'We\'re sorry to see you go!',
        'text': `We hate to see you go, ${name}. Let us know why bitch`
})
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}