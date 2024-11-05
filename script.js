// Funkcja uruchamiająca się po załadowaniu całego dokumentu, ładuje zadania z localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

// Maksymalna liczba znaków dla nowego zadania
const maxChars = 50;

// Funkcja aktualizująca licznik pozostałych znaków podczas wprowadzania nowego zadania
function updateCharCounter() {
    const taskInput = document.getElementById("new-task");
    const remainingChars = maxChars - taskInput.value.length;
    document.getElementById("char-counter").textContent = `Pozostało ${remainingChars} znaków`;
}

// Funkcja ładująca zadania z localStorage i wyświetlająca je na liście przy starcie strony
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.id));
}

// Funkcja dodająca nowe zadanie - dodaje zadanie do listy oraz zapisuje w localStorage
function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    // Sprawdzenie, czy pole nie jest puste
    if (taskText !== "") {
        const taskId = Date.now().toString(); // Unikalne ID oparte na czasie
        addTaskToDOM(taskText, taskId);       // Dodanie zadania do interfejsu
        saveTask(taskText, taskId);           // Zapisanie zadania w localStorage
        taskInput.value = "";                 // Wyczyść pole tekstowe po dodaniu zadania
        updateCharCounter();                  // Aktualizacja licznika znaków
    }
}

// Funkcja dodająca zadanie do listy w DOM (widoczne na stronie)
function addTaskToDOM(taskText, taskId) {
    const taskList = document.getElementById("task-list");

    // Tworzenie elementu <li> dla zadania
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.setAttribute("data-id", taskId);

    // Tworzenie elementu <span> do wyświetlania tekstu zadania
    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;

    // Tworzenie przycisku "Edytuj"
    const editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.onclick = () => editTask(taskId, taskSpan, editButton);

    // Tworzenie przycisku "Usuń"
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.onclick = () => removeTask(taskId);

    // Dodanie elementów do zadania <li>
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    // Dodanie zadania do listy zadań
    taskList.appendChild(taskItem);
}

// Funkcja zapisująca zadanie w localStorage
function saveTask(taskText, taskId) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, id: taskId });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funkcja aktualizująca tekst zadania w localStorage po jego edycji
function updateTask(taskId, newText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, text: newText } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

// Funkcja usuwająca zadanie z listy oraz z localStorage
function removeTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskList = document.getElementById("task-list");
    const taskItem = document.querySelector(`li[data-id="${taskId}"]`);
    if (taskItem) {
        taskList.removeChild(taskItem);
    }
}

// Funkcja obsługująca edycję zadania po kliknięciu przycisku "Edytuj"
function editTask(taskId, taskSpan, editButton) {
    if (editButton.textContent === "Edytuj") {
        // Tryb edycji: zamiana <span> na pole <input>
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskSpan.textContent;
        input.maxLength = maxChars;

        // Aktualizowanie licznika znaków podczas edycji
        input.addEventListener("input", () => {
            const remainingChars = maxChars - input.value.length;
            document.getElementById("char-counter").textContent = `Pozostało ${remainingChars} znaków`;
        });

        taskSpan.replaceWith(input); // Zamiana tekstu zadania na pole tekstowe do edycji
        editButton.textContent = "Zapisz"; // Zmiana tekstu przycisku na "Zapisz"

        // Dodajemy identyfikator `data-task-id`, aby mieć dostęp do zadania w localStorage
        input.setAttribute("data-task-id", taskId);
    } else {
        // Tryb zapisu: pobranie wartości z pola <input>
        const input = document.querySelector(`input[data-task-id="${taskId}"]`);
        const newText = input.value.trim();

        if (newText) {
            // Zaktualizowanie treści w <span>
            taskSpan.textContent = newText;
            input.replaceWith(taskSpan); // Zamiana pola <input> z powrotem na <span>
            editButton.textContent = "Edytuj"; // Zmiana tekstu przycisku na "Edytuj"
            
            // Zapisanie zaktualizowanego tekstu w localStorage
            updateTask(taskId, newText);
        }

        // Przywrócenie domyślnego licznika znaków
        updateCharCounter();
    }
}
