import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);
  const navigate = useNavigate();

  // ✅ تحديث الاسم عند التغيير في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("userName"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setUserName(null);
    navigate("/login");
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${styles.navbar}`}>
      <div className="container-fluid">
        <a className={`navbar-brand ${styles.navbarBrand}`} href="#">
          BushraStore
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav mx-auto">
            <Link className={`nav-link ${styles.navLink}`} to="/">
              Home
            </Link>
            <Link className={`nav-link ${styles.navLink}`} to="/AllProduct">
              Products
            </Link>
            <Link className={`nav-link ${styles.navLink}`} to="/categories">
              Categories
            </Link>
          </div>
          <div className="navbar-nav ms-auto">
            <Link className={`nav-link ${styles.navLink}`} to="/cart">
              <FontAwesomeIcon
                icon={faCartShopping}
                className={styles.faCartShopping}
              />
            </Link>

            {userName ? (
              <div className="nav-item dropdown">
                <a
                  className={`nav-link dropdown-toggle ${styles.navLink}`}
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userName}
                </a>
                <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="nav-item dropdown">
                <a
                  className={`nav-link dropdown-toggle ${styles.navLink}`}
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
                  <li>
                    <Link className="dropdown-item" to="/register">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Sign in
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
