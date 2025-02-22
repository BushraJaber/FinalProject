import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error("No token found, user is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://ecommerce-node4.onrender.com/cart', {
        headers: { Authorization: `Tariq__${token}` },
      });
      setCartItems(response.data.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data || error.message);
      toast.error("❌ Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const modifyQuantity = async (productId, action) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    const endpoint = action === 'increase' 
      ? 'https://ecommerce-node4.onrender.com/cart/incraseQuantity' 
      : 'https://ecommerce-node4.onrender.com/cart/decraseQuantity';

    try {
      // Ensure the endpoint is correct for your server
      await axios.patch(endpoint, { productId }, { headers: { Authorization: `Tariq__${token}` } });
      toast.success(`✅ Quantity ${action}d successfully!`);
      fetchCartData(); // Refresh cart data after modification
    } catch (error) {
      console.error(`Error ${action}ing quantity:`, error.response?.data || error.message);
      toast.error(`❌ Failed to ${action} quantity`);
    }
  };

  const removeItemFromCart = async (productId) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await axios.patch(
        'https://ecommerce-node4.onrender.com/cart/removeItem',
        { productId },
        { headers: { Authorization: `Tariq__${token}` } }
      );
      toast.success("✅ Product removed from cart!");
      fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error.response?.data || error.message);
      toast.error("❌ Failed to remove product from cart");
    }
  };

  const clearCart = async () => {
    const confirmed = window.confirm("Are you sure you want to clear the cart?");
    if (!confirmed) return;

    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await axios.patch(
        'https://ecommerce-node4.onrender.com/cart/clear', 
        {},
        { headers: { Authorization: `Tariq__${token}` } }
      );
      toast.success("✅ Your cart is now empty!");
      fetchCartData();
    } catch (error) {
      console.error('Error clearing the cart:', error.response?.data || error.message);
      toast.error("❌ Failed to clear the cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Add items to the cart before proceeding.");
      return;
    }
    navigate('/order');
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.details?.price || 0;
    return total + (price * item.quantity || 0);
  }, 0).toFixed(2);

  return (
    <div className={styles.container}>
      <h1>Cart Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.th}>Image</th>
                <th className={styles.th}>Product Name</th>
                <th className={styles.th}>Quantity</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item._id} className={styles.tr}>
                  <td className={styles.td}>
                    {item.details?.mainImage?.secure_url ? (
                      <img
                        src={item.details.mainImage.secure_url}
                        alt={item.details?.name || 'Product Image'}
                        className={styles.productImage}
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </td>
                  <td className={styles.td}>{item.details?.name || "Unnamed Product"}</td>
                  <td className={styles.td}>{item.quantity}</td>
                  <td className={styles.td}>
                    {item.details?.price ? `$${(item.details.price * item.quantity).toFixed(2)}` : "N/A"}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionContainer}>
                      <button 
                        onClick={() => modifyQuantity(item.productId, 'increase')}
                        className={styles.increaseButton}
                      >
                        +
                      </button>
                      <button 
                        onClick={() => modifyQuantity(item.productId, 'decrease')}
                        className={styles.decreaseButton}
                      >
                        -
                      </button>
                      <button onClick={() => removeItemFromCart(item.productId)} className={styles.removeButton}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total Price: ${totalPrice}</p>
        </>
      ) : (
        <p>Your cart is empty. Please add items to your cart!</p>
      )}
      <button onClick={clearCart} className={styles.clearButton}>Clear Cart</button>
      <button 
        onClick={handleCheckout} 
        className={styles.checkoutButton} 
        disabled={cartItems.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
