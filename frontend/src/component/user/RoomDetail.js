import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from '../../css/RoomDetail.module.css';
import double from '../../img/double.png';
import ApiService from '../service/ApiService';
import Utils from '../service/Utils';
import BookingConfirm from './BookingConfirm';
import Toast from '../service/Toast';

const RoomDetail = () => {
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]); 
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startDate = state?.startDate || '';
  const endDate = state?.endDate || '';

  const handleBack = () => {
    navigate(-1);
  };

  const fetchRoomDetails = async () => {
    setLoadingRoom(true);
    try {
      const response = await ApiService.getRoomById(id);
      if (response.status === 200) {
        setRoom(response.roomDTO);
      } else {
        throw new Error('Failed to fetch room details');
      }
    } catch (error) {
      setErrorMessage('Error fetching room details from server');
      setShowToast(true);
    } finally {
      setLoadingRoom(false);
    }
  };

  const fetchRoomFeedback = async () => {
    try {
      const feedbackResponse = await ApiService.getFeedbackByRoom(id);
      if (feedbackResponse.status === 200) {
        setFeedbackList(feedbackResponse.feedbackList);
        console.log(feedbackResponse.feedbackList)
      } else if (feedbackResponse.status === 201) {
        setFeedbackList([]);
      }
    } catch (error) {
      setErrorMessage('Error fetching feedback from server');
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      navigate('/');
      return;
    }
    fetchRoomDetails();
    fetchRoomFeedback();
  }, [startDate, endDate, id, navigate]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
        Back
      </button>

      {loadingRoom && <p className={styles.loading}>Loading room details...</p>}

      {room && (
        <div className={styles.roomDetailWrapper}>
          <div className={styles.roomImage}>
            <img src={double} alt="Room" />
          </div>

          <div className={styles.roomInfo}>
            <h2>Room {room.name}</h2>
            <p><strong>Room type:</strong> {Utils.upperCaseFirst(room.type)} room</p>
            <p><strong>Price:</strong> {room.price}$/day</p>
            <div className={styles.description}>
              <h3>Mô tả phòng</h3>
              <p>{room.description}</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="button-47">
              Thuê phòng
            </button>
            {feedbackList.length > 0 && (
              <div className={styles.feedbackSection}>
                <ul>
                  {feedbackList.map((feedback, index) => (
                    <li key={index}>
                      <p><strong>{feedback.bookingDTO.customerDTO.name} </strong> {feedback.feedback}</p>
                      <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= feedback.rate ? styles.filledStar : styles.emptyStar}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}


      {feedbackList.length === 0 && (
        <p classname={styles.loading}>No feedback available for this room.</p>
      )}

      {isModalOpen && (
        <BookingConfirm
          room={room}
          closeModal={closeModal}
          startDate={startDate}
          endDate={endDate}
          id={id}
        />
      )}
      {showToast && (
        <Toast
          message={errorMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default RoomDetail;
