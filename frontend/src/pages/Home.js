import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

import './Home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [editStatus, setEditStatus] = useState('pending');
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => navigate('/login'), 1000);
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${backendUrl}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const result = await response.json();
            setTasks(result);
        } catch (err) {
            handleError(err);
        }
    };

    const addTask = async () => {
        if (!newTask.trim()) return;
        try {
            const response = await fetch(`${backendUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: newTask, dueDate }),
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess('Task added');
                setNewTask('');
                setDueDate('');
                fetchTasks();
            }
        } catch (err) {
            handleError(err);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess('Task deleted');
                fetchTasks();
            }
        } catch (err) {
            handleError(err);
        }
    };

    const updateTask = async () => {
        try {
            const response = await fetch(`${backendUrl}/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: editValue, dueDate: editDueDate, status: editStatus }),
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess('Task updated');
                setEditingTaskId(null);
                setEditValue('');
                setEditDueDate('');
                setEditStatus('pending');
                fetchTasks();
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="home-container">
            <div className="header-bar">
                <h1 className="welcome-text">Welcome {loggedInUser}</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <div className="task-input-section">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a task"
                    className="task-input"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                />
                <button onClick={addTask} className="add-task-button">Add Task</button>
            </div>

            <div className="tasks-section">
                <h2 className="tasks-heading">Your Tasks</h2>
                {tasks.length > 0 ? (
                    <table className="tasks-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    {editingTaskId === task._id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="edit-input"
                                                />
                                            </td>
                                            <td>
                                                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="edit-select">
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    value={editDueDate}
                                                    onChange={(e) => setEditDueDate(e.target.value)}
                                                    className="edit-date-input"
                                                />
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={updateTask} className="save-button">Save</button>
                                                    <button onClick={() => setEditingTaskId(null)} className="cancel-button">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{task.title}</td>
                                            <td>{task.status}</td>
                                            <td>{task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'N/A'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={() => {
                                                        setEditingTaskId(task._id);
                                                        setEditValue(task.title);
                                                        setEditStatus(task.status);
                                                        setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
                                                    }} className="edit-button">Edit</button>
                                                    <button onClick={() => deleteTask(task._id)} className="delete-button">Delete</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p className="no-tasks-message">No tasks yet</p>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
