const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

//before each tests run...
//create a copy of the blockchain contract
contract('TodoList', (accounts) => {
    before(async () =>{
        this.todoList = await TodoList.deployed()
    })

    //checking address in not null or empty
    it('deploys successfully', async ()=>{
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)

    })

    it('lists tasks', async() =>{
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'Check out this first task!')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)

        
    })

    it('creates tasks', async() =>{
        const result = await this.todoList.CreateTask('A new task')
        const taskCount = await this.todoList.taskCount()

        assert.equal(taskCount, 2)
        //console.log(result)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new task')
        assert.equal(event.completed, false)
    })

    it('toggle task', async() =>{
        const result = await this.todoList.ToggleCompleted(1)
        const task = await this.todoList.tasks(1)

        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})