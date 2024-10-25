import React, { useEffect, useState } from 'react';
import styles from '../../css/BookingHistory.module.css';
import ApiService from '../service/ApiService';
import Utils from '../service/Utils';
import AdminSidebar from '../Parial/AdminSidebar';
import BookingDetailModalAdmin from './BookingDetailModalAdmin';
import Toast from '../service/Toast';

const BookingManagement = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState(''); 
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false); 

  const fetchData = async () => {
    try {
      const response = await ApiService.getAllBooking();
      if (response.status === 200) {
        setHistory(response.bookingList);
      } else {
        displayToast('Failed to load bookings');
      }
    } catch (error) {
      displayToast('Error: ' + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
  };

  const filteredHistory = history.filter((booking) =>
    booking.customerDTO.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminSidebar />
      <div className={styles.containerAdmin}>
        <h2>Booking Management</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Room Name</th>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory
              .slice()
              .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
              .map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.roomDTO.name}</td>
                  <td>{booking.customerDTO.name}</td>
                  <td>{booking.customerDTO.phone}</td>
                  <td>{Utils.formatDateTime(booking.bookingDate)}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleViewDetails(booking)}
                    >
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {isModalOpen && (
          <BookingDetailModalAdmin
            booking={selectedBooking}
            closeModal={closeModal}
            setHistory={setHistory}
            setShowToast={setShowToast}
            setToastMessage={setToastMessage}
          />
        )}

        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </>
  );
};

export default BookingManagement;
