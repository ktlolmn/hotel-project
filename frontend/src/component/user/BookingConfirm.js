import React, { useEffect } from 'react';
import styles from '../../css/BookingDetailModal.module.css';
import ApiService from '../service/ApiService';
import { jwtDecode } from 'jwt-decode';
import Utils from '../service/Utils';
import { useNavigate } from 'react-router-dom';

const BookingConfirm = ({ room, closeModal, startDate, endDate, id }) => {
  const navigate = useNavigate()
  const bookingDate = new Date().toLocaleDateString('en-GB'); ;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  useEffect(()=>{
    if(!token || role !== "USER"){
      navigate("/login")
    }
  },[])
  const formatDateTime = (date, isStartDate) => {
    const dt = new Date(date);
    if (isStartDate) {
      dt.setHours(14, 30, 0, 0);
    } else {
      dt.setHours(14, 15, 0, 0);
    }
    return dt.toISOString();
  };
  

  const submit = async () => {
    try {
      const response = await ApiService.createBooking({
        roomId: id, 
        checkInDate: formatDateTime(startDate, true),
        checkOutDate: formatDateTime(endDate, false),
        customerDTO: {
          email:jwtDecode(token).sub
        },
        roomDTO: {
          id: id
        }
      });

      if (response.status === 200) {
        navigate("/history",{replace:true})
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = () => {
    submit();
  };

  const setDateWithDefaultTime = (dateString, isStartDate) => {
    console.log(dateString);
    const date = new Date(dateString);
    if (isStartDate) {
      date.setHours(7, 30, 0, 0);
    } else {
      date.setHours(7, 15, 0, 0);
    }
    return Utils.formatDateTime(date);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Room Details</h2>
        <p><strong>Room name:</strong> {room.name}</p>
        <p><strong>Room type:</strong> {room.type}</p>
        <p><strong>Booking date:</strong> {bookingDate}</p>
        <p>
          <strong>Rental period:</strong> from <u>{setDateWithDefaultTime(startDate, true).toString()}</u>
        </p>
        <p style={{textAlign: "right"}}>
          to{' '}<u>{setDateWithDefaultTime(endDate, false).toString()}</u>
        </p>
        <p><strong>Price:</strong> {room.price}$</p>
        <div className={styles.containerBtn}>
            <button onClick={handleSubmit} className={styles.paymentButton}>
              Accept
            </button>
            <button onClick={closeModal} className={styles.closeButton}>
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
