// Custom JavaScript for Baby Care Page

$(document).ready(function() {
    // Initialize all components when document is ready
    initializeBabyCarePage();
});

// Initialize Baby Care page components
function initializeBabyCarePage() {
    initializeNavbar();
    initializeAnimations();
    initializeForms();
    initializeScrollEffects();
    initializeServiceCards();
    initializeTestimonials();
    initializeBabysitterFinder();
    initializeFloatingElements();
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
        document.querySelectorAll('.service-type-card, .testimonial-card, .feature-item').forEach(function(el) {
            observer.observe(el);
        });
    }

    // Initialize hero animations
    initializeHeroAnimations();
    
    // Initialize floating hearts animation
    initializeFloatingHearts();
    
    // Initialize service card hover effects
    initializeServiceHoverEffects();
}

// Hero section animations
function initializeHeroAnimations() {
    // Animate stats counters
    setTimeout(function() {
        animateCounters();
    }, 2000);
    
    // Animate hero image on load
    $('.baby-hero-img').on('load', function() {
        $(this).addClass('animate__animated animate__zoomIn');
    });
    
    // Add heartbeat animation to baby heart emoji
    setInterval(function() {
        $('.baby-heart').addClass('animate__animated animate__heartBeat');
        setTimeout(function() {
            $('.baby-heart').removeClass('animate__animated animate__heartBeat');
        }, 1000);
    }, 3000);
}

// Animate statistics counters
function animateCounters() {
    $('.stat-number').each(function() {
        const $this = $(this);
        const countTo = $this.text().replace(/\D/g, '');
        const suffix = $this.text().replace(/\d/g, '');
        
        if (countTo) {
            $({ countNum: 0 }).animate(
                { countNum: countTo },
                {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum) + suffix);
                    },
                    complete: function() {
                        $this.text(this.countNum + suffix);
                    }
                }
            );
        }
    });
}

// Floating hearts animation
function initializeFloatingHearts() {
    function createFloatingHeart() {
        const hearts = ['💖', '💕', '💗', '💝', '💘'];
        const heart = hearts[Math.floor(Math.random() * hearts.length)];
        const $heart = $('<span class="floating-heart">' + heart + '</span>');
        
        $heart.css({
            position: 'absolute',
            left: Math.random() * 100 + '%',
            bottom: '-50px',
            fontSize: '1.5rem',
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 1
        });
        
        $('.floating-hearts').append($heart);
        
        $heart.animate(
            {
                bottom: '110%',
                opacity: 0
            },
            {
                duration: 4000,
                easing: 'linear',
                complete: function() {
                    $heart.remove();
                }
            }
        );
    }
    
    // Create floating hearts periodically
    setInterval(createFloatingHeart, 2000);
}

// Service card interactions
function initializeServiceCards() {
    $('.service-type-card').hover(
        function() {
            $(this).find('.service-badge').addClass('animate__animated animate__rubberBand');
            $(this).find('.service-img').addClass('zoom-effect');
        },
        function() {
            $(this).find('.service-badge').removeClass('animate__animated animate__rubberBand');
            $(this).find('.service-img').removeClass('zoom-effect');
        }
    );
    
    // Service card click tracking
    $('.service-type-card').on('click', function() {
        const serviceType = $(this).find('.card-title').text();
        console.log('Service card clicked:', serviceType);
        
        // Add click effect
        $(this).addClass('animate__animated animate__pulse');
        setTimeout(() => {
            $(this).removeClass('animate__animated animate__pulse');
        }, 1000);
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_card_click', {
                service_type: serviceType
            });
        }
    });
}

// Service hover effects
function initializeServiceHoverEffects() {
    $('.service-type-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });
}

// Testimonial interactions
function initializeTestimonials() {
    $('.testimonial-card').hover(
        function() {
            $(this).find('.parent-avatar img').addClass('animate__animated animate__pulse');
            $(this).find('.stars').addClass('animate__animated animate__swing');
        },
        function() {
            $(this).find('.parent-avatar img').removeClass('animate__animated animate__pulse');
            $(this).find('.stars').removeClass('animate__animated animate__swing');
        }
    );
    
    // Add testimonial click tracking
    $('.testimonial-card').on('click', function() {
        const parentName = $(this).find('h6').text();
        console.log('Testimonial clicked:', parentName);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_interaction', {
                parent_name: parentName
            });
        }
    });
}

// Babysitter finder form
function initializeBabysitterFinder() {
    $('#babysitterForm').on('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            childAge: $('#childAge').val(),
            careType: $('#careType').val(),
            startDate: $('#startDate').val(),
            zipCode: $('#zipCode').val(),
            requirements: []
        };
        
        // Collect checkboxes
        $('input[type="checkbox"]:checked').each(function() {
            formData.requirements.push($(this).attr('id'));
        });
        
        if (validateBabysitterForm(formData)) {
            submitBabysitterSearch(formData);
        }
    });
    
    // Real-time validation
    $('#zipCode').on('input', function() {
        const zipCode = $(this).val();
        if (zipCode.length === 5 && /^\d+$/.test(zipCode)) {
            $(this).addClass('is-valid').removeClass('is-invalid');
            updateServiceAvailability(zipCode);
        } else if (zipCode.length > 0) {
            $(this).addClass('is-invalid').removeClass('is-valid');
        }
    });
    
    // Form field change tracking
    $('#childAge, #careType').on('change', function() {
        updatePriceEstimate();
        updateRecommendations();
    });
}

// Validate babysitter finder form
function validateBabysitterForm(formData) {
    let isValid = true;
    const errors = [];
    
    if (!formData.childAge) {
        errors.push('Please select your child\'s age');
        $('#childAge').addClass('is-invalid');
        isValid = false;
    }
    
    if (!formData.careType) {
        errors.push('Please select the type of care needed');
        $('#careType').addClass('is-invalid');
        isValid = false;
    }
    
    if (!formData.zipCode) {
        errors.push('Please enter your ZIP code');
        $('#zipCode').addClass('is-invalid');
        isValid = false;
    } else if (formData.zipCode.length !== 5 || !/^\d+$/.test(formData.zipCode)) {
        errors.push('Please enter a valid 5-digit ZIP code');
        $('#zipCode').addClass('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
    }
    
    return isValid;
}

// Submit babysitter search
function submitBabysitterSearch(formData) {
    const submitBtn = $('#babysitterForm button[type="submit"]');
    const originalText = submitBtn.html();
    
    // Show loading state
    submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Searching...').prop('disabled', true);
    
    // Simulate search process
    setTimeout(function() {
        // Reset button
        submitBtn.html(originalText).prop('disabled', false);
        
        // Show success message with results
        showSearchResults(formData);
        
        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'babysitter_search', {
                child_age: formData.childAge,
                care_type: formData.careType,
                zip_code: formData.zipCode,
                requirements_count: formData.requirements.length
            });
        }
    }, 2000);
}

// Show search results
function showSearchResults(formData) {
    const resultsCount = Math.floor(Math.random() * 20) + 5; // 5-25 results
    
    showNotification(
        `Great! We found ${resultsCount} qualified babysitters in your area. Redirecting to search results...`,
        'success'
    );
    
    // Simulate redirect to results page
    setTimeout(function() {
        // In a real app, this would redirect to results page
        showNotification('Search completed! In a real app, you would see the results page now.', 'info');
    }, 3000);
}

// Update price estimate based on selections
function updatePriceEstimate() {
    const childAge = $('#childAge').val();
    const careType = $('#careType').val();
    
    let basePrice = 15;
    
    // Adjust price based on child age
    if (childAge === 'newborn') basePrice = 18;
    else if (childAge === 'infant') basePrice = 16;
    
    // Adjust price based on care type
    if (careType === 'fulltime') basePrice = 25;
    else if (careType === 'emergency') basePrice += 5;
    
    // Show price estimate (could add to UI)
    console.log('Estimated price:', '$' + basePrice + '/hour');
}

// Update recommendations based on selections
function updateRecommendations() {
    const childAge = $('#childAge').val();
    const careType = $('#careType').val();
    
    // Show relevant recommendations
    if (childAge === 'newborn' && careType === 'regular') {
        // Could show newborn-specific tips
        console.log('Showing newborn care recommendations');
    }
}

// Update service availability based on ZIP code
function updateServiceAvailability(zipCode) {
    // Simulate checking service availability
    setTimeout(function() {
        const isAvailable = Math.random() > 0.1; // 90% availability
        
        if (isAvailable) {
            $('#zipCode').siblings('.form-text').remove();
            $('#zipCode').after('<div class="form-text text-success"><i class="fas fa-check me-1"></i>Service available in your area</div>');
        } else {
            $('#zipCode').siblings('.form-text').remove();
            $('#zipCode').after('<div class="form-text text-warning"><i class="fas fa-exclamation-triangle me-1"></i>Limited availability in your area</div>');
        }
    }, 500);
}

// Floating elements animation
function initializeFloatingElements() {
    // Add random movement to floating toys
    $('.floating-toy').each(function(index) {
        const $toy = $(this);
        const delay = index * 1000;
        
        setTimeout(function() {
            animateFloatingToy($toy);
        }, delay);
    });
}

// Animate individual floating toy
function animateFloatingToy($toy) {
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 50;
    
    $toy.animate(
        {
            left: '+=' + randomX + 'px',
            top: '+=' + randomY + 'px'
        },
        {
            duration: 3000,
            easing: 'swing',
            complete: function() {
                // Reset and repeat
                setTimeout(function() {
                    animateFloatingToy($toy);
                }, 2000);
            }
        }
    );
}

// Form functionality
function initializeForms() {
    // Newsletter form
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        
        if (validateEmail(email)) {
            showNotification('Thank you for subscribing to parenting tips and updates!', 'success');
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
            showNotification('Thank you for subscribing to parenting tips and updates!', 'success');
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
            showNotification('Login successful! Welcome back to CareConnect.', 'success');
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
            showNotification('Registration successful! Welcome to CareConnect family!', 'success');
            $('#registerModal').modal('hide');
        } else {
            showNotification('Please fill all fields correctly and agree to terms.', 'error');
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Active navigation based on scroll position
    $(window).scroll(function() {
        const scrollPos = $(document).scrollTop();
        
        // Update active nav link based on section
        if (scrollPos < 500) {
            $('.navbar-nav .nav-link').removeClass('active');
            $('.navbar-nav .dropdown-toggle').addClass('active');
        }
    });

    // Parallax effect for floating elements
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const rate = scrolled * -0.3;
        
        $('.floating-toy').css('transform', 'translateY(' + rate + 'px)');
    });
    
    // Add scroll-based animations
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        const windowHeight = $(this).height();
        
        $('.service-type-card, .testimonial-card').each(function() {
            const elementTop = $(this).offset().top;
            
            if (scrollTop + windowHeight > elementTop + 100) {
                $(this).addClass('animate__animated animate__fadeInUp');
            }
        });
    });
}

// Emergency care functionality
function initializeEmergencyFeatures() {
    // Emergency call button tracking
    $('a[href^="tel:"]').on('click', function() {
        const phoneNumber = $(this).attr('href').replace('tel:', '');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'emergency_call', {
                phone_number: phoneNumber
            });
        }
        
        showNotification('Connecting you to our emergency care line...', 'info');
    });
}

// Age-specific tips and recommendations
function showAgeSpecificTips(age) {
    const tips = {
        newborn: [
            "Newborns need feeding every 2-3 hours",
            "Always support the baby's head and neck",
            "Keep a consistent sleep schedule"
        ],
        infant: [
            "Babies start teething around 6 months",
            "Introduce solid foods gradually",
            "Baby-proof your home for crawling"
        ],
        toddler: [
            "Toddlers need 11-14 hours of sleep daily",
            "Set consistent routines and boundaries",
            "Encourage language development through reading"
        ]
    };
    
    if (tips[age]) {
        // Could display these tips in the UI
        console.log('Tips for ' + age + ':', tips[age]);
    }
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element with baby-themed styling
    const notification = $(`
        <div class="notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <i class="fas fa-baby me-2"></i>${message}
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

// Initialize specialized baby care features
function initializeBabyCareSpecific() {
    // Age selector change handler
    $('#childAge').on('change', function() {
        const selectedAge = $(this).val();
        showAgeSpecificTips(selectedAge);
        updateCaregiverRecommendations(selectedAge);
    });
    
    // Care type change handler
    $('#careType').on('change', function() {
        const careType = $(this).val();
        updateServiceDescription(careType);
    });
    
    // Initialize emergency features
    initializeEmergencyFeatures();
}

// Update caregiver recommendations based on child age
function updateCaregiverRecommendations(age) {
    const recommendations = {
        newborn: "Look for caregivers with newborn experience and CPR certification",
        infant: "Seek caregivers experienced with developmental milestones",
        toddler: "Find energetic caregivers who can engage with active toddlers",
        preschool: "Choose caregivers with educational background for learning activities",
        school: "Look for caregivers who can help with homework and after-school activities"
    };
    
    if (recommendations[age]) {
        // Could show this recommendation in the UI
        console.log('Recommendation:', recommendations[age]);
    }
}

// Update service description based on care type
function updateServiceDescription(careType) {
    const descriptions = {
        occasional: "Perfect for date nights and occasional outings",
        regular: "Consistent weekly care for working parents",
        fulltime: "Comprehensive daily childcare and development support",
        emergency: "Last-minute care when you need it most"
    };
    
    if (descriptions[careType]) {
        // Could show this description in the UI
        console.log('Service description:', descriptions[careType]);
    }
}

// Initialize everything when DOM is ready
$(document).ready(function() {
    initializeBabyCarePage();
    initializeBabyCareSpecific();
    
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add loading completion
    setTimeout(function() {
        $('body').addClass('page-loaded');
    }, 1000);
});

// Window resize handler
$(window).resize(function() {
    const windowWidth = $(window).width();
    
    if (windowWidth < 768) {
        // Mobile specific adjustments
        $('.dropdown').off('mouseenter mouseleave');
        
        // Adjust floating elements for mobile
        $('.floating-toy').css('font-size', '2rem');
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
        
        $('.floating-toy').css('font-size', '3rem');
    }
});

// Export functions for external use
window.BabyCarePage = {
    showNotification: showNotification,
    validateEmail: validateEmail,
    animateCounters: animateCounters,
    showAgeSpecificTips: showAgeSpecificTips
};