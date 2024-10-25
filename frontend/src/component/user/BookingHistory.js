import React, { useEffect, useState } from 'react';
import styles from '../../css/BookingHistory.module.css';
import BookingDetailModal from './BookingDetailModal';
import Header from '../Parial/Header';
import ApiService from '../service/ApiService';
import Utils from '../service/Utils';

const BookingHistory = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchData = async () => { 
    setLoading(true);
    try {
      const response = await ApiService.getBookingByCustomer();
      if(response.status === 200){
        console.log(response);
        setHistory(response.bookingList);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Booking History</h2>

        {loading ? ( 
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            {history.length === 0 ? ( 
              <div className={styles.emptyMessage}>No bookings found.</div>
            ) : (
              <table className={styles.bookingTable}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Room Name</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.roomDTO.name}</td>
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
            )}
          </>
        )}

        {isModalOpen && (
          <BookingDetailModal booking={selectedBooking} setHistory={setHistory} closeModal={closeModal} />
        )}
      </div>
    </>
  );
};

export default BookingHistory;
