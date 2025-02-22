import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css"; // تأكد من استيراد ملف CSS المناسب
import Footer from "../Footer/Footer.jsx"; // استيراد مكون Footer

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>Welcome to BushraStore</h1>
      <p>Discover the best products at amazing prices!</p>
      <Link to="/categories" className={styles.btn}>EXPLORE NOW</Link>
    </main>
  );
}
