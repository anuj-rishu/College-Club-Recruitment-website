import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function AdminPanel({ onLogout }) {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        rollNumber: '',
        phoneNumber: '',
        email: '',
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, [token]);

    const handleEditClick = (user) => {
        setEditingUserId(user._id);
        setFormData(user);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${editingUserId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            setUsers(users.map((user) => (user._id === editingUserId ? response.data.updatedUser : user)));
            setEditingUserId(null);
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-4 hover:bg-red-600 transition-colors duration-300"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <li key={user._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {editingUserId === user._id ? (
                            <div className="space-y-4">
                                <input
                                    className="border p-2 w-full rounded"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                />
                                <input
                                    className="border p-2 w-full rounded"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                />
                                <input
                                    className="border p-2 w-full rounded"
                                    name="rollNumber"
                                    value={formData.rollNumber}
                                    onChange={handleInputChange}
                                    placeholder="Roll Number"
                                />
                                <input
                                    className="border p-2 w-full rounded"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                />
                                <input
                                    className="border p-2 w-full rounded"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
                                        onClick={() => setEditingUserId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                                    <p className="text-gray-600">{user.rollNumber}</p>
                                    <p className="text-gray-600">{user.phoneNumber}</p>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;
