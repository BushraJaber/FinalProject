import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Profile.module.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null); // لتخزين المعاينة للصورة
  const [imageFile, setImageFile] = useState(null); // لتخزين الصورة التي تم اختيارها

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    console.log("Fetching user profile...");
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("❌ User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://ecommerce-node4.onrender.com/user/profile", {
        headers: { Authorization: `Tariq__${token}` },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.user) {
        setUserData(response.data.user);
      } else {
        toast.error("⚠️ Unexpected response format.");
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error(error.response?.data?.message || "❌ Error fetching profile!");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    console.log("Fetching user orders...");
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("❌ User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://ecommerce-node4.onrender.com/order", {
        headers: { Authorization: `Tariq__${token}` },
      });

      console.log("Orders API Response:", response.data);

      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        toast.error("⚠️ Unexpected orders response format.");
      }
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      toast.error(error.response?.data?.message || "❌ Error fetching orders!");
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async () => {
    if (!imageFile) {
      toast.error("❌ No image selected to update.");
      return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("❌ User is not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.put(
        'https://ecommerce-node4.onrender.com/user/update-image',
        formData,
        {
          headers: {
            Authorization: `Tariq__${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success("✅ Image updated successfully!");
      fetchUserProfile(); // لإعادة تحميل بيانات البروفايل بعد التحديث
    } catch (error) {
      toast.error("❌ Error updating image!");
      console.error('Error updating image:', error);
    }
  };

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    if (image) {
      setImageFile(image); // تخزين الصورة التي تم اختيارها
      setImagePreview(URL.createObjectURL(image)); // لعرض الصورة قبل رفعها
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1>User Profile</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : userData ? (
        <div className={styles.profileCard}>
          <p><strong>Name:</strong> {userData.userName || "N/A"}</p>
          <p><strong>Email:</strong> {userData.email || "N/A"}</p>
          <p><strong>Role:</strong> {userData.role || "N/A"}</p>
          <p><strong>Status:</strong> {userData.status || "N/A"}</p>

          {/* عرض الصورة الحالية إذا كانت موجودة */}
          <div className={styles.imageSection}>
            {userData.image ? (
              <img src={userData.image.secure_url} alt="User Profile" className={styles.profileImage} />
            ) : (
              <p>No profile image available</p>
            )}
            <p>Here you can update your profile picture:</p> {/* النص التوضيحي */}
            <input type="file" onChange={handleImageUpload} />
            {imagePreview && <img src={imagePreview} alt="Preview" className={styles.previewImage} />}
          </div>

          {/* زر التحديث */}
          <button className={styles.updateBtn} onClick={updateImage}>
            Update Image
          </button>

          <button className={styles.refreshBtn} onClick={fetchUserProfile}>
            🔄 Refresh Profile
          </button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}

      <h2>Orders</h2>
      {orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderDetails}>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> {order.finalPrice}</p>
              </div>
              <div className={styles.orderActions}>
                <button className={styles.detailsBtn}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default UserProfile;
