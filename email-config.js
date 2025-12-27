// File cấu hình EmailJS
// Đã được cấu hình sẵn

const EMAILJS_CONFIG = {
    // Public Key từ EmailJS Dashboard → Account → General
    PUBLIC_KEY: '9anCXdBPZiZvduRuQ',
    
    // Service ID từ EmailJS Dashboard → Email Services
    SERVICE_ID: 'service_cdywck7',
    
    // Template ID từ EmailJS Dashboard → Email Templates
    TEMPLATE_ID: 'template_drxh4sf',
    
    // Email của bạn để nhận thông báo
    YOUR_EMAIL: 'nhuanlaptrinh@gmail.com',
    
    // Tên hiển thị trong email
    YOUR_NAME: 'Anh Lập Trình'
};

// Export để sử dụng trong script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
}

