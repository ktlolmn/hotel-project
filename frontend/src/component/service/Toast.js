import React, { useEffect } from 'react';
import styles from '../../css/Toast.module.css'; 

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      <p className={styles.toastMessage}>{message}</p>
    </div>
  );
};

export default Toast;
