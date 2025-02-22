import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // استيراد Bootstrap

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null); // لحفظ المنتج النشط

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('https://ecommerce-node4.onrender.com/products?page=1&limit=10');
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleButtonClick = (productId) => {
    setActiveProduct(productId); // تعيين المنتج النشط
  };

  // دالة لتقصير العنوان
  const truncateTitle = (title) => {
    return title.length > 30 ? title.slice(0, 30) + '...' : title;
  };

  return (
    <div className="container mt-4"> {/* إضافة حاوية Bootstrap */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length > 0 ? (
        <div className="row"> {/* استخدام شبكة من Bootstrap لعرض المنتجات */}
          {products.map(product => (
            <div key={product._id} className="col-md-4 mb-4"> {/* تقسيم المنتجات إلى أعمدة */}
              <div className="card h-100 text-center"> {/* إضافة text-center لتوسيع المحتوى */}
                <img 
                  src={product.mainImage.secure_url} 
                  className="card-img-top" 
                  alt={product.name} 
                  style={{ maxHeight: '200px', objectFit: 'contain' }} // ضبط الارتفاع مع الحفاظ على النسبة
                />
                <div className="card-body">
                  <h5 className="card-title product-title">
                    {truncateTitle(product.name)} {/* استخدام دالة تقصير العنوان */}
                  </h5>
                  <p className="card-text" style={{ marginBottom: '10px' }}>
                    Price: {product.price} USD
                  </p>
                  <Link 
                    to={`/product/${product._id}`} 
                    className="btn" 
                    style={{ 
                      backgroundColor: activeProduct === product._id ? 'violet' : '#6a1b9a', // تغيير اللون عند الضغط
                      color: 'white', 
                      marginTop: '10px' 
                    }} 
                    onClick={() => handleButtonClick(product._id)} // تعيين المنتج النشط عند الضغط
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No products found.</p>
      )}
    </div>
  );
}
