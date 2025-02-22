import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h1 className={styles.logo}>BushraStore</h1>
        <div className={styles.location}>
          <i className="fa fa-map-marker" aria-hidden="true"></i> Palestine, Tulkarem
        </div>
        <div className={styles.copyright}>
          &copy; 2024 BushraStore
        </div>
      </div>
    </footer>
  );
};

export default Footer;
