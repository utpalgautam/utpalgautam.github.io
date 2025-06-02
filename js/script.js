// ============================================= //
//  Portfolio Website JavaScript                 //
// ============================================= //

class PortfolioWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAnimations();
        this.handlePreloader();
        this.setupCustomCursor();
        this.initializeTypingEffect();
        this.setupSkillsAnimation();
        this.setupProjectFilters();
        this.setupContactForm();
        this.setupThemeSwitcher();
        this.setupScrollEffects();
        this.updateCurrentYear();
    }

    // ========================================= //
    //  Event Listeners Setup                   //
    // ========================================= //
    setupEventListeners() {
        // Navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
        });

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleWindowLoad.bind(this));

        // Theme switcher
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Mobile navigation
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', this.toggleMobileNav.bind(this));
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    // ========================================= //
    //  Theme Switcher (Fixed Implementation)   //
    // ========================================= //
    setupThemeSwitcher() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme switcher visual state
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher) {
            if (theme === 'dark') {
                themeSwitcher.classList.add('dark');
            } else {
                themeSwitcher.classList.remove('dark');
            }
        }

        // Trigger custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // ========================================= //
    //  Navigation                              //
    // ========================================= //
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // Set active navigation based on scroll position
        this.updateActiveNavigation();
    }

    toggleMobileNav() {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (navLinks && hamburger) {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile navigation if open
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ========================================= //
    //  Preloader                               //
    // ========================================= //
    handlePreloader() {
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 300);
                }, 1000);
            }
        });
    }

    // ========================================= //
    //  Custom Cursor                           //
    // ========================================= //
    setupCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (!cursor || !cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        });

        // Smooth follower animation
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hide cursor on mobile devices
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }
    }

    // ========================================= //
    //  Typing Effect                           //
    // ========================================= //
    initializeTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Full Stack Developer',
            'UI/UX Designer',
            'Problem Solver',
            'Creative Thinker'
        ];

        if (typeof Typed !== 'undefined') {
            new Typed('.typing-text', {
                strings: texts,
                typeSpeed: 100,
                backSpeed: 60,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // ========================================= //
    //  Skills Animation                        //
    // ========================================= //
    setupSkillsAnimation() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillProgress(entry.target);
                }
            });
        }, observerOptions);

        skillCards.forEach(card => {
            skillsObserver.observe(card);
        });
    }

    animateSkillProgress(skillCard) {
        const progressRing = skillCard.querySelector('.progress-ring-circle');
        const percentageElement = skillCard.querySelector('.skill-percentage');
        
        if (!progressRing || !percentageElement) return;

        const percentage = parseInt(percentageElement.textContent);
        const circumference = 2 * Math.PI * 52; // radius = 52
        const offset = circumference - (percentage / 100) * circumference;

        progressRing.style.strokeDashoffset = offset;

        // Animate percentage counter
        this.animateCounter(percentageElement, 0, percentage, 2000);
    }

    

    animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '%';
        }, 16);
    }

    // ========================================= //
    //  Project Filters                         //
    // ========================================= //
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========================================= //
    //  Contact Form                            //
    // ========================================= //
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(newsletterForm);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!email) return;

        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;

        // Simulate subscription (replace with actual handling)
        setTimeout(() => {
            form.reset();
            this.showNotification('Successfully subscribed!', 'success');
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Add styles dynamically
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease'
        });

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ========================================= //
    //  Scroll Effects                          //
    // ========================================= //
    setupScrollEffects() {
        // GSAP ScrollTrigger animations
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Animate sections on scroll
            gsap.utils.toArray('.section').forEach(section => {
                gsap.fromTo(section, 
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Parallax effect for hero background
            gsap.to('.hero::before', {
                yPercent: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

    handleScroll() {
        this.updateActiveNavigation();
        this.updateHeaderBackground();
    }

    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (!header) return;

        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ========================================= //
    //  Component Initialization                //
    // ========================================= //
    initializeComponents() {
        this.setupLazyLoading();
        this.setupParallaxEffects();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.skill-card, .project-card, .info-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================================= //
    //  Utility Functions                       //
    // ========================================= //
    handleResize() {
        // Handle responsive adjustments
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (window.innerWidth <= 768) {
            if (cursor) cursor.style.display = 'none';
            if (cursorFollower) cursorFollower.style.display = 'none';
        } else {
            if (cursor) cursor.style.display = 'block';
            if (cursorFollower) cursorFollower.style.display = 'block';
        }
    }

    handleWindowLoad() {
        // Initialize any components that need the window to be fully loaded
        this.setupSkillsAnimation();
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}



// Enhanced Skills Radar Chart Implementation
function initializeSkillsRadarChart() {
    const ctx = document.getElementById('skillsRadarChart');
    if (!ctx) return;

    // Skills data with better organization
    const skillsData = {
        labels: [
            'Frontend Development',
            'Backend Development', 
            'Mobile Development',
            'UI/UX Design',
            'DevOps & Cloud',
            'Tools & Others'
        ],
        datasets: [{
            label: 'Skill Level',
            data: [90, 85, 75, 80, 70, 88],
            backgroundColor: 'rgba(67, 97, 238, 0.15)',
            borderColor: 'rgba(67, 97, 238, 0.8)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(67, 97, 238, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(67, 97, 238, 1)',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 4,
            fill: true,
            tension: 0.1
        }]
    };

    const config = {
        type: 'radar',
        data: skillsData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            devicePixelRatio: window.devicePixelRatio || 1,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 2,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `Skill Level: ${context.parsed.r}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 20,
                        color: 'var(--text-light)',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        backdropColor: 'transparent',
                        showLabelBackdrop: false,
                        z: 1
                    },
                    grid: {
                        color: function(context) {
                            const theme = document.documentElement.getAttribute('data-theme');
                            return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: 1
                    },
                    angleLines: {
                        color: function(context) {
                            const theme = document.documentElement.getAttribute('data-theme');
                            return theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
                        },
                        lineWidth: 1
                    },
                    pointLabels: {
                        color: 'var(--text-color)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 25,
                        callback: function(label) {
                            // Break long labels into multiple lines
                            const words = label.split(' ');
                            if (words.length > 2) {
                                const mid = Math.ceil(words.length / 2);
                                return [
                                    words.slice(0, mid).join(' '),
                                    words.slice(mid).join(' ')
                                ];
                            }
                            return label;
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3,
                    tension: 0.1
                },
                point: {
                    radius: 6,
                    hoverRadius: 8,
                    borderWidth: 3,
                    hoverBorderWidth: 4
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart',
                animateRotate: true,
                animateScale: true
            },
            interaction: {
                intersect: false,
                mode: 'point'
            }
        }
    };

    // Destroy existing chart if it exists
    if (window.skillsChart) {
        window.skillsChart.destroy();
    }

    // Create the chart
    window.skillsChart = new Chart(ctx, config);

    // Update chart on theme change
    document.addEventListener('themeChanged', () => {
        if (window.skillsChart) {
            window.skillsChart.update('none');
        }
    });
}

// Enhanced observer setup
function setupSkillsRadarObserver() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay to ensure proper rendering
                setTimeout(() => {
                    initializeSkillsRadarChart();
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(skillsSection);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupSkillsRadarObserver();
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (window.skillsChart) {
        window.skillsChart.resize();
    }
}, 250));




// ========================================= //
//  Initialize Portfolio Website            //
// ========================================= //
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioWebsite();
    setupSkillsRadarObserver();
});

// ========================================= //
//  Additional Utility Functions            //
// ========================================= //

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for notifications
const notificationStyles = `
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
    
    .header.scrolled {
        background-color: rgba(var(--bg-color-rgb), 0.95);
        backdrop-filter: blur(20px);
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
