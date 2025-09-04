// Custom JavaScript for Contact Page

$(document).ready(function() {
    // Initialize all components when document is ready
    initializeContactPage();
});

// Initialize Contact page components
function initializeContactPage() {
    initializeNavbar();
    initializeAnimations();
    initializeForms();
    initializeScrollEffects();
    initializeContactCards();
    initializeFAQ();
    initializeMap();
    initializeCharacterCounter();
}

// Navbar functionality
function initializeNavbar() {
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // Mobile menu close on click
    $('.navbar-nav .nav-link').on('click', function() {
        if ($(window).width() < 768) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Dropdown hover effect for desktop
    if ($(window).width() > 768) {
        $('.dropdown').hover(
            function() {
                $(this).addClass('show');
                $(this).find('.dropdown-menu').addClass('show');
            },
            function() {
                $(this).removeClass('show');
                $(this).find('.dropdown-menu').removeClass('show');
            }
        );
    }
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.contact-card, .info-card, .accordion-item').forEach(function(el) {
            el.classList.add('loading');
            observer.observe(el);
        });
    }

    // Hero section animations
    setTimeout(function() {
        $('.animate-slide-up').addClass('loaded');
    }, 300);

    // Stagger animation for contact cards
    $('.contact-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });
}

// Contact cards interactions
function initializeContactCards() {
    // Contact card hover effects
    $('.contact-card').hover(
        function() {
            $(this).find('.contact-icon').addClass('contact-icon-hover');
        },
        function() {
            $(this).find('.contact-icon').removeClass('contact-icon-hover');
        }
    );

    // Info card hover effects
    $('.info-card').hover(
        function() {
            $(this).find('.info-icon').addClass('info-icon-hover');
        },
        function() {
            $(this).find('.info-icon').removeClass('info-icon-hover');
        }
    );
}

// FAQ accordion functionality
function initializeFAQ() {
    // Custom accordion behavior
    $('.accordion-button').on('click', function() {
        const isExpanded = $(this).attr('aria-expanded') === 'true';
        
        // Close all other accordions
        $('.accordion-button').not(this).attr('aria-expanded', 'false');
        $('.accordion-collapse').not($(this).attr('data-bs-target')).removeClass('show');
        
        // Toggle current accordion
        if (!isExpanded) {
            $(this).attr('aria-expanded', 'true');
            $($(this).attr('data-bs-target')).addClass('show');
        }
    });

    // Track FAQ interactions
    $('.accordion-button').on('click', function() {
        const faqTitle = $(this).text().trim();
        console.log('FAQ clicked:', faqTitle);
        
        // You can add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                faq_title: faqTitle
            });
        }
    });
}

// Character counter for message textarea
function initializeCharacterCounter() {
    const messageTextarea = $('#message');
    const charCount = $('#charCount');
    const maxChars = 1000;

    messageTextarea.on('input', function() {
        const currentLength = $(this).val().length;
        charCount.text(currentLength);
        
        // Change color based on character count
        if (currentLength > maxChars * 0.9) {
            charCount.removeClass('text-muted text-warning').addClass('text-danger');
        } else if (currentLength > maxChars * 0.7) {
            charCount.removeClass('text-muted text-danger').addClass('text-warning');
        } else {
            charCount.removeClass('text-warning text-danger').addClass('text-muted');
        }
        
        // Prevent further input if max reached
        if (currentLength >= maxChars) {
            $(this).val($(this).val().substring(0, maxChars));
            charCount.text(maxChars);
        }
    });
}

// Map functionality
function initializeMap() {
    // Map placeholder click handler
    $('.map-placeholder').on('click', function() {
        // In a real implementation, you would initialize Google Maps here
        showNotification('Opening location in Google Maps...', 'info');
        
        // Open Google Maps in new tab
        setTimeout(function() {
            window.open('https://maps.google.com/?q=123+Care+Street+San+Francisco+CA', '_blank');
        }, 1000);
    });

    // Map hover effects
    $('.map-placeholder').hover(
        function() {
            $(this).css('cursor', 'pointer');
            $(this).find('.btn').addClass('btn-hover-effect');
        },
        function() {
            $(this).find('.btn').removeClass('btn-hover-effect');
        }
    );
}

// Form functionality
function initializeForms() {
    // Main contact form validation and submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            urgency: $('input[name="urgency"]:checked').val(),
            message: $('#message').val(),
            newsletter: $('#newsletter').is(':checked')
        };
        
        if (validateContactForm(formData)) {
            submitContactForm(formData);
        }
    });

    // Real-time form validation
    $('#email').on('blur', function() {
        const email = $(this).val();
        if (email && !validateEmail(email)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Please enter a valid email address');
        } else {
            $(this).removeClass('is-invalid');
            hideFieldError($(this));
        }
    });

    $('#phone').on('blur', function() {
        const phone = $(this).val();
        if (phone && !validatePhone(phone)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Please enter a valid phone number');
        } else {
            $(this).removeClass('is-invalid');
            hideFieldError($(this));
        }
    });

    // Priority level change handler
    $('input[name="urgency"]').on('change', function() {
        const urgency = $(this).val();
        updateFormUrgencyStyle(urgency);
        
        if (urgency === 'urgent') {
            showNotification('For urgent matters, please call us directly at (555) 123-CARE', 'warning');
        }
    });

    // Newsletter form
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        
        if (validateEmail(email)) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            $(this).find('input[type="email"]').val('');
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });

    // Newsletter button click
    $('.newsletter-form .btn').on('click', function(e) {
        e.preventDefault();
        const form = $(this).closest('.newsletter-form');
        const email = form.find('input[type="email"]').val();
        
        if (validateEmail(email)) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            form.find('input[type="email"]').val('');
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });

    // Login form validation
    $('#loginModal form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        
        if (validateEmail(email) && password.length > 0) {
            showNotification('Login successful!', 'success');
            $('#loginModal').modal('hide');
        } else {
            showNotification('Please check your email and password.', 'error');
        }
    });

    // Register form validation
    $('#registerModal form').on('submit', function(e) {
        e.preventDefault();
        
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();
        const userType = $('#userType').val();
        const agreeTerms = $('#agreeTerms').is(':checked');
        
        if (firstName && lastName && validateEmail(email) && password.length >= 6 && userType && agreeTerms) {
            showNotification('Registration successful! Welcome to CareConnect.', 'success');
            $('#registerModal').modal('hide');
        } else {
            showNotification('Please fill all fields correctly and agree to terms.', 'error');
        }
    });
}

// Contact form validation
function validateContactForm(formData) {
    let isValid = true;
    const errors = [];

    // Required fields validation
    if (!formData.firstName.trim()) {
        errors.push('First name is required');
        $('#firstName').addClass('is-invalid');
        isValid = false;
    }

    if (!formData.lastName.trim()) {
        errors.push('Last name is required');
        $('#lastName').addClass('is-invalid');
        isValid = false;
    }

    if (!formData.email.trim()) {
        errors.push('Email is required');
        $('#email').addClass('is-invalid');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
        $('#email').addClass('is-invalid');
        isValid = false;
    }

    if (!formData.subject) {
        errors.push('Please select a subject');
        $('#subject').addClass('is-invalid');
        isValid = false;
    }

    if (!formData.message.trim()) {
        errors.push('Message is required');
        $('#message').addClass('is-invalid');
        isValid = false;
    } else if (formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
        $('#message').addClass('is-invalid');
        isValid = false;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
        errors.push('Please enter a valid phone number');
        $('#phone').addClass('is-invalid');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
    }

    return isValid;
}

// Submit contact form
function submitContactForm(formData) {
    // Show loading state
    const submitBtn = $('#contactForm button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...').prop('disabled', true);

    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
        // Reset form
        $('#contactForm')[0].reset();
        $('input[name="urgency"][value="low"]').prop('checked', true);
        $('#charCount').text('0');
        
        // Remove validation classes
        $('#contactForm .form-control, #contactForm .form-select').removeClass('is-invalid is-valid');
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset button
        submitBtn.html(originalText).prop('disabled', false);
        
        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                form_name: 'contact_form',
                subject: formData.subject,
                urgency: formData.urgency
            });
        }
    }, 2000);
}

// Update form styling based on urgency
function updateFormUrgencyStyle(urgency) {
    const form = $('#contactForm');
    
    // Remove all urgency classes
    form.removeClass('form-low form-medium form-high form-urgent');
    
    // Add appropriate class
    form.addClass(`form-${urgency}`);
    
    // Update submit button based on urgency
    const submitBtn = form.find('button[type="submit"]');
    submitBtn.removeClass('btn-primary btn-warning btn-danger');
    
    switch (urgency) {
        case 'urgent':
            submitBtn.addClass('btn-danger');
            break;
        case 'high':
            submitBtn.addClass('btn-warning');
            break;
        default:
            submitBtn.addClass('btn-primary');
    }
}

// Live chat functionality
function openLiveChat() {
    // Simulate live chat opening
    showNotification('Live chat is opening...', 'info');
    
    // In a real implementation, you would integrate with a chat service like Intercom, Zendesk, etc.
    setTimeout(function() {
        showNotification('Live chat is currently available during business hours (8 AM - 8 PM PST)', 'info');
    }, 1500);
}

// Scroll effects
function initializeScrollEffects() {
    // Active navigation based on scroll position
    $(window).scroll(function() {
        const scrollPos = $(document).scrollTop();
        
        // Update active nav link
        if (scrollPos < 100) {
            $('.navbar-nav .nav-link').removeClass('active');
            $('.navbar-nav .nav-link[href="contact.html"]').addClass('active');
        }
    });

    // Parallax effect for hero section
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const parallax = $('.hero-bg');
        const speed = 0.3;
        
        if (parallax.length) {
            parallax.css('transform', `translateY(${scrolled * speed}px)`);
        }
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showFieldError(field, message) {
    let errorDiv = field.siblings('.invalid-feedback');
    if (errorDiv.length === 0) {
        errorDiv = $(`<div class="invalid-feedback">${message}</div>`);
        field.after(errorDiv);
    } else {
        errorDiv.text(message);
    }
}

function hideFieldError(field) {
    field.siblings('.invalid-feedback').remove();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = $(`
        <div class="notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.length) {
            notification.alert('close');
        }
    }, 5000);
}

// Contact page specific functionality
function initializeContactSpecific() {
    // Phone number formatting
    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        $(this).val(value);
    });

    // Auto-resize textarea
    $('#message').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Office hours highlighting
    highlightCurrentOfficeHours();
}

function highlightCurrentOfficeHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    let isOpen = false;
    
    // Check if currently open (adjust times as needed)
    if (day >= 1 && day <= 5) { // Monday - Friday
        isOpen = hour >= 8 && hour < 20; // 8 AM - 8 PM
    } else if (day === 6) { // Saturday
        isOpen = hour >= 9 && hour < 18; // 9 AM - 6 PM
    } else if (day === 0) { // Sunday
        isOpen = hour >= 10 && hour < 16; // 10 AM - 4 PM
    }
    
    if (isOpen) {
        $('.office-hours').prepend('<div class="text-success mb-2"><i class="fas fa-circle me-1"></i>Currently Open</div>');
    } else {
        $('.office-hours').prepend('<div class="text-muted mb-2"><i class="far fa-circle me-1"></i>Currently Closed</div>');
    }
}

// Initialize everything when DOM is ready
$(document).ready(function() {
    initializeContactPage();
    initializeContactSpecific();
    
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Make live chat function available globally
    window.openLiveChat = openLiveChat;
});

// Window resize handler
$(window).resize(function() {
    const windowWidth = $(window).width();
    
    if (windowWidth < 768) {
        // Mobile specific adjustments
        $('.dropdown').off('mouseenter mouseleave');
    } else {
        // Desktop specific adjustments
        $('.dropdown').hover(
            function() {
                $(this).addClass('show');
                $(this).find('.dropdown-menu').addClass('show');
            },
            function() {
                $(this).removeClass('show');
                $(this).find('.dropdown-menu').removeClass('show');
            }
        );
    }
});

// Export functions for external use
window.ContactPage = {
    showNotification: showNotification,
    validateEmail: validateEmail,
    validatePhone: validatePhone,
    openLiveChat: openLiveChat
};