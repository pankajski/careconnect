// Custom JavaScript for CareConnect Website

$(document).ready(function() {
    // Initialize all components when document is ready
    initializeComponents();
});

// Initialize all website components
function initializeComponents() {
    initializeNavbar();
    initializeCarousel();
    initializeAnimations();
    initializeCounters();
    initializeScrollToTop();
    initializeForms();
    initializeScrollEffects();
    initializeTooltips();
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

    // Navbar background change on scroll
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var navbar = $('.navbar');
        
        if (scroll >= 100) {
            navbar.addClass('navbar-scrolled');
            navbar.css({
                'background-color': 'rgba(0, 0, 0, 0.9)',
                'backdrop-filter': 'blur(10px)',
                'transition': 'all 0.3s ease'
            });
        } else {
            navbar.removeClass('navbar-scrolled');
            navbar.css({
                'background-color': 'transparent',
                'backdrop-filter': 'none'
            });
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

// Carousel functionality
function initializeCarousel() {
    // Custom carousel controls
    $('.carousel-control-prev, .carousel-control-next').on('click', function() {
        var carousel = $('#heroCarousel');
        if ($(this).hasClass('carousel-control-prev')) {
            carousel.carousel('prev');
        } else {
            carousel.carousel('next');
        }
    });

    // Pause carousel on hover
    $('#heroCarousel').hover(
        function() {
            $(this).carousel('pause');
        },
        function() {
            $(this).carousel('cycle');
        }
    );

    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode === 37) { // Left arrow
            $('#heroCarousel').carousel('prev');
        } else if (e.keyCode === 39) { // Right arrow
            $('#heroCarousel').carousel('next');
        }
    });

    // Touch gestures for mobile
    var startX, startY, endX, endY;
    
    $('#heroCarousel').on('touchstart', function(e) {
        startX = e.originalEvent.touches[0].clientX;
        startY = e.originalEvent.touches[0].clientY;
    });
    
    $('#heroCarousel').on('touchend', function(e) {
        endX = e.originalEvent.changedTouches[0].clientX;
        endY = e.originalEvent.changedTouches[0].clientY;
        
        var deltaX = startX - endX;
        var deltaY = startY - endY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 50) {
                $(this).carousel('next');
            } else if (deltaX < -50) {
                $(this).carousel('prev');
            }
        }
    });
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
        document.querySelectorAll('.service-card, .testimonial-card, .step-number, .stat-item').forEach(function(el) {
            el.classList.add('loading');
            observer.observe(el);
        });
    }

    // Stagger animation for service cards
    $('.service-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });

    // Hover animations for service cards
    $('.service-card').hover(
        function() {
            $(this).find('.service-icon').addClass('animate__animated animate__pulse');
        },
        function() {
            $(this).find('.service-icon').removeClass('animate__animated animate__pulse');
        }
    );
}

// Counter animation
function initializeCounters() {
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        updateCounter();
    }

    // Trigger counter animation when section comes into view
    const counterSection = document.querySelector('.bg-primary');
    if (counterSection) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.counter').forEach(function(counter) {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counterSection);
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopButton = $('<button class="scroll-to-top"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(scrollToTopButton);

    // Show/hide scroll to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollToTopButton.fadeIn();
        } else {
            scrollToTopButton.fadeOut();
        }
    });

    // Scroll to top click event
    scrollToTopButton.on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
}

// Form functionality
function initializeForms() {
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

    // Newsletter form
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        
        if (validateEmail(email)) {
            showNotification('Thank you for subscribing!', 'success');
            $(this).find('input[type="email"]').val('');
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });

    // Real-time form validation
    $('input[type="email"]').on('blur', function() {
        const email = $(this).val();
        const isValid = validateEmail(email);
        
        if (email && !isValid) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $('input[type="password"]').on('input', function() {
        const password = $(this).val();
        const strength = getPasswordStrength(password);
        
        // Add password strength indicator
        let strengthText = '';
        let strengthClass = '';
        
        if (password.length === 0) {
            strengthText = '';
        } else if (strength < 2) {
            strengthText = 'Weak';
            strengthClass = 'text-danger';
        } else if (strength < 4) {
            strengthText = 'Medium';
            strengthClass = 'text-warning';
        } else {
            strengthText = 'Strong';
            strengthClass = 'text-success';
        }
        
        let indicator = $(this).siblings('.password-strength');
        if (indicator.length === 0) {
            indicator = $('<small class="password-strength"></small>');
            $(this).after(indicator);
        }
        
        indicator.text(strengthText).attr('class', `password-strength ${strengthClass}`);
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero section (optional)
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const parallax = $('.carousel-bg');
        const speed = 0.5;
        
        parallax.css('transform', `translateY(${scrolled * speed}px)`);
    });

    // Active navigation based on scroll position
    $(window).scroll(function() {
        const scrollPos = $(document).scrollTop();
        
        $('.navbar-nav .nav-link[href^="#"]').each(function() {
            const currLink = $(this);
            const refElement = $(currLink.attr('href'));
            
            if (refElement.length && 
                refElement.position().top <= scrollPos + 100 && 
                refElement.position().top + refElement.height() > scrollPos + 100) {
                $('.navbar-nav .nav-link').removeClass('active');
                currLink.addClass('active');
            }
        });
    });
}

// Initialize tooltips and popovers
function initializeTooltips() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = $(`
        <div class="notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.alert('close');
    }, 5000);
}

// Lazy loading for images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

// Search functionality (placeholder)
function initializeSearch() {
    $('.search-input').on('input', function() {
        const query = $(this).val().toLowerCase();
        // Implement search logic here
        console.log('Searching for:', query);
    });
}

// Dynamic content loading
function loadServiceProviders(service, location) {
    // Placeholder for dynamic content loading
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve({
                providers: [
                    { name: 'Provider 1', rating: 4.8, experience: '5 years' },
                    { name: 'Provider 2', rating: 4.9, experience: '3 years' }
                ]
            });
        }, 1000);
    });
}

// Accessibility improvements
function initializeAccessibility() {
    // Skip to main content link
    $('body').prepend('<a href="#main-content" class="skip-link">Skip to main content</a>');
    
    // Focus management for modals
    $('#loginModal, #registerModal').on('shown.bs.modal', function() {
        $(this).find('input:first').focus();
    });
    
    // Keyboard navigation for carousel
    $('#heroCarousel').attr('tabindex', '0').on('keydown', function(e) {
        if (e.keyCode === 37) { // Left arrow
            $(this).carousel('prev');
            e.preventDefault();
        } else if (e.keyCode === 39) { // Right arrow
            $(this).carousel('next');
            e.preventDefault();
        }
    });
}

// Performance monitoring
function initializePerformance() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log('Page load time:', loadTime + 'ms');
        
        // Send analytics data (placeholder)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: Math.round(loadTime)
            });
        }
    });
}

// Initialize all functionality when DOM is ready
$(document).ready(function() {
    initializeComponents();
    initializeLazyLoading();
    initializeAccessibility();
    initializePerformance();
    
    // Add loading screen removal
    setTimeout(function() {
        $('.loading-screen').fadeOut(500);
    }, 1000);
});

// Window resize handler
$(window).resize(function() {
    // Recalculate dimensions on resize
    const windowWidth = $(window).width();
    
    if (windowWidth < 768) {
        // Mobile specific adjustments
        $('.dropdown').off('mouseenter mouseleave');
    } else {
        // Desktop specific adjustments
        initializeDesktopFeatures();
    }
});

function initializeDesktopFeatures() {
    // Desktop-specific hover effects
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

// Export functions for potential external use
window.CareConnect = {
    showNotification: showNotification,
    validateEmail: validateEmail,
    loadServiceProviders: loadServiceProviders
};