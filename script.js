// Xử lý form đăng ký
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            // Validate
            if (!name || !email || !phone) {
                showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Email không hợp lệ!', 'error');
                return;
            }
            
            // Validate phone
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showNotification('Số điện thoại không hợp lệ!', 'error');
                return;
            }
            
            // Hiển thị thông báo đang xử lý
            showNotification('Đang xử lý đăng ký...', 'info');
            
            // Mã chuyển khoản cố định
            const paymentCode = 'TDHCV343';
            
            // Kiểm tra xem đã cấu hình EmailJS chưa
            const isEmailJSConfigured = typeof EMAILJS_CONFIG !== 'undefined' && 
                                       EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                                       EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                                       EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
            
            // Hàm gửi email
            function sendEmailNotification() {
                if (!isEmailJSConfigured) {
                    console.warn('EmailJS chưa được cấu hình. Vui lòng xem file HUONG_DAN_EMAILJS.md');
                    return Promise.resolve(); // Trả về promise resolved để code tiếp tục chạy
                }
                
                // Khởi tạo EmailJS
                emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
                
                // Chuẩn bị dữ liệu email
                const emailParams = {
                    to_email: EMAILJS_CONFIG.YOUR_EMAIL,
                    to_name: EMAILJS_CONFIG.YOUR_NAME,
                    from_name: name,
                    from_email: email,
                    phone: phone,
                    payment_code: paymentCode,
                    amount: '1,450,000 VNĐ',
                    course_name: 'Khóa Tự Động Hóa Facebook Ads',
                    date: new Date().toLocaleString('vi-VN')
                };
                
                // Gửi email
                return emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID, 
                    EMAILJS_CONFIG.TEMPLATE_ID, 
                    emailParams
                );
            }
            
            // Gửi email và xử lý kết quả
            sendEmailNotification()
                .then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                    showNotification('Đăng ký thành công! Đang chuyển đến trang thanh toán...', 'success');
                    
                    // Chuyển đến trang thanh toán sau khi gửi email thành công
                    setTimeout(() => {
                        const params = new URLSearchParams({
                            name: name,
                            email: email,
                            phone: phone,
                            code: paymentCode
                        });
                        window.location.href = 'thanhtoan.html?' + params.toString();
                    }, 1500);
                }, function(error) {
                    console.error('Email sending failed:', error);
                    // Vẫn chuyển đến trang thanh toán dù email lỗi
                    showNotification('Đăng ký thành công! (Email có thể chưa gửi được)', 'info');
                    setTimeout(() => {
                        const params = new URLSearchParams({
                            name: name,
                            email: email,
                            phone: phone,
                            code: paymentCode
                        });
                        window.location.href = 'thanhtoan.html?' + params.toString();
                    }, 1500);
                });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.benefit-card, .content-item, .audience-item, .bonus-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set color based on type
    let bgColor = '#27ae60'; // success
    if (type === 'error') bgColor = '#e74c3c';
    if (type === 'info') bgColor = '#3498db';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 16px;
        font-weight: 500;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Format phone number on input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            e.target.value = value;
        });
    }
});

// Add floating CTA button
document.addEventListener('DOMContentLoaded', function() {
    const floatingBtn = document.createElement('a');
    floatingBtn.href = '#register';
    floatingBtn.className = 'floating-cta';
    floatingBtn.textContent = 'ĐĂNG KÝ NGAY';
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #27ae60;
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4);
        z-index: 999;
        transition: all 0.3s;
        animation: pulseScale 1.5s ease-in-out infinite;
    `;
    
    floatingBtn.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        this.style.transform = 'scale(1.15)';
        this.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.6)';
    });
    
    floatingBtn.addEventListener('mouseleave', function() {
        this.style.animation = 'pulseScale 1.5s ease-in-out infinite';
        this.style.boxShadow = '0 5px 20px rgba(39, 174, 96, 0.4)';
    });
    
    document.body.appendChild(floatingBtn);
    
    // Add pulse and scale animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulseScale {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(39, 174, 96, 0.8);
            }
        }
    `;
    document.head.appendChild(pulseStyle);
    
    // Button luôn hiển thị, không ẩn khi scroll
    floatingBtn.style.opacity = '1';
    floatingBtn.style.transform = 'translateY(0)';
});
