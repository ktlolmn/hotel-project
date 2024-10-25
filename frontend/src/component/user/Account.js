import React, { useState, useEffect } from 'react';
import styles from '../../css/Account.module.css';
import { FaUserCircle } from 'react-icons/fa';
import Header from "../Parial/Header";
import { MdEdit, MdCancel, MdSave, MdLogout } from 'react-icons/md'; 
import Utils from '../service/Utils';
import ApiService from '../service/ApiService';
import Toast from '../service/Toast';

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [editingField, setEditingField] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(''); // Toast message
  const [showToast, setShowToast] = useState(false); // Toast visibility state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await ApiService.getCustomerInfor();
      if (response.status === 200) {
        setUserInfo(response.customerDTO);
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prevInfo => ({ ...prevInfo, [field]: value }));
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      const response = await ApiService.updateCustomerInfo(userInfo);
      if (response.status === 200) {
        setEditingField(null);
        setToastMessage('Information updated successfully');
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    fetchData();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await ApiService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.status === 200) {
        setShowModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        setToastMessage("Password changed successfully"); 
        setShowToast(true); 
      } else {
        setError("Error changing password");
      }
    } catch (error) {
      setError("Error changing password");
    }
  };

  const renderField = (field, label, editable = true) => {
    const isEditing = editingField === field;
    return (
      <div className={styles.infoRow}>
        <p><strong>{label}:</strong></p>
        {isEditing ? (
          <input
            type="text"
            value={userInfo[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={styles.inputField}
          />
        ) : (
          <p>{userInfo[field]}</p>
        )}
        {editable && (
          isEditing ? (
            <div className={styles.action}>
              <MdSave className={styles.icon} onClick={handleSave} />
              <MdCancel className={styles.icon} onClick={handleCancel} />
            </div>
          ) : (
            <MdEdit className={styles.icon} onClick={() => handleEdit(field)} />
          )
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.accountContainer}>
        <div className={styles.profileSection}>
          <FaUserCircle size={80} />
          <div className={styles.nameSection}>
            {renderField('name', 'Name')}
          </div>
        </div>

        <div className={styles.contactInfo}>
          {renderField('phone', 'Phone')}
          {renderField('email', 'Email', false)}
        </div>

        <button className={styles.changePassBtn} onClick={() => setShowModal(true)}>
          <i><u>Change Password</u></i>
        </button>
        <br />
        <button onClick={Utils.logOut} className={styles.logoutBtn}>
          <MdLogout /> Logout
        </button>

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <input
                    key={field}
                    type="password"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={passwordData[field]}
                    onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                    className={styles.inputField}
                  />
                ))}
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.action}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className={styles.saveBtn}>Save</button>
                </div>
              </form>
            </div>
          </div>
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

export default Account;
