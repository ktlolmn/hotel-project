import React from 'react';
import styles from '../../css/BookingDetailModal.module.css';
import Utils from '../service/Utils';
import ApiService from '../service/ApiService';

const BookingDetailModalAdmin = ({ booking, closeModal, setHistory, setShowToast, setToastMessage }) => {

  const calculateTotalPrice = () => {
    const days =
      (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 3600 * 24);
    return booking.roomDTO.price * days;
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
  };

  const fetchPaymentConfirm = async () => {
    try {
      const response = await ApiService.payCofirmBooking(booking.id);
      if (response.status === 200) {
        setHistory(response.bookingList);
        displayToast('Payment confirmed successfully!');
      } else {
        displayToast('Error confirming payment.');
      }
    } catch (error) {
      displayToast('Error: ' + error.message);
    }
  };

  const fetchCheckInBooking = async () => {
    try {
      const response = await ApiService.checkInBooking(booking.id);
      if (response.status === 200) {
        setHistory(response.bookingList);
        displayToast('Check-in successful!');
      } else {
        displayToast('Error during check-in.');
      }
    } catch (error) {
      displayToast('Error: ' + error.message);
    }
  };

  const fetchCleanedBooking = async () => {
    try {
      const response = await ApiService.cleanedBooking(booking.id);
      if (response.status === 200) {
        setHistory(response.bookingList);
        displayToast('Room marked as cleaned.');
      } else {
        displayToast('Error marking the room as cleaned.');
      }
    } catch (error) {
      displayToast('Error: ' + error.message);
    }
  };

  const handleCheckIn = () => {
    fetchCheckInBooking();
    closeModal();
  };

  const handleCleaned = () => {
    fetchCleanedBooking();
    closeModal();
  };

  const handlePayConfirm = () => {
    fetchPaymentConfirm();
    closeModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Booking Details</h2>
        <p><strong>Room name:</strong> {booking.roomDTO.name}</p>
        <p><strong>Room type:</strong> {booking.roomDTO.type}</p>
        <p><strong>Booking date:</strong> {Utils.formatDateTime(booking.bookingDate)}</p>
        <p><strong>Rental period:</strong> from <u>{Utils.formatDateTime(booking.checkInDate)}</u></p>
        <p style={{ textAlign: 'right' }}>to{' '}<u>{Utils.formatDateTime(booking.checkOutDate)}</u></p>
        <p><strong>Price:</strong> {booking.roomDTO.price}$/day</p>
        <p><strong>Total payment:</strong> {calculateTotalPrice()}$</p>

        <div className={styles.containerBtn}>
          {(booking.status === 'Renting' || booking.status === "Paying") && (
            <button onClick={handlePayConfirm} className={styles.adminButton}>
              Pay confirm
            </button>
          )}

          {booking.status === 'Reserved' && (
            <button onClick={handleCheckIn} className={styles.adminButton}>
              Check in
            </button>
          )}

          {booking.status === 'Cleaning' && (
            <button onClick={handleCleaned} className={styles.adminButton}>
              Done
            </button>
          )}

          <button onClick={closeModal} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModalAdmin;
