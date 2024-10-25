import React, { useState } from 'react';
import styles from '../../css/Home.module.css';
import Header from '../Parial/Header';
import bg from'../../img/bg.jpg';
import single from'../../img/simple.png';
import double from'../../img/double.png';
import ApiService from '../service/ApiService';
import Utils from '../service/Utils';
import { Link } from 'react-router-dom';
import Toast from '../service/Toast';

const Home = () => {
  const [filterType, setFilterType] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [roomMain, setRoomMain] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false); 
  const [toastMessage, setToastMessage] = useState('');

  const fecthData = async () => {
    try {
      const response = await ApiService.getRoomEmty({
        checkInDate: startDate + 'T07:30:00',
        checkOutDate: endDate + 'T07:30:00',
      });
      if (response.status === 200) {
        setRooms(response.roomList);
        setRoomMain(response.roomList);
      } else {
        throw new Error('Failed to fetch room data');
      }
    } catch (error) {
      setToastMessage('Error fetching room data from server'); 
      setShowToast(true);
    }
  };

  const handleBooking = () => {
    setIsError(false);
    setErrorMessage('');
  
    const today = new Date().toISOString().split('T')[0];
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
  
    if (!startDate || !endDate) {
      setIsError(true);
      setErrorMessage('Please select both start and end dates.');
    } else if (startDate < today) {
      setIsError(true);
      setErrorMessage('Start date must be today or later.');
    } else if (endDate < startDate) {
      setIsError(true);
      setErrorMessage('End date must be later than or equal to the start date.');
    } else if (startYear > 2048 || endYear > 2048) {
      setIsError(true);
      setErrorMessage('Year must not exceed 2048.');
    } else {
      fecthData();
      window.scrollBy({
        top: 300,
        behavior: 'smooth',
      });
    }
  };  

  const handleFilter = () => {
    let filteredRoom = [...roomMain];
    if (filterType && filterType !== 'all') {
      filteredRoom = roomMain.filter((room) => room.type === filterType);
    }
    if (filterPrice) {
      switch (filterPrice) {
        case 'below-15':
          filteredRoom = filteredRoom.filter((room) => room.price < 15);
          break;
        case '15-20':
          filteredRoom = filteredRoom.filter((room) => room.price >= 15 && room.price <= 20);
          break;
        case 'above-20':
          filteredRoom = filteredRoom.filter((room) => room.price > 20);
          break;
        default:
          break;
      }
    }
    setRooms(filteredRoom);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.banner} style={{ backgroundImage: `url(${bg})` }}>
          <h1>Have a nice day!</h1>
        </div>

        <div className={styles.date}>
          <h2>Please enter the time you want</h2>
          <div className={styles.datePicker}>
            <label htmlFor="startDate">From:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">to:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={!startDate}
            />
          </div>
        </div>
        <div className={styles.containerFind}>
          <button className="button-47" onClick={handleBooking}>Search</button>
        </div>

        {isError && <p className={styles.errorMessage}>{errorMessage}</p>}

        {rooms.length === 0 && endDate !== '' && startDate !== '' && !isError && (
          <h1 className={styles.center}>Trống</h1>
        )}

        {rooms.length !== 0 && endDate !== '' && startDate !== '' && (
          <>
            <div className={styles.filterSortSection}>
              <div className={styles.filterContainer}>
                <div className={styles.filter}>
                  <select
                    id="roomType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">Type</option>
                    <option value="all">All</option>
                    <option value="single">Single room</option>
                    <option value="double">Double room</option>
                  </select>
                </div>

                <div className={styles.filter}>
                  <select
                    id="priceRange"
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(e.target.value)}
                  >
                    <option value="">Price</option>
                    <option value="below-15">Under 15$</option>
                    <option value="15-20">From 15$ to 20$</option>
                    <option value="above-20">From 20$</option>
                  </select>
                </div>

                <button className={styles.filterButton} onClick={handleFilter}>
                  <span className="material-icons">filter_list</span>
                </button>
              </div>
            </div>

            <div className={rooms.length > 0 ? styles.roomList : ''}>
              {rooms.map((room, index) => (
                room.status && (
                  <div className={styles.roomCard} key={index}>
                    <img src={room.type === 'single' ? single : double} alt={`Room ${index + 1}`} />
                    <h3>{room.name}</h3>
                    <p>Price: {room.price}$/day</p>
                    <h4>{Utils.upperCaseFirst(room.type)} room</h4>
                    <button className="button-47">
                      <Link to={`/room-detail/${room.id}`} state={{ startDate, endDate }}>
                        Detail
                      </Link>
                    </button>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
  );
};

export default Home;
