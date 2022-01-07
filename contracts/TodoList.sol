// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList{
    uint public taskCount = 0;

    struct Task { 
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed);
    event TaskCompleted(uint id, bool completed);

    constructor() public 
    {
        CreateTask("Check out this first task!");
    }


    function CreateTask(string memory _content) public
    {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

        //create event that task was created
        emit TaskCreated(taskCount, _content, false);
    }

    function ToggleCompleted(uint id) public
    {
        Task memory task = tasks[id];
        task.completed = !task.completed;
        tasks[id] = task;

        emit TaskCompleted(id, task.completed);
    }
}