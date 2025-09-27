// Company Profile Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeWelcomeMessage();
    initializeFormValidation();
    initializeNavigation();
    initializeMobileMenu();
});

// Initialize welcome message with dynamic name
function initializeWelcomeMessage() {
    // Get user name from localStorage or prompt for it
    let userName = localStorage.getItem('userName');
    
    if (!userName) {
        userName = prompt('Please enter your name:') || 'Guest';
        localStorage.setItem('userName', userName);
    }
    
    // Update welcome message
    const welcomeElement = document.getElementById('user-name');
    if (welcomeElement) {
        welcomeElement.textContent = userName;
    }
}

// Initialize form validation and submission
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Get form data
            const formData = getFormData();
            
            // Display form data
            displayFormData(formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Date validation
    if (fieldName === 'birthdate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Birth date cannot be in the future';
        }
    }
    
    // Show error if validation fails
    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check if at least one gender is selected
    const genderInputs = form.querySelectorAll('input[name="gender"]');
    const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
    
    if (!isGenderSelected) {
        isFormValid = false;
        const genderGroup = form.querySelector('.radio-group');
        if (genderGroup) {
            genderGroup.classList.add('error');
            showErrorMessage(genderGroup, 'Please select a gender');
        }
    }
    
    return isFormValid;
}

// Get form data
function getFormData() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    return {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate'),
        gender: formData.get('gender'),
        message: formData.get('message'),
        currentDate: new Date().toLocaleString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        })
    };
}

// Display form data
function displayFormData(data) {
    // Update current date
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = data.currentDate;
    }
    
    // Update form data display
    const displayElements = {
        'display-name': data.name,
        'display-email': data.email,
        'display-phone': data.phone,
        'display-birthdate': formatDate(data.birthdate),
        'display-gender': data.gender,
        'display-message': data.message
    };
    
    Object.entries(displayElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || '-';
        }
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Show error message
function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

// Remove error message
function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Show success message
function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            margin: 20px 0;
            text-align: center;
            font-weight: 600;
        ">
            ✅ Form submitted successfully! Thank you for your message.
        </div>
    `;
    
    // Insert after form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Initialize navigation functionality
function initializeNavigation() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.navigation a');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navigation = document.getElementById('navigation');
    
    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navigation.classList.toggle('active');
        });
        
        // Close menu when clicking on navigation links
        const navLinks = navigation.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navigation.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navigation.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navigation.classList.remove('active');
            }
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navigation.classList.remove('active');
            }
        });
    }
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    }
    
    .radio-group.error {
        border: 2px solid #e74c3c;
        border-radius: 8px;
        padding: 10px;
        background-color: rgba(231, 76, 60, 0.05);
    }
    
    .success-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
