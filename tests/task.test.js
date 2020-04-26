const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const User = require('../src/models/user')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get tasks for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    await user.populate('tasks').execPopulate()
    expect(user.tasks.length).toEqual(2)
})

test('User Two should not be able to delete User 1 tasks', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = Task.findById(taskOneId)
    expect(task).not.toBeNull()
})