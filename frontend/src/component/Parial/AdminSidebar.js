import React from 'react';
import styles from '../../css/AdminSidebar.module.css';
import logo from '../../img/logo.png'
import { MdLogout } from 'react-icons/md';
import Utils from '../service/Utils';

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <ul className={styles.menu}>
        <li><a href="/admin/">Room</a></li>
        <li><a href="/admin/booking">Booking</a></li>
        <li><a href="/admin/statistics">Statistics</a></li>
      </ul>
      <button onClick={()=>{Utils.logOut()}} className={styles.logoutBtn}><MdLogout /> Logout</button>
    </div>
  );
};

export default AdminSidebar;
