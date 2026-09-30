const storageKey = "daybook-programmes-v1";
const starterTasks = [
	{ id: 1, title: "Plan the day", done: false },
	{ id: 2, title: "Move your body", done: false },
	{ id: 3, title: "Read for 20 minutes", done: false },
	{ id: 4, title: "Tidy your space", done: false }
];

const activeList = document.querySelector("#active-list");
const completedList = document.querySelector("#completed-list");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const activeEmpty = document.querySelector("#active-empty");
const completedEmpty = document.querySelector("#completed-empty");
const addForm = document.querySelector("#add-form");
const newTaskInput = document.querySelector("#new-task");
let tasks;

try {
	const savedTasks = JSON.parse(localStorage.getItem(storageKey));
	tasks = Array.isArray(savedTasks) ? savedTasks : starterTasks;
} catch {
	tasks = starterTasks;
}

document.querySelector("#today").textContent = new Intl.DateTimeFormat("en", {
	weekday: "long", month: "long", day: "numeric"
}).format(new Date());

function saveTasks() {
	localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function createTaskElement(task) {
	const item = document.createElement("li");
	item.className = "task-item";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = task.done;
	checkbox.setAttribute("aria-label", `${task.done ? "Mark as not completed" : "Mark as completed"}: ${task.title}`);
	checkbox.addEventListener("change", () => {
		task.done = checkbox.checked;
		saveTasks();
		renderTasks();
	});

	const label = document.createElement("span");
	label.className = "task-label";
	label.textContent = task.title;

	const deleteButton = document.createElement("button");
	deleteButton.className = "delete-button";
	deleteButton.type = "button";
	deleteButton.textContent = "×";
	deleteButton.setAttribute("aria-label", `Remove ${task.title}`);
	deleteButton.addEventListener("click", () => {
		tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
		saveTasks();
		renderTasks();
	});

	item.append(checkbox, label, deleteButton);
	return item;
}

function renderTasks() {
	const activeTasks = tasks.filter((task) => !task.done);
	const completedTasks = tasks.filter((task) => task.done);
	activeList.replaceChildren(...activeTasks.map(createTaskElement));
	completedList.replaceChildren(...completedTasks.map(createTaskElement));
	totalCount.textContent = tasks.length;
	activeCount.textContent = `${activeTasks.length} remaining`;
	completedCount.textContent = `${completedTasks.length} done`;
	activeEmpty.hidden = activeTasks.length > 0;
	completedEmpty.hidden = completedTasks.length > 0;
}

addForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const title = newTaskInput.value.trim();
	if (!title) return;

	tasks.push({ id: Date.now(), title, done: false });
	saveTasks();
	renderTasks();
	addForm.reset();
	newTaskInput.focus();
});

renderTasks();
