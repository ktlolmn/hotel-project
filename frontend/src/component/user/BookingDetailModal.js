import React, { useState, useEffect } from 'react';
import styles from '../../css/BookingDetailModal.module.css';
import ApiService from '../service/ApiService';
import Utils from '../service/Utils';
import Toast from '../service/Toast';

const BookingDetailModal = ({ booking, setHistory, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackResponse, setFeedbackResponse] = useState({ rate: 0, feedback: '' });
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (booking.status !== 'Reserved' && booking.status !== 'Renting') {
      fetchFeedback();
    }
  }, [booking.status]);

  const fetchFeedback = async () => {
    try {
      const response = await ApiService.getFeedbackByBooking(booking.id);
      if (response.status === 200) {
        setFeedbackResponse(response.feedbackDTO);
      }
    } catch (error) {
      alert(`Error fetching feedback: ${error.message}`);
    }
  };

  const calculateTotalPrice = () => {
    const days =
      (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
      (1000 * 3600 * 24);
    return booking.roomDTO.price * days;
  };

  const handlePay = async () => {
    try {
      if (rating > 0 || feedback !== '') {
        const response = await ApiService.feedbackBooking(booking, rating, feedback);
        if (response.status === 200) {
          setHistory(response.bookingList);
          closeModal();
          setToastMessage('Feedback submitted successfully!');
          setShowToast(true);
        }
      } else {
        const response = await ApiService.payBooking(booking.id);
        if (response.status === 200) {
          setHistory(response.bookingList);
          closeModal();
          setToastMessage('Payment successful!');
          setShowToast(true);
        }
      }
    } catch (error) {
      alert(`Error processing request: ${error.message}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Room Details</h2>
        <p><strong>Room name:</strong> {booking.roomDTO.name}</p>
        <p><strong>Room type:</strong> {booking.roomDTO.type}</p>
        <p><strong>Booking date:</strong> {Utils.formatDateTime(booking.bookingDate)}</p>
        <p><strong>Rental period:</strong> from <u>{Utils.formatDateTime(booking.checkInDate)}</u> </p>
        <p style={{ textAlign: "right" }}>to{' '}<u>{Utils.formatDateTime(booking.checkOutDate)}</u></p>
        <p><strong>Price:</strong> {booking.roomDTO.price}$/day</p>
        <p><strong>Total payment:</strong> {calculateTotalPrice()}$</p>

        {booking.status !== "Reserved" && booking.status !== "Renting" && (
          <>
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= feedbackResponse.rate ? styles.filledStar : styles.emptyStar}
                >
                  ★
                </span>
              ))}
            </div>
            <p className={styles.pFeedback}>{feedbackResponse.feedback}</p>
          </>
        )}

        {booking.status === 'Renting' && (
          <>
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? styles.filledStar : styles.emptyStar}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={styles.feedbackTextarea}
            />
          </>
        )}

        <div className={styles.containerBtn}>
          {/* Payment button only visible when booking status is Renting */}
          {booking.status === 'Renting' && (
            <button
              onClick={handlePay}
              className={styles.paymentButton}
              disabled={rating === 0 && feedback === ''}
            >
              Pay now
            </button>
          )}
          <button onClick={closeModal} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default BookingDetailModal;
