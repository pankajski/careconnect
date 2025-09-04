// Custom JavaScript for About Page

$(document).ready(function() {
    // Initialize all components when document is ready
    initializeAboutPage();
});

// Initialize About page components
function initializeAboutPage() {
    initializeNavbar();
    initializeAnimations();
    initializeForms();
    initializeScrollEffects();
    initializeTeamCards();
    initializeStatsCounters();
}

// Navbar functionality (same as main page)
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

    // Navbar background is already set to bg-dark for about page
    // No need for scroll transparency effect here

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
        document.querySelectorAll('.mvv-card, .team-card, .about-image-wrapper').forEach(function(el) {
            el.classList.add('loading');
            observer.observe(el);
        });
    }

    // Hero section animations
    setTimeout(function() {
        $('.animate-slide-up').addClass('loaded');
    }, 300);
}

// Team cards interactions
function initializeTeamCards() {
    // Team card hover effects
    $('.team-card').hover(
        function() {
            $(this).find('.team-avatar img').addClass('team-hover-effect');
            $(this).find('.social-links a').addClass('social-hover-effect');
        },
        function() {
            $(this).find('.team-avatar img').removeClass('team-hover-effect');
            $(this).find('.social-links a').removeClass('social-hover-effect');
        }
    );

    // Social links hover effects
    $('.social-links a').hover(
        function() {
            $(this).addClass('social-link-hover');
        },
        function() {
            $(this).removeClass('social-link-hover');
        }
    );
}

// Mission, Vision, Values cards animation
function initializeMVVCards() {
    $('.mvv-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });

    // Hover effects for MVV cards
    $('.mvv-card').hover(
        function() {
            $(this).find('.mvv-icon').addClass('mvv-icon-hover');
        },
        function() {
            $(this).find('.mvv-icon').removeClass('mvv-icon-hover');
        }
    );
}

// Statistics counters for safety section
function initializeStatsCounters() {
    function animateStatCounter(element, target, suffix = '', duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        updateCounter();
    }

    // Trigger counter animation when safety section comes into view
    const safetySection = document.querySelector('.bg-primary');
    if (safetySection) {
        const safetyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Animate stat cards
                    $('.stat-card .h1').each(function() {
                        const text = $(this).text();
                        let target, suffix = '';
                        
                        if (text.includes('%')) {
                            target = parseInt(text);
                            suffix = '%';
                        } else if (text.includes('K+')) {
                            target = parseInt(text);
                            suffix = 'K+';
                        } else if (text.includes('/')) {
                            $(this).text(text); // Keep as is for 24/7
                            return;
                        } else {
                            target = parseInt(text);
                            suffix = '%';
                        }
                        
                        if (!isNaN(target)) {
                            animateStatCounter(this, target, suffix);
                        }
                    });
                    
                    safetyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        safetyObserver.observe(safetySection);
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Active navigation based on scroll position
    $(window).scroll(function() {
        const scrollPos = $(document).scrollTop();
        
        // Update active nav link based on section
        if (scrollPos < 100) {
            $('.navbar-nav .nav-link').removeClass('active');
            $('.navbar-nav .nav-link[href="about.html"]').addClass('active');
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

// Form functionality (same as main page)
function initializeForms() {
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

// About page specific animations
function initializeAboutSpecificAnimations() {
    // Stats badge animation
    setTimeout(function() {
        $('.about-stats-badge').addClass('stats-badge-animate');
    }, 1000);

    // Feature icons animation
    $('.feature-icon').each(function(index) {
        const $this = $(this);
        setTimeout(function() {
            $this.addClass('feature-icon-animate');
        }, index * 200);
    });

    // Safety features animation
    $('.feature-icon-white').each(function(index) {
        const $this = $(this);
        setTimeout(function() {
            $this.addClass('feature-icon-white-animate');
        }, index * 300);
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// Initialize everything when DOM is ready
$(document).ready(function() {
    initializeAboutPage();
    initializeMVVCards();
    initializeAboutSpecificAnimations();
    
    // Initialize Bootstrap tooltips for this page
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
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
window.AboutPage = {
    showNotification: showNotification,
    validateEmail: validateEmail
};