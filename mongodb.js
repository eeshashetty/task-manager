const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = process.env.MONGODB_URL
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true}, (error,client) => {
    if(error) {
        console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        description: 'Clean room'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})

