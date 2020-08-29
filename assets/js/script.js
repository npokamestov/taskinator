var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");

var taskIdCounter = 0;
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    //console.dir(taskNameInput)

    //check if input value are empty string
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    // console.log(isEdit);
    //has data attribute, so get task id and call fucntion to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        //send it as an arguement to createTaskEl
        createTaskEl(taskDataObj);                               //keep in the else????????????
    }
};

var completeEditTask = function(taskName, taskType, taskId) {
    // console.log(taskName, taskType, taskId);
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");
    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();
    // console.log(taskDataObj);
    // console.log(taskDataObj.status);

    var taskActionsEl = createTaskActions(taskIdCounter);
    //console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);
    // console.log(listItemEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

// formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    //console.log(event.target);
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        //console.log("you clicked a delete button!");
        //get the elemnt's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId)
        //console.log(taskId);
    }
};

var editTask = function(taskId) {
    // console.log("editing task #" + taskId);
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // console.log(taskName);
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // console.log(taskType);
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    //console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        taskSelected.remove();
    //  console.log(taskSelected);
    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesnt match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // console.log(event.target);
    // console.log(event.target.getAttribute("data-task-id"));
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    //update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    // console.log(tasks);
    saveTasks();
};

var dragTaskHandler = function(event) {
    // console.log("event.target:", event.target);
    // console.log("event.type:", event.type);
    // console.log("event", event);

    var taskId = event.target.getAttribute("data-task-id");
    // console.log("Task ID:", taskId);
    // console.log("event", event);
    // console.log("event.target:", event.target)
    event.dataTransfer.setData("text/plain", taskId);
    // var getId = event.dataTransfer.getData("text/plain");
    // console.log("getId:", getId, typeof getId);
};

var dropZoneDragHandler = function(event) {
    // console.log("Dragover Event Target:", event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        // console.dir(taskListEl);
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    // console.log("Drop Event Target:", event.target, event.dataTransfer, id);
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    // console.log(draggableElement);
    // console.dir(draggableElement);
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // console.log(statusType);
    // console.dir(dropZoneEl);
    //set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    // console.dir(statusSelectEl);
    // console.log(statusSelectEl);
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);

    //loop through task array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    // console.log(tasks);
    saveTasks();
};

var dragLeaveHandler = function(event) {
    // console.dir(event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // console.log(tasks)
};

var loadTasks = function() {
    // get task items from local storage
    var savedTasks = localStorage.getItem("tasks");
    // console.log(savedTasks)
    // console.log( typeof savedTasks)
    if (!savedTasks) {
        return false;
    }
    // console.log(savedTasks)
    // console.log(typeof savedTasks)
    // convert tasks from the stringified format back into an array of objects
    savedTasks = JSON.parse(savedTasks);
    // console.log(savedTasks)
    // iterate through tasks array and create task elements on the page from it
    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // console.log(savedTasks[i]);
        savedTasks[i].id = taskIdCounter

        tasks.push(savedTasks[i])
        // console.log(savedTasks[i])
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", savedTasks[i].id);
        listItemEl.setAttribute("draggable", "true");
        console.log(listItemEl)

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + savedTasks[i].name + "</h3><span class='task-type'>" + savedTasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(savedTasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        if (savedTasks[i].status == "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (savedTasks[i].status == "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (savedTasks[i].status == "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        taskIdCounter++;
        // console.log(listItemEl);
        // pass each task object into the 'createTaskEl()' function
        // createTaskEl(savedTasks[i]);
    }
};






// var loadTasks = function() {
//     var tasks = localStorage.getItem("tasks")
//     // console.log(savedTasks)
//     if ("tasks" === null) {
//         tasks = [];
//         return false;
//     }
//     tasks = JSON.parse(tasks);
//     // console.log(savedTasks)
//     for (var i = 0; i < tasks.length; i++) {
//         // console.log(savedTasks[i])
//         tasks[i].id = taskIdCounter
//         // console.log(tasks[i]);
//         var listItemEl = document.createElement("li");
//         listItemEl.className = "task-item";
//         //add task id as a custom attribute
//         listItemEl.setAttribute("data-task-id", tasks[i].id);
//         listItemEl.setAttribute("draggable", "true");
//         // console.log(listItemEl)
//         var taskInfoEl = document.createElement("div");
//         //give it a class name
//         taskInfoEl.className = "task-info";
//         //add HTML content to div
//         taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
//         listItemEl.appendChild(taskInfoEl);
//         var taskActionsEl = createTaskActions(tasks[i].id);
//         //console.log(taskActionsEl);
//         listItemEl.appendChild(taskActionsEl);
//         if (tasks[i].status.value === "to do") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
//             tasksToDoEl.appendChild(listItemEl)
//         }
//         else if (tasks[i].status.value === "in progress") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
//             tasksInProgressEl.appendChild(listItemEl)
//         }
//         else if (tasks[i].status.value === "to do") {
//             listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
//             tasksCompletedEl.appendChild(listItemEl)
//         }
//     taskIdCounter++;
//     console.log(task)
//     }
// }











formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();