import React from 'react';
import styles from '../../css/Header.module.css';
import Logo from "../../img/logo.png"

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={Logo} alt="Logo" />
        <span className={styles.logoText}>LT Hotel</span>
      </div>

      <nav className={styles.navMenu}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/history">History</a>
          </li>
          <li>
            
            <a href='/account'><i className="material-icons">account_circle</i></a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
