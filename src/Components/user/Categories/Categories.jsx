import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';  
import 'swiper/css/navigation';  
import 'swiper/css/pagination'; 
import { Link } from 'react-router-dom';
import styles from './Categories.module.css'; 

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 

  const getCategories = async () => {
    try {
      const { data } = await axios.get('https://ecommerce-node4.onrender.com/categories/active');
      console.log(data.categories);
      setCategories(data.categories);
      setLoading(false); 
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className='categories'>
      {loading ? (
        <div className={styles.loading}>{/* عنصر التحميل */}Loading...</div> 
      ) : (
        <Swiper
          spaceBetween={20} // المسافة بين كل عنصر في السلايدر
          slidesPerView={4} // عدد العناصر التي سيتم عرضها في السلايدر في وقت واحد
          loop={true} // تشغيل السلايدر بشكل متكرر
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}> {/* لكل عنصر يتم وضعه داخل SwiperSlide */}
              <Link to={`/CategoryDetails/${category._id}`}>
                <div className='category'>
                  <img src={category.image.secure_url} alt={category.name} />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
