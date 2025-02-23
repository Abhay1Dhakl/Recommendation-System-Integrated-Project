import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

const CardsAdmin = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    heading: '',
    descr: '',
    topic: '',
    category: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/cards/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setCards(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch cards');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleFormSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    
    setLoading(true);
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('descr', formData.descr);
    data.append('topic', formData.topic);
    data.append('category', formData.category);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      if (editingCard) {
        // Update existing card
        await axios.put(`http://localhost:8000/api/user/cards/${editingCard.id}/`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSuccessMessage('Card updated successfully!');
      } else {
        // Create new card
        await axios.post('http://localhost:8000/api/user/cards/', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSuccessMessage('Card created successfully!');
      }
      fetchCards();
      setShowModal(false);
      setFormData({ heading: '', descr: '', topic: '', category: '', photo: null });
      setEditingCard(null);
    } catch (error) {
      setErrorMessage('Failed to save the card');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      heading: card.heading,
      descr: card.descr,
      topic: card.topic,
      category: card.category,
      photo: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/user/cards/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSuccessMessage('Card deleted successfully!');
      fetchCards();
    } catch (error) {
      setErrorMessage('Failed to delete the card');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Cards</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button onClick={() => setShowModal(true)} variant="primary" className="mb-3">
        Add New Card
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Heading</th>
            <th>Description</th>
            <th>Topic</th>
            <th>Category</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id}>
              <td>{card.heading}</td>
              <td>{card.descr}</td>
              <td>{card.topic}</td>
              <td>{card.category}</td>
              <td>
                {card.photo ? <img src={card.photo} alt={card.heading} style={{ maxHeight: '50px' }} /> : 'No Image'}
              </td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(card)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(card.id)}>
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
          <Modal.Title>{editingCard ? 'Edit Card' : 'Add New Card'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descr"
                value={formData.descr}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" name="photo" onChange={handleFileChange} />
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

export default CardsAdmin;
