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
})