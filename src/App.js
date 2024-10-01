import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/contact');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/contact/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post('http://localhost:3000/contact', formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
      });
      fetchContacts();
    } catch (error) {
      console.error('Error adding/updating contact:', error);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      company: contact.company,
      phone: contact.phone,
    });
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  

  return (
    <div className="container">
      <h1> "To-Do List" application</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <button type="submit">{editId ? 'Update Contact' : 'Add Contact'}</button>
      </form>

      
      <ul>
        {contacts.map(contact => (
          <li key={contact._id}>
            <div className="contact-info">
              <span>{contact.firstName} {contact.lastName}</span>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>
              <span>{contact.company}</span>
            </div>
            <div className="buttons-container">
              <button className="edit-button" onClick={() => handleEdit(contact)}>Edit</button>
              <button onClick={() => handleDelete(contact._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
 