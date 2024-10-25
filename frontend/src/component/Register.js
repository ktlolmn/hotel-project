import React, { useState } from 'react';
import styles from '../css/Login.module.css'; 
import ApiService from "./service/ApiService.js";
import Toast from "../component/service/Toast.js";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [showToast, setShowToast] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password || !phone) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('Please enter a valid phone number (10-15 digits).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ApiService.register({
        name,
        email,
        password,
        phone,
      });

      if (response.status === 200) {
        setToastMessage('Registration successful!');
        setShowToast(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (response.status === 404) {
        setErrorMessage(response.message || 'Error: Email already exists.');
      } else {
        setErrorMessage('Registration failed.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.inputGroup}>
          <label>Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.loginButton}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        <p className={styles.signupText}>
          Back to <a href="/login">Sign In</a>
        </p>
      </form>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default Register;
