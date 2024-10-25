import React, { useEffect, useState } from 'react';
import styles from '../../css/RoomManagement.module.css';
import Modal from 'react-modal';
import AdminSidebar from '../Parial/AdminSidebar';
import { MdAdd, MdEdit } from 'react-icons/md';
import ApiService from '../service/ApiService';
import Toast from '../service/Toast';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false); 

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const openModal = (room = null) => {
    if (room) {
      setCurrentRoom(room);
    } else {
      setCurrentRoom({
        name: '',
        price: '',
        type: 'Single',
        status: 'true',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
  };

  const editRoomFetch = async (id, data) => {
    try {
      const response = await ApiService.updateRoom(id, data);
      if (response.status === 200) {
        setRooms(response.roomList);
        displayToast("Room updated successfully");
      } else {
        displayToast("Failed to update room");
      }
    } catch (error) {
      displayToast(`Error: ${error.message}`);
    }
  };

  const createRoomFetch = async (data) => {
    try {
      const response = await ApiService.createRoom(data);
      if (response.status === 200) {
        setRooms(response.roomList);
        displayToast("Room added successfully");
      } else {
        displayToast("Failed to add room");
      }
    } catch (error) {
      displayToast(`Error: ${error.message}`);
    }
  };

  const saveChanges = () => {
    const updatedData = {
      name: currentRoom.name,
      price: currentRoom.price,
      type: currentRoom.type,
      status: currentRoom.status,
      description: currentRoom.description
    };

    if (currentRoom.id) {
      editRoomFetch(currentRoom.id, updatedData);
    } else {
      createRoomFetch(updatedData);
    }

    closeModal();
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const response = await ApiService.getAllRoom();
      if (response.status === 200) {
        setRooms(response.roomList);
      } else {
        displayToast("Failed to load rooms");
      }
    } catch (error) {
      displayToast(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AdminSidebar />
      <div className={styles.container}>
        <div className={styles.header}>
          <input
            type="text"
            placeholder="Search by room name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className={styles.addButton}
            onClick={() => openModal()}
          >
            <MdAdd />
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Room Name</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room, key) => (
              <tr key={room.id}>
                <td>{key + 1}</td>
                <td>{room.name}</td>
                <td>{room.price} $</td>
                <td>{room.type}</td>
                <td>{room.status ? 'Enable' : 'Disable'}</td>
                <td className={styles.description}>{room.description}</td>
                <td className={styles.action}>
                  <button
                    className={styles.editButton}
                    onClick={() => openModal(room)}
                  >
                    <MdEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <Modal isOpen={isModalOpen} onRequestClose={closeModal} className={styles.modal}>
            <h2>{currentRoom?.id ? 'Edit Room' : 'Add New Room'}</h2>
            <div className={styles.modalContent}>
              <label>Room Name</label>
              <input
                type="text"
                name="name"
                value={currentRoom.name}
                onChange={handleInputChange}
                disabled={!!currentRoom?.id}
              />
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={currentRoom.price}
                onChange={handleInputChange}
              />
              <label>Type</label>
              <select name="type" value={currentRoom.type} onChange={handleInputChange}>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
              </select>
              <label>Status</label>
              <select name="status" value={currentRoom.status} onChange={handleInputChange}>
                <option value="true">Enable</option>
                <option value="false">Disable</option>
              </select>
              <label>Description</label>
              <textarea
                name="description"
                value={currentRoom.description}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={saveChanges}>Save</button>
            </div>
          </Modal>
        )}

        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </>
  );
};

export default RoomManagement;
