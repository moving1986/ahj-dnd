const allCols = document.querySelectorAll(".col");
const allTasks = document.querySelectorAll(".task");
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const toggleDisplay = function (b) {
  const parentCol = b.closest(".col");
  parentCol.querySelector(".textarea-block").classList.toggle("hidden");
  parentCol.querySelector(".col-addbtn").classList.toggle("hidden");
};

const createRemoveTask = function (task) {
  const removeTask = document.createElement("div");
  removeTask.classList.add("remove-task");
  task.appendChild(removeTask);
};

const removeTask = function (btn) {
  const parentCol = btn.closest(".col");
  btn.closest(".task").remove();
  setLocalStorage(parentCol);
};

const createTask = function (task) {
  if (task) {
    const taskBlock = document.createElement("div");
    taskBlock.classList.add("task");
    taskBlock.textContent = task;
    createRemoveTask(taskBlock);
    return taskBlock;
  }
};

const addTask = function (btn) {
  const parentCol = btn.closest(".col");
  const textArea = parentCol.querySelector("textarea");
  const text = textArea.value;
  if (text) {
    parentCol.querySelector(".tasks-body").appendChild(createTask(text));
    textArea.value = "";
    setLocalStorage(parentCol);
  }
};

const setLocalStorage = function (col) {
  const tasks = col.querySelectorAll(".task");
  const taskText = [];
  tasks.forEach((task) => taskText.push(task.textContent));
  localStorage.setItem(col.id, JSON.stringify(taskText));
};

const renderTask = function (col) {
  const data = localStorage.getItem(col.id);
  if (data) {
    const tasks = JSON.parse(data);
    tasks.forEach((task) =>
      col.querySelector(".tasks-body").appendChild(createTask(task)),
    );
  }
};

allTasks.forEach((task) => createRemoveTask(task));

allCols.forEach((col) => {
  renderTask(col);
  col.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("col-addbtn") ||
      e.target.classList.contains("close-add-card")
    ) {
      toggleDisplay(col);
    } else if (e.target.classList.contains("add-card")) {
      addTask(e.target);
    } else if (e.target.classList.contains("remove-task")) {
      removeTask(e.target);
    }
  });

  const tasks = col.querySelector(".tasks-body");
  let actualEl;

  const onMouseOver = (e) => {
    if (!actualEl) return; 
    actualEl.style.top = e.clientY + "px";
    actualEl.style.left = e.clientX + "px";
  };
  
  const onMouseUp = (e) => {
    if (!actualEl) return; 
  
    const mouseUpTask = e.target;
    const currentParentTasksBody = mouseUpTask.closest(".tasks-body") || tasks;
  
    actualEl.classList.remove("dragged"); 
    actualEl.style = "";
  
    if (mouseUpTask.classList.contains("task")) {
      currentParentTasksBody.insertBefore(actualEl, mouseUpTask);
    } else {
      currentParentTasksBody.appendChild(actualEl);
    }
  
    setLocalStorage(col);
    setLocalStorage(currentParentTasksBody.closest(".col"));

    document.documentElement.removeEventListener("mouseup", onMouseUp);
    document.documentElement.removeEventListener("mouseover", onMouseOver);
    actualEl = undefined;
  };
  
  tasks.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("task")) {
      actualEl = e.target;
      actualEl.classList.add("dragged"); 

      document.documentElement.addEventListener("mouseup", onMouseUp);
      document.documentElement.addEventListener("mouseover", onMouseOver);
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && actualEl) {
      actualEl.classList.remove("dragged");
      actualEl = undefined;
      document.documentElement.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseover", onMouseOver);
    }
  });
});
