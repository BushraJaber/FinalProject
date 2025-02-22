import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './CategoryDetails.module.css'; // استيراد الـ CSS Module
import { Link } from 'react-router-dom';

export default function CategoriesDetails() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // حالة تحميل البيانات
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const { data } = await axios.get(`https://ecommerce-node4.onrender.com/products/category/${categoryId}`);
      console.log(data);
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [categoryId]);

  // دالة لتقصير اسم المنتج
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // دالة للتعامل مع زر الرجوع
  const handleBackClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/categories');
    }, 1000);
  };

  return (
    <section className={styles.products}>
      {loading ? (
        <p className={styles.loadingText}>Loading...</p> // تحسين نص التحميل
      ) : products.length === 0 ? (
        <p className={styles.noProducts}>No products available in this category.</p>
      ) : (
        <Swiper spaceBetween={20} slidesPerView={4} loop={true} className={styles.swiperContainer}>
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <div className={styles.product}>
                <img src={product.mainImage.secure_url} alt={product.name} className={styles.productImage} />
                <h2>{truncateText(product.name, 15)}</h2>
                <Link className={styles.detailsButton} to={`/product/${product._id}`}>
                  Details
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <button onClick={handleBackClick} className={styles.backButton}>Back to Categories</button>
    </section>
  );
}
