import { useState, useEffect } from "react";
import axios from "axios";

import "./style.css";

function Todo() {
    // Define state variables
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newTodoText, setNewTodoText] = useState("");
    const [dayName, setDayName] = useState("");
    const [priority, setPriority] = useState("");
    const [editId, setEditId] = useState(null);
    const [editTodoText, setEditTodoText] = useState("");
    const [editDayName, setEditDayName] = useState("");
    const [editPriority, setEditPriority] = useState("");
    const [todos, setTodos] = useState([]);
    const [todosByDate, setTodosByDate] = useState({});
    const fetchTodos = () => {
        axios
            .get("http://localhost/projects/taskh/backend/fetchdata.php")
            .then((response) => {
                console.log("Response data:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const groupedTodos = response.data.reduce((acc, todo) => {
                        const todoDate = todo.day;
                        console.log("Todo date:", todoDate);
                        if (!acc[todoDate]) {
                            acc[todoDate] = [];
                        }
                        acc[todoDate].push(todo);
                        return acc;
                    }, {});
                    console.log(
                        "Grouped todos:",
                        Object.keys(groupedTodos).length,
                    );
                    setTodosByDate(groupedTodos);
                } else {
                    setTodosByDate("");
                    console.error("Failed to fetch todos: No todos found");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        fetchTodos();
        console.log("dotdo");
    }, []);
    // Define event handlers
    const handleAddTodo = () => {
        console.log("add");
        console.log("New todo text:", newTodoText);
        console.log("Day name:", dayName);
        console.log("Priority:", priority);

        // Check if all required fields are filled
        if (!newTodoText || !dayName || !priority) {
            console.error("Failed to add todo: Incomplete data");
            return;
        }

        const todoData = {
            text: newTodoText,
            day: dayName,
            priority: priority,
        };
        console.log(todoData);
        axios
            .post("http://localhost/projects/taskh/backend/data.php", todoData)
            .then((response) => {
                if (response.data.status === "success") {
                    const newTodo = {
                        id: response.data.id,
                        text: newTodoText,
                        day: dayName,
                        priority: priority,
                    };

                    // Update state with the newly added todo using functional update
                    setTodos((prevTodos) => [...prevTodos, newTodo]);
                    fetchTodos();
                    // Reset form state
                    setNewTodoText("");
                    setDayName("");
                    setIsFormVisible(false);
                } else {
                    console.error("Failed to add todo:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const handleEditClick = (id, text, day, priority) => {
        setEditId(id);
        setEditTodoText(text);
        setEditDayName(day);
        setEditPriority(priority);
    };
    const handleDeleteTodo = (id) => {
        console.log("Deleting todo with ID:", id);
        axios
            .delete(
                `http://localhost/projects/taskh/backend/delete.php?id=${id}`,
            )
            .then((response) => {
                console.log("Delete response:", response.data);
                if (response.data.status === "success") {
                    // Remove the deleted todo from the todos state
                    setTodos((prevTodos) =>
                        prevTodos.filter((todo) => todo.id !== id),
                    );
                    fetchTodos();
                } else {
                    console.error(
                        "Failed to delete todo:",
                        response.data.message,
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString(undefined, options);
    }

    const handleEditSubmit = () => {
        if (!editTodoText || !editDayName || !editPriority) {
            console.error("Incomplete data for edited todo");
            return;
        }

        const editedTodoData = {
            id: editId,
            text: editTodoText,
            day: editDayName,
            priority: editPriority,
        };
        console.log(editedTodoData);
        axios
            .put(
                "http://localhost/projects/taskh/backend/edited.php",
                editedTodoData,
            )
            .then((response) => {
                if (response.data.status === "success") {
                    fetchTodos();
                    setEditId(null);
                    setEditTodoText("");
                    setEditDayName("");
                    setEditPriority("");
                } else {
                    console.error(
                        "Failed to edit todo:",
                        response.data.message,
                    );
                }
            })
            .catch((error) => {
                console.error("Error editing todo:", error);
            });
    };
    return (
        <div className="main">
            <p className="todo mb-5">ToDo List</p>
            <br />
            <p className="week mt-5">This Week</p>

            <div className="mainplus mt-4">
                <button
                    className="plus bg-blue-500 text-white px-3 py-2 rounded"
                    onClick={() => setIsFormVisible(true)}
                >
                    <img src="Group 14.png" />
                </button>

                {isFormVisible && (
                    <div className=" fixed inset-0 flex items-center justify-center z-50">
                        <div className=""></div>
                        <div className="bg-white rounded-lg p-4 max-w-md w-full">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    required
                                    value={newTodoText}
                                    onChange={(e) =>
                                        setNewTodoText(e.target.value)
                                    }
                                    placeholder="Enter todo text"
                                    className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                                />
                                <input
                                    type="date"
                                    required
                                    value={dayName}
                                    onChange={(e) => setDayName(e.target.value)}
                                    placeholder="Enter day name"
                                    className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                                />

                                <select
                                    value={priority}
                                    required
                                    onChange={(e) => {
                                        console.log(
                                            "Selected priority:",
                                            e.target.value,
                                        );
                                        setPriority(e.target.value);
                                    }}
                                    className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <button
                                onClick={handleAddTodo}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Add Todo
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {Object.entries(todosByDate).map(([date, todos]) => (
                <div key={date}>
                    <span className="day">{formatDate(date)}</span>
                    <br />
                    {todos.map((todo) => (
                        <div
                            className="bo border-b border-gray-300 py-3 flex justify-between"
                            key={todo.id}
                        >
                            <div className="buy">
                                <span>{todo.text}</span>
                                <span className="priori ml-2">
                                    {todo.priority}
                                </span>
                            </div>
                            <div className="buy2">
                                <button
                                    onClick={() =>
                                        handleEditClick(
                                            todo.id,
                                            todo.text,
                                            todo.day,
                                            todo.priority,
                                        )
                                    }
                                    className="w px-2 py-1 bg-blue-500 text-white rounded mr-2"
                                >
                                    <img src="/edit.png" alt="Edit" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="w px-2 py-1 bg-blue-500 text-white rounded mr-2"
                                >
                                    <img src="/del.png" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {editId !== null && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <input
                        type="text"
                        required
                        value={editTodoText}
                        onChange={(e) => setEditTodoText(e.target.value)}
                        placeholder="Enter todo text"
                        className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                    />
                    <input
                        type="date"
                        required
                        value={editDayName}
                        onChange={(e) => setEditDayName(e.target.value)}
                        placeholder="Enter day name"
                        className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                    />
                    <select
                        value={editPriority}
                        required
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="block w-full mb-2 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <button
                        onClick={handleEditSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

export default Todo;
