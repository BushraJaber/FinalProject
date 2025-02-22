import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.css';

export default function Login() {
  const [loading, setLoading] = useState(false); // حالة التحميل
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().required('Email is required').min(5).max(100).email('Invalid email format'),
    password: yup.string().required('Password is required').min(2).max(20)
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: LoginUser,
    validationSchema: schema
  });

  async function LoginUser(values) {
    setLoading(true); // عند بدء العملية، نضع حالة التحميل إلى true
    try {
      const { data } = await axios.post('https://ecommerce-node4.onrender.com/auth/signin', values);
      console.log(data);
      if (data.message === 'success') {
        localStorage.setItem("userToken", data.token);

        const decoded = jwtDecode(data.token);
        console.log(decoded);
        localStorage.setItem("userName", decoded.userName); // حفظ اسم المستخدم

        toast.success(`Welcome ${decoded.userName}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        setTimeout(() => {
          navigate('/'); // الانتقال بعد 3 ثواني
        }, 3000);
      } else {
        toast.error('Login failed. Please check your credentials.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false); // إيقاف التحميل بعد العملية
    }
  }
 

  return (
    <div className={styles.container}>
      <h1>Welcome Back</h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            onChange={formik.handleChange}
            name="email"
            id="email"
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="Email"
          />
          <label htmlFor="email">User Email</label>
          {formik.touched.email && formik.errors.email ? (
            <div className="alert alert-danger">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            onChange={formik.handleChange}
            name="password"
            id="password"
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Password"
          />
          <label htmlFor="password">User Password</label>
          {formik.touched.password && formik.errors.password ? (
            <div className="alert alert-danger">{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-3">
        <a href="/forgot-password" className="text-purple">Forgot Password?</a>
      </div>




      <ToastContainer />
    </div>
  );
}
