App = {
    loading: false,
    contracts: {},

    load: async () =>{
        //load app...
        console.log("app loading...");
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()

    },

    loadWeb3: async () =>{
      
        //const web3 = require('web3')

        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
          } else {
            window.alert("Please connect to Metamask.")
          }
          // Modern dapp browsers...
          if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
              // Request account access if needed
              await ethereum.enable()
              // Acccounts now exposed
              web3.eth.sendTransaction({/* ... */})
            } catch (error) {
              // User denied account access...
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
          }
          // Non-dapp browsers...
          else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
    },

    loadAccount: async() =>{
        //App.account = web3.eth.accounts[0]

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        App.account = accounts[0];
        console.log(accounts[0]);
    },

    loadContract: async() =>
    {
      //Create a javascript version of the smart contract (to allow us to call smart contract functions)
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        console.log(todoList)

        //populate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async() =>{
      //prevent double rendering
      if(App.loading){
        return
      }

      //update app loading state
      App.setLoading(true)

      //render account
      $('#account').html(App.account)

      await App.renderTasks()


      App.setLoading(false)
    },

    renderTasks: async() =>{
      //load the total task count
      const taskCount = await App.todoList.taskCount()
      const taskTemplate = $('.taskTemplate')


      //render out each task
      for(var i = 1; i <= taskCount; i++)
      {
        console.log(i)

        //fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]

        //creating html for the task
        const newTaskTemplate = taskTemplate.clone()
        newTaskTemplate.find('.content').html(taskContent)
        newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        //.on('click', App.toggleCompleted)

        //put task in the correct list
        if(taskCompleted)
        {
          $('#completedTaskList').append(newTaskTemplate)
        }
        else
        {
          $('#taskList').append(newTaskTemplate)
        }

        // //show task
        newTaskTemplate.show()
      }

    },

    setLoading: (bool) =>{
      App.loading = bool
      const loader = $('#loader')
      const content = $('#content')

      if(bool)
      {
        loader.show()
        content.hide()
      }
      else
      {
        loader.hide()
        content.show()
      }

    }
}

$(() => {
    $(window).load(()=>{
        App.load()
    })
})