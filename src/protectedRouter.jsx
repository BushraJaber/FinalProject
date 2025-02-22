import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRouter({ children }) {
  const token = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  // إذا كان التوكن غير موجود، توجيه المستخدم إلى صفحة الدخول
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {userName ? (
        <h2>Welcome back, {userName} 👋</h2> {/* عرض اسم المستخدم */}
      ) : (
        <h2>Welcome to the platform! 👋</h2> {/* عرض رسالة ترحيب إذا لم يكن اسم المستخدم موجود */}
      )}
      {children}
    </div>
  );
}
