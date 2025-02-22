import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Order.module.css';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = () => {
    setLoading(true);
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error("No token found, user is not authenticated.");
      setLoading(false);
      return;
    }
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartData.length > 0) {
      setCartItems(cartData);
      setLoading(false);
    } else {
      axios.get('https://ecommerce-node4.onrender.com/cart', {
        headers: { Authorization: `Tariq__${token}` }
      })
        .then(response => {
          setCartItems(response.data.products || []);
          setLoading(false);
        })
        .catch(error => {
          toast.error('❌ Error fetching cart!');
          setLoading(false);
        });
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("🛒 Your cart is empty! Please add items before placing an order.");
      return;
    }
    if (!address || !phone) {
      toast.error("⚠️ Please enter both address and phone number.");
      return;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      toast.error("📞 Please enter a valid phone number.");
      return;
    }

    const orderData = {
      cartItems,
      coupon,
      address,
      phone
    };

    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("❌ User is not authenticated.");
      return;
    }

    setLoading(true);

    axios.post(
      'https://ecommerce-node4.onrender.com/order',
      orderData,
      { headers: { Authorization: `Tariq__${token}` } }
    )
      .then(response => {
        toast.success("✅ Order placed successfully!");
        localStorage.setItem('cart', JSON.stringify([]));
        setCartItems([]);
        setLoading(false);
      })
      .catch(error => {
        toast.error("❌ Failed to place order.");
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      {/* مكون التوست لإظهار الرسائل */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h1>Order Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartSummary}>
          <h2>Your Cart:</h2>
          <div className={styles.cartGrid}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                {item.details?.mainImage && (
                  <img src={item.details.mainImage?.secure_url} alt={item.details?.name || 'Product Image'} className={styles.productImage} />
                )}
                <span className={styles.quantity}>{item.quantity}x</span>
                <span className={styles.price}>${item.details?.finalPrice || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className={styles.orderForm} onSubmit={handlePlaceOrder}>
        <div className={styles.inputGroup}>
          <label htmlFor="couponName">Coupon Name (Optional):</label>
          <input
            type="text"
            id="couponName"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
