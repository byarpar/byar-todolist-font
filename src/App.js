import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ firstName: '', lastName: '', email: '', company: '', phone: '' });
    const [editingContact, setEditingContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingContact) {
            setEditingContact({ ...editingContact, [name]: value });
        } else {
            setNewContact({ ...newContact, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContact) {
                await axios.put(`http://localhost:3001/contacts/${editingContact.$id}`, editingContact);
                setEditingContact(null);
            } else {
                await axios.post('http://localhost:3001/contacts', newContact);
                setNewContact({ firstName: '', lastName: '', email: '', company: '', phone: '' });
            }
            fetchContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setNewContact({ firstName: contact.firstName, lastName: contact.lastName, email: contact.email, company: contact.company, phone: contact.phone });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/contacts/${id}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <div>
            <h2>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={editingContact ? editingContact.firstName : newContact.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={editingContact ? editingContact.lastName : newContact.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editingContact ? editingContact.email : newContact.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={editingContact ? editingContact.company : newContact.company}
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={editingContact ? editingContact.phone : newContact.phone}
                    onChange={handleChange}
                />
                <button type="submit">{editingContact ? 'Update Contact' : 'Add Contact'}</button>
                {editingContact && <button type="button" onClick={() => setEditingContact(null)}>Cancel</button>}
            </form>

            <h1>Contact List</h1>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.$id}>
                        {contact.firstName} {contact.lastName} - {contact.email}
                        <div>
                            <button onClick={() => handleEdit(contact)}>Edit</button>
                            <button onClick={() => handleDelete(contact.$id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Contacts;
