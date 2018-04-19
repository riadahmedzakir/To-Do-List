   (function() {
       "use strict";
       var vm = window;


       //Storage Getter & Setter Functions 
       function setJsonOnLocalStorage(taskList) {
           localStorage.setItem("taskList", JSON.stringify(taskList));
       }

       function loadJsonFromLocalStorage() {
           var taskList = localStorage.getItem("taskList");
           var dataSet = JSON.parse(taskList);
           return dataSet;
       }

       // GuID Genarator
       function guIdGenarator() {
           function s4() {
               return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
           }
           return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
       }

       function findTaskByGuId(searchId) {
           var array = loadJsonFromLocalStorage();
           var index = _.indexOf(array, _.findWhere(array, { guId: searchId }));
           return index;
       }

       //Filter functions
       function filterByToDo() {
           var taskList = loadJsonFromLocalStorage();
           var filteredList = _.filter(taskList, function(task) {
               return task.taskStatus === "OnQueue" || task.taskStatus === "InProgress";
           });
           return filteredList;
       }

       function filterByCompleted() {
           var taskList = loadJsonFromLocalStorage();
           var filteredList = _.filter(taskList, function(task) {
               return task.taskStatus === "Completed";
           });
           return filteredList;
       }

       function searchTask(value) {
           var taskList = loadJsonFromLocalStorage();
           var filteredList = _.filter(taskList, function(task) {
               return (task.taskName).toUpperCase().match(value) || (task.taskPriority).toUpperCase() === value || (task.taskDetail).toUpperCase().match(value);
           });
           return filteredList;
       }

       function sortByDate(sortType) {
           if (sortType === "byDate") {
               var taskList = loadJsonFromLocalStorage();
               var filteredList = _.sortBy(taskList, "taskDate");
               return filteredList;
           } else if (sortType === "byPriority") {
               var taskList = loadJsonFromLocalStorage();

               var filteredList = _.filter(taskList, function(task) {
                   return task.taskPriority === "Low";
               });

               var temp = _.filter(taskList, function(task) {
                   return task.taskPriority === "Medium";
               });

               for (var x = 0; x < temp.length; x++) {
                   filteredList.push(temp[x]);
               }

               var temp = _.filter(taskList, function(task) {
                   return task.taskPriority === "High";
               });

               for (var x = 0; x < temp.length; x++) {
                   filteredList.push(temp[x]);
               }
               return filteredList;
           } else {
               return loadJsonFromLocalStorage();
           }
       }

       //Event Listner Initialize
       function initializeEventListners() {
           var addTask = document.getElementById('addTask');
           var searhTaskInput = document.getElementById('searhTaskInput');
           var editTask = document.getElementById("editTask");
           var deleteTask = document.getElementById("deleteTask");
           var filterAll = document.getElementById("filterAll");
           var filterToDo = document.getElementById("filterToDo");
           var filterComplete = document.getElementById("filterComplete");
           var sortTask = document.getElementById("sortTask");
           var saveTask = document.getElementById("saveTask");

           addTask.addEventListener('click', function() {
               formValidator();
           });

           filterAll.addEventListener("click", function() {
               document.getElementById("inputContainer").innerHTML = null;
               loadJsonFromLocalStorage().forEach(toDoList);
           });

           filterToDo.addEventListener("click", function() {
               document.getElementById("inputContainer").innerHTML = null;
               var taskList = filterByToDo();
               taskList.forEach(toDoList);
           });

           filterComplete.addEventListener("click", function() {
               document.getElementById("inputContainer").innerHTML = null;
               var taskList = filterByCompleted();
               taskList.forEach(toDoList);
           });

           searhTaskInput.addEventListener("keypress", function(event) {
               if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                   var taskList = searchTask((this.value).toUpperCase());
                   document.getElementById("inputContainer").innerHTML = null;
                   taskList.forEach(toDoList);
               }
           });

           sortTask.addEventListener("click", function(event) {
               var taskList = sortByDate(this.value);
               document.getElementById("inputContainer").innerHTML = null;
               taskList.forEach(toDoList);
           });

           saveTask.addEventListener("click", function() {
               var guId = document.getElementById("guId").value;
               updateValidator(guId);
           });
       }

       //Form insert validator
       function formValidator() {
           var taskNameErr, taskDetailErr, taskDateErr, taskPriorityErr, taskStatusErr = "";

           var taskName = document.getElementsByTagName("input")[1].value;
           var taskDetail = document.getElementsByTagName("input")[2].value;
           var taskDate = document.getElementsByTagName("input")[3].value;
           var taskPriority = document.getElementsByTagName("select")[0].value;
           var taskStatus = document.getElementsByTagName("select")[1].value;

           if (taskName === null || taskName === "") {
               taskNameErr = "*Please provide a task name";
               document.getElementById("taskNameErr").innerHTML = taskNameErr;
           } else {
               taskNameErr = "";
               document.getElementById("taskNameErr").innerHTML = taskNameErr;
           }

           if (taskDetail === null || taskDetail === "") {
               taskDetailErr = "*Please provide details for your task";
               document.getElementById("taskDetailErr").innerHTML = taskDetailErr;
           } else {
               taskDetailErr = "";
               document.getElementById("taskDetailErr").innerHTML = taskDetailErr;
           }

           if (taskDate === null || moment(taskDate).isValid() === false) {
               taskDateErr = "*Please provide a valid date";
               document.getElementById("taskDateErr").innerHTML = taskDateErr;
           } else {
               taskDateErr = "";
               document.getElementById("taskDateErr").innerHTML = taskDateErr;
           }

           if (taskPriority !== 'High' && taskPriority !== 'Medium' && taskPriority !== 'Low') {
               taskPriorityErr = "*Please choose your priority";
               document.getElementById("taskPriorityErr").innerHTML = taskPriorityErr;
           } else {
               taskPriorityErr = "";
               document.getElementById("taskPriorityErr").innerHTML = taskPriorityErr;
           }

           if (taskStatus !== 'OnQueue' && taskStatus !== 'InProgress' && taskStatus !== 'Completed') {
               taskStatusErr = "*Please select your task status";
               document.getElementById("taskStatusErr").innerHTML = taskStatusErr;
           } else {
               taskStatusErr = "";
               document.getElementById("taskStatusErr").innerHTML = taskStatusErr;
           }


           if (taskNameErr === "" && taskDetailErr === "" && taskDateErr === "" && taskStatusErr === "" && taskPriorityErr === "") {
               addTask(taskName, taskDetail, taskDate, taskPriority, taskStatus, guIdGenarator());
               document.getElementsByTagName("input")[1].value = '';
               document.getElementsByTagName("input")[2].value = '';
               document.getElementsByTagName("input")[3].value = ''
               document.getElementsByTagName("select")[0].value = 'Priority...';
               document.getElementsByTagName("select")[1].value = 'Status...';
           }
       }

       //Form update validator
       function updateValidator(taskId) {
           var editTaskNameErr, editTaskDetailErr, editTaskDateErr, editTaskPriorityErr, editTaskStatusErr = "";
           var taskList = loadJsonFromLocalStorage();

           var editTaskName = document.getElementById("editTaskName").value;
           var editTaskDetails = document.getElementById("editTaskDetails").value;
           var editTaskDate = document.getElementById("editTaskDate").value;
           var editTaskPriority = document.getElementById("editTaskPriority").value;
           var editTaskStatus = document.getElementById("editTaskStatus").value;

           if (editTaskName === null || editTaskName === "") {
               editTaskNameErr = "*Please provide a task name";
               document.getElementById("editTaskNameErr").innerHTML = editTaskNameErr;
           } else {
               editTaskNameErr = "";
               document.getElementById("editTaskNameErr").innerHTML = editTaskNameErr;
           }

           if (editTaskDetails === null || editTaskDetails === "") {
               editTaskDetailErr = "*Please provide details for your task";
               document.getElementById("editTaskDetailErr").innerHTML = editTaskDetailErr;
           } else {
               editTaskDetailErr = "";
               document.getElementById("editTaskDetailErr").innerHTML = editTaskDetailErr;
           }

           if (editTaskDate === null || moment(editTaskDate).isValid() === false) {
               editTaskDateErr = "*Please provide a valid date";
               document.getElementById("editTaskDateErr").innerHTML = editTaskDateErr;
           } else {
               editTaskDateErr = "";
               document.getElementById("editTaskDateErr").innerHTML = editTaskDateErr;
           }

           if (editTaskPriority !== 'High' && editTaskPriority !== 'Medium' && editTaskPriority !== 'Low') {
               editTaskPriorityErr = "*Please choose your priority";
               document.getElementById("editTaskPriorityErr").innerHTML = editTaskPriorityErr;
           } else {
               editTaskPriorityErr = "";
               document.getElementById("editTaskPriorityErr").innerHTML = editTaskPriorityErr;
           }

           if (editTaskStatus !== 'OnQueue' && editTaskStatus !== 'InProgress' && editTaskStatus !== 'Completed') {
               editTaskStatusErr = "*Please select your task status";
               document.getElementById("editTaskStatusErr").innerHTML = editTaskStatusErr;
           } else {
               editTaskStatusErr = "";
               document.getElementById("editTaskStatusErr").innerHTML = editTaskStatusErr;
           }

           if (editTaskNameErr === "" && editTaskDetailErr === "" && editTaskDateErr === "" && editTaskPriorityErr === "" && editTaskStatusErr === "") {
               var taskNumber = findTaskByGuId(taskId);
               taskList[taskNumber]["taskName"] = document.getElementById("editTaskName").value;;
               taskList[taskNumber]["taskDetail"] = document.getElementById("editTaskDetails").value;
               taskList[taskNumber]["taskDate"] = document.getElementById("editTaskDate").value;
               taskList[taskNumber]["taskPriority"] = document.getElementById("editTaskPriority").value;
               taskList[taskNumber]["taskStatus"] = document.getElementById("editTaskStatus").value;
               setJsonOnLocalStorage(taskList);
               document.getElementById("inputContainer").innerHTML = null;
               taskList.forEach(toDoList);
               $('#editModal').modal('hide');
           }
       }

       //Add new task
       function addTask(taskName, taskDetail, taskDate, taskPriority, taskStatus, guId) {
           if (loadJsonFromLocalStorage() === null) {
               var newTask = {
                   "taskName": taskName,
                   "taskDetail": taskDetail,
                   "taskDate": taskDate,
                   "taskPriority": taskPriority,
                   "taskStatus": taskStatus,
                   "guId": guId
               }

               var newTaskList = [];
               newTaskList.push(newTask);
               setJsonOnLocalStorage(newTaskList);
           } else {
               var newTask = {
                   "taskName": taskName,
                   "taskDetail": taskDetail,
                   "taskDate": taskDate,
                   "taskPriority": taskPriority,
                   "taskStatus": taskStatus,
                   "guId": guId
               }

               var oldTask = loadJsonFromLocalStorage();
               oldTask.push(newTask);
               setJsonOnLocalStorage(oldTask);
           }

           document.getElementById("inputContainer").innerHTML = null;
           loadJsonFromLocalStorage().forEach(toDoList);
       }

       //Task card generator 
       function toDoList(task) {
           if (loadJsonFromLocalStorage() != null) {
               // List container 
               var newDiv = document.createElement("div");
               newDiv.classList.add('col-md-8');
               newDiv.classList.add('alert');
               newDiv.classList.add('alert-info');
               newDiv.classList.add('task-card');

               var element = document.getElementById("inputContainer");
               element.appendChild(newDiv);

               //Task name
               var newTaskName = document.createElement('h2');
               var newTaskNameText = document.createTextNode(task["taskName"]);
               newDiv.appendChild(newTaskName);
               newTaskName.appendChild(newTaskNameText);

               //Task status
               var newTaskStatus = document.createElement('sup');
               newTaskName.appendChild(newTaskStatus);
               if (task["taskStatus"] === "InProgress") {
                   var newTaskStatusText = document.createTextNode("In Progress");
                   newTaskStatus.appendChild(newTaskStatusText);
               } else if (task["taskStatus"] === "Completed") {
                   var newTaskStatusText = document.createTextNode("Completed");
                   newTaskStatus.appendChild(newTaskStatusText);
               } else if (task["taskStatus"] === "OnQueue") {
                   var newTaskStatusText = document.createTextNode("On Queue");
                   newTaskStatus.appendChild(newTaskStatusText);
               }

               //Task details
               var newTaskDetails = document.createElement('p');
               newTaskDetails.classList.add("task-detail-container")
               newDiv.appendChild(newTaskDetails);
               var newTaskDetailsText = document.createTextNode(task["taskDetail"]);
               newTaskDetails.appendChild(newTaskDetailsText);

               //Task date 
               var newTaskDate = document.createElement('p');
               newDiv.appendChild(newTaskDate);
               var newTaskDateLabel = document.createElement('b');
               newTaskDate.appendChild(newTaskDateLabel);
               var newTaskDateLabelText = document.createTextNode("Due Date: ");
               newTaskDateLabel.appendChild(newTaskDateLabelText);
               var newTaskDateText = document.createTextNode(task["taskDate"] + " ");
               newTaskDate.appendChild(newTaskDateText);

               //Task Priority
               var newTaskPriority = document.createElement('b');
               newTaskDate.appendChild(newTaskPriority);
               var newTaskPriorityLabel = document.createTextNode("Priority: ");
               newTaskPriority.appendChild(newTaskPriorityLabel);
               var newTaskPriorityText = document.createTextNode(task["taskPriority"]);
               newTaskDate.appendChild(newTaskPriorityText);

               //Edit button 
               var editButton = document.createElement("button");
               editButton.classList.add("btn");
               editButton.classList.add("btn-primary");
               editButton.classList.add("btn-sm");
               editButton.classList.add("btn-block");
               editButton.setAttribute("type", "button");
               editButton.setAttribute("id", "editTask");
               editButton.setAttribute("data-toggle", "modal");
               editButton.setAttribute("data-target", "#editModal");
               editButton.setAttribute("data-backdrop", "static");
               editButton.setAttribute("data-keyboard", "false");
               var nodeEdit = document.createTextNode("Edit");
               editButton.addEventListener("click", function() {
                   editTask(task["guId"]);
               });
               newDiv.appendChild(editButton);
               editButton.appendChild(nodeEdit);

               //Delete button
               var deleteButton = document.createElement("button");
               deleteButton.classList.add("btn");
               deleteButton.classList.add("btn-danger");
               deleteButton.classList.add("btn-sm");
               deleteButton.classList.add("btn-block");
               deleteButton.setAttribute("type", "button");
               deleteButton.setAttribute("id", "deleteTask");
               deleteButton.setAttribute("data-toggle", "modal");
               deleteButton.setAttribute("data-target", "#deleteModal");
               deleteButton.setAttribute("data-backdrop", "static");
               deleteButton.setAttribute("data-keyboard", "false");
               var nodeDelete = document.createTextNode("Delete");
               deleteButton.addEventListener("click", function() {
                   deleteTask(task["guId"]);
               });
               newDiv.appendChild(deleteButton);
               deleteButton.appendChild(nodeDelete);
           }
       }

       // Edit function
       function editTask(taskId) {
           var taskNumber = findTaskByGuId(taskId);
           var taskList = loadJsonFromLocalStorage();

           var editTaskName = document.getElementById('editTaskName');
           editTaskName.value = taskList[taskNumber]["taskName"];

           var editTaskDetails = document.getElementById('editTaskDetails');
           editTaskDetails.value = taskList[taskNumber]["taskDetail"];

           var editTaskDate = document.getElementById('editTaskDate');
           editTaskDate.value = taskList[taskNumber]["taskDate"];

           var editTaskPriority = document.getElementById('editTaskPriority');
           editTaskPriority.value = taskList[taskNumber]["taskPriority"];

           var editTaskStatus = document.getElementById('editTaskStatus');
           editTaskStatus.value = taskList[taskNumber]["taskStatus"];

           var guId = document.getElementById('guId');
           guId.value = taskList[taskNumber]["guId"];
       }

       function deleteTask(taskId) {
           var taskNumber = findTaskByGuId(taskId);
           var confirmTaskDelete = document.getElementById('confirmTaskDelete');
           var taskList = loadJsonFromLocalStorage();
           confirmTaskDelete.addEventListener("click", function() {
               taskList.splice(taskNumber, 1);
               setJsonOnLocalStorage(taskList);
               document.getElementById("inputContainer").innerHTML = null;
               taskList.forEach(toDoList);
           });
       }

       //Init Function
       function init() {
           initializeEventListners();
           sortByDate();
           if (loadJsonFromLocalStorage() !== null) {
               var taskList = loadJsonFromLocalStorage();
               taskList.forEach(toDoList);
           }
       }

       init();
   })(window);