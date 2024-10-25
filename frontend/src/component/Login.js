import React, { useState } from 'react';
import styles from '../css/Login.module.css'; 
import ApiService from "./service/ApiService.js"
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const  response = await ApiService.login({
        username: email,
        password
      })
      if(response.status === 200){
        localStorage.setItem("role", response.role)
        localStorage.setItem("token", response.token)
        navigate(location.state?.from?.pathname || (response.role === "ADMIN"? "/admin" : "/"),{replace: true})
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Welcome</h2>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {isSubmitting ? 'Logging in...' : 'LOGIN'}
        </button>

        <p className={styles.signupText}>
          Don’t have an account? <a href="/register">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
