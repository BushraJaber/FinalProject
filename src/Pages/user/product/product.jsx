import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './product.module.css';

export default function Product() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState([]);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const { productId } = useParams();
  const navigate = useNavigate();

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://ecommerce-node4.onrender.com/products/${productId}`, {
          timeout: 10000
        });
        console.log("Product data:", data);
        setProduct(data.product);
        setProductImages(data.product.subImages || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("❌ Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const addToCart = async () => {
    const token = localStorage.getItem('userToken');
    console.log("Token for cart:", token);
    if (!token) {
      toast.error("❌ Please log in to add items to the cart!");
      return;
    }
    try {
      await axios.post(
        `https://ecommerce-node4.onrender.com/cart/`,
        { productId },
        { headers: { authorization: `Tariq__${token}` } }
      );
      toast.success("✅ Product added to cart!");
    } catch (error) {
      toast.error("❌ Failed to add product to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');

    if (!rating || rating < 1 || rating > 5) {
      toast.error("❌ Rating must be between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post(
        `https://ecommerce-node4.onrender.com/products/${productId}/review`,
        { comment: review, rating: rating },
        { headers: { Authorization: `Tariq__${token}` } }
      );

      console.log("Review response:", response);
      if (response.data.message === 'success') {
        toast.success("✅ Review added successfully!");
        setReview('');
        setRating('');
        fetchProduct(); // إعادة تحميل بيانات المنتج لتحديث المراجعات
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response) {
       
        console.error("Error response data:", err.response.data);
        toast.error(`❌ Error: ${err.response.data.message || 'Something went wrong.'}`);
      } 
    }
  };

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : product ? (
        <div className={styles.card}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.imageSection}>
            <img
              className={styles.mainImage}
              src={product.mainImage?.secure_url}
              alt={product.name}
            />
            {productImages.length > 0 && (
              <div className={styles.imageGallery}>
                {productImages.map((img, index) => (
                  <img key={index} src={img.secure_url} alt={`Product sub ${index}`} />
                ))}
              </div>
            )}
          </div>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.buttonsContainer}>
            {localStorage.getItem('userToken') && (
              <button onClick={addToCart} className={styles.addToCartButton}>
                Add to cart
              </button>
            )}
            <button onClick={handleBackClick} className={styles.backButton}>
              Back to products
            </button>
          </div>

          {/* قسم المراجعات */}
          <div className={styles.reviewsSection}>
            <h2>Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {product.reviews.map((review, index) => (
                  <div key={index} className={styles.reviewItem}>
                    <div className={styles.reviewRating}>Rating: {review.rating}⭐</div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to leave a review!</p>
            )}
            
            {/* نموذج المراجعة متاح دائمًا */}
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review"
                required
              />
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rate from 1 to 5"
                min="1"
                max="5"
                required
              />
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      ) : (
        <p className={styles.loading}>Product not found.</p>
      )}
      <ToastContainer />
    </div>
  );
}