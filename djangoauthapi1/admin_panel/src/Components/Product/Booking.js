import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    child: '',
    adult: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/booking/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch bookings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    
    setLoading(true);

    try {
      if (editingBooking) {
        // Update existing booking
        await axios.put(`http://localhost:8000/api/user/booking/${editingBooking.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSuccessMessage('Booking updated successfully!');
      } else {
        // Create new booking
        await axios.post('http://localhost:8000/api/user/booking/', formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSuccessMessage('Booking created successfully!');
      }
      fetchBookings();
      setShowModal(false);
      setFormData({ date: '', child: '', adult: '' });
      setEditingBooking(null);
    } catch (error) {
      setErrorMessage('Failed to save the booking');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      date: booking.date,
      child: booking.child,
      adult: booking.adult,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/user/booking/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSuccessMessage('Booking deleted successfully!');
      fetchBookings();
    } catch (error) {
      setErrorMessage('Failed to delete the booking');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Bookings</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button onClick={() => setShowModal(true)} variant="primary" className="mb-3">
        Add New Booking
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Child</th>
            <th>Adult</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.date}</td>
              <td>{booking.child}</td>
              <td>{booking.adult}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(booking)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(booking.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Child</Form.Label>
              <Form.Control
                type="number"
                name="child"
                value={formData.child}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adult</Form.Label>
              <Form.Control
                type="number"
                name="adult"
                value={formData.adult}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Booking;
