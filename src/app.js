const express = require('express')
const bodyParser = require('body-parser')

require('./db/mongoose')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(userRouter)
app.use(taskRouter)

// app.listen(port, () => {
//     console.log('Server is up on port '+port)
// })

module.exports = app