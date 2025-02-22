import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const [loading, setLoading] = useState(false); // تعريف حالة loading
  const [step, setStep] = useState(1); // تعريف حالة step

  const formik = useFormik({
    initialValues: {
      email: '',
      code: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().email('Invalid email address').required('Required'),
      code: yup.string().required('Code is required'),
      password: yup.string().min(6, 'Password should be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      // يمكنك إضافة الكود هنا إذا أردت إرسال بيانات عند الضغط على "إرسال"
    },
  });

  async function handleSendCode() {
    setLoading(true);
    try {
      await axios.patch('https://ecommerce-node4.onrender.com/auth/sendcode', { email: formik.values.email });
      toast.success("Verification code sent!", { theme: "dark" });
      setStep(2);
    } catch (error) {
      console.error("Send Code Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Error sending code", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setLoading(true);
    try {
      await axios.patch('https://ecommerce-node4.onrender.com/auth/forgotPassword', {
        email: formik.values.email,
        code: formik.values.code,
        password: formik.values.password,
      });
      toast.success("Password reset successfully!", { theme: "dark" });
      setStep(1);
      formik.resetForm();
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Error resetting password", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {step === 1 ? (
        <div>
          <h2>Enter your email to send the verification code</h2>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
            <button type="button" onClick={handleSendCode} disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Enter the verification code and your new password</h2>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.code}
              placeholder="Verification Code"
            />
            {formik.touched.code && formik.errors.code && <div>{formik.errors.code}</div>}

            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="New Password"
            />
            {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}

            <button type="button" onClick={handleResetPassword} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
