import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup'; 
import { toast, ToastContainer } from 'react-toastify'; // استيراد ToastContainer
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // استيراد أنماط مكتبة toastify
import styles from './Register.module.css';

export default function Register() {
    const schema = yup.object({
        userName: yup.string().required('User Name is required').min(3).max(20),
        email: yup.string().required('Email is required').min(5).max(100).email(),
        password: yup.string().required('Password is required').min(2).max(20)
    });

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: ''
        },
        onSubmit: RegisterUser,
        validationSchema: schema
    });

    async function RegisterUser() {
        try {
            const { data } = await axios.post('https://ecommerce-node4.onrender.com/auth/signup', {
                userName: formik.values.userName,
                email: formik.values.email,
                password: formik.values.password,
            });
            console.log(data);
            toast.success('Registration successful!', {
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
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred during registration';
            console.error('Error during registration:', message);
            toast.error(message, {
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
    }

    return (
        <div className={styles.container}>
            <h1>Welcome to Bushra Store</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className={`form-control ${formik.touched.userName && formik.errors.userName ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        name="userName"
                        id="name"
                        onBlur={formik.handleBlur}
                        value={formik.values.userName} 
                        placeholder=""
                    />
                    <label htmlFor="name">User Name</label>
                    {formik.touched.userName && formik.errors.userName ? (
                        <div className="alert alert-danger">{formik.errors.userName}</div>
                    ) : null}
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        name="email"
                        id="email"
                        onBlur={formik.handleBlur}
                        value={formik.values.email}  
                        placeholder=""
                    />
                    <label htmlFor="email">User Email</label>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="alert alert-danger">{formik.errors.email}</div>
                    ) : null}
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        name="password"
                        id="password"
                        onBlur={formik.handleBlur}
                        value={formik.values.password}  
                        placeholder=""
                    />
                    <label htmlFor="password">User Password</label>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="alert alert-danger">{formik.errors.password}</div>
                    ) : null}
                </div>

                <button type="submit" className={`${styles.btn}`}>Register</button>
            </form>
            
            <ToastContainer /> {/* إضافة ToastContainer هنا */}
        </div>
    );
}
