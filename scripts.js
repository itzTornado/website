// main.js

// Initialize GSAP and its plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Utility Functions
const lerp = (start, end, t) => start * (1 - t) + end * t;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.bindMethods();
        this.data = {
            ease: 0.1,
            current: 0,
            last: 0,
            rounded: 0
        };
        this.dom = {
            el: document.querySelector('[data-scroll]'),
            content: document.querySelector('[data-scroll-content]')
        };
        this.rAF = null;
        this.init();
    }

    bindMethods() {
        ['scroll', 'run', 'resize'].forEach(fn => this[fn] = this[fn].bind(this));
    }

    setHeight() {
        document.body.style.height = `${this.dom.content.getBoundingClientRect().height}px`;
    }

    resize() {
        this.setHeight();
        this.scroll();
    }

    scroll() {
        this.data.current = window.scrollY;
    }

    run() {
        this.data.last = lerp(this.data.last, this.data.current, this.data.ease);
        this.data.rounded = Math.round(this.data.last * 100) / 100;

        this.dom.content.style.transform = `translateY(-${this.data.rounded}px)`;
        this.requestAnimationFrame();
    }

    init() {
        this.setHeight();
        window.addEventListener('resize', this.resize, { passive: true });
        window.addEventListener('scroll', this.scroll, { passive: true });
        this.run();
    }
}

// Page Transitions
class PageTransitions {
    constructor() {
        this.overlay = document.querySelector('.nav-overlay');
        this.links = document.querySelectorAll('a[href^="#"]');
        this.bindEvents();
    }

    bindEvents() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                this.transitionTo(target);
            });
        });
    }

    transitionTo(target) {
        const tl = gsap.timeline();

        tl.to(this.overlay, {
            duration: 0.5,
            opacity: 1,
            visibility: 'visible',
            ease: 'power2.inOut'
        })
        .to(window, {
            duration: 0,
            scrollTo: target
        })
        .to(this.overlay, {
            duration: 0.5,
            opacity: 0,
            visibility: 'hidden',
            ease: 'power2.inOut'
        });
    }
}

// Portfolio Grid
class PortfolioGrid {
    constructor() {
        this.grid = document.querySelector('.project-grid');
        this.projects = document.querySelectorAll('.project-item');
        this.modal = document.querySelector('.modal');
        this.modalContent = document.querySelector('.modal-content');
        this.init();
    }

    init() {
        this.projects.forEach(project => {
            project.addEventListener('click', () => this.openModal(project));
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });
    }

    openModal(project) {
        const projectData = {
            title: project.querySelector('h3').textContent,
            description: project.dataset.description,
            image: project.querySelector('img').src
        };

        const modalHTML = `
            <img src="${projectData.image}" alt="${projectData.title}">
            <h2>${projectData.title}</h2>
            <p>${projectData.description}</p>
        `;

        this.modalContent.innerHTML = modalHTML;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Text Animations
class TextAnimations {
    constructor() {
        this.headlines = document.querySelectorAll('.split-text');
        this.init();
    }

    init() {
        this.headlines.forEach(headline => {
            const split = new SplitText(headline, {
                type: 'lines,words,chars',
                linesClass: 'split-line'
            });

            gsap.from(split.chars, {
                duration: 0.8,
                y: 100,
                opacity: 0,
                stagger: 0.02,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: headline,
                    start: 'top 80%'
                }
            });
        });
    }
}

// Continuing MagneticButtons class...
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic');
        this.boundingBox = {
            width: 0,
            height: 0,
            left: 0,
            top: 0
        };
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => this.enter(button));
            button.addEventListener('mousemove', (e) => this.move(e, button));
            button.addEventListener('mouseleave', () => this.leave(button));
        });
    }

    enter(button) {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.4,
            ease: 'power4.out'
        });

        this.updateBoundingBox(button);
    }

    move(e, button) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const centerX = this.boundingBox.left + this.boundingBox.width / 2;
        const centerY = this.boundingBox.top + this.boundingBox.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const maxDistance = Math.max(this.boundingBox.width, this.boundingBox.height);
        const magnetStrength = Math.min(distance / maxDistance, 1);

        gsap.to(button, {
            x: deltaX * 0.3 * magnetStrength,
            y: deltaY * 0.3 * magnetStrength,
            rotation: deltaX * 0.05 * magnetStrength,
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    leave(button) {
        gsap.to(button, {
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)'
        });
    }

    updateBoundingBox(button) {
        const rect = button.getBoundingClientRect();
        this.boundingBox = {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top
        };
    }
}

// Discord Integration
class DiscordIntegration {
    constructor() {
        this.copyButton = document.querySelector('.copy-button');
        this.discordTag = document.querySelector('.discord-tag');
        this.successAnimation = document.querySelector('.success-animation');
        this.init();
    }

    init() {
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.discordTag.textContent);
            this.showSuccessAnimation();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    showSuccessAnimation() {
        const tl = gsap.timeline();

        tl.to(this.successAnimation, {
            scaleX: 1,
            duration: 0.3,
            ease: 'power2.out'
        })
        .to(this.copyButton.querySelector('span'), {
            opacity: 0,
            duration: 0.2
        }, 0)
        .to(this.successAnimation, {
            scaleX: 0,
            duration: 0.3,
            ease: 'power2.in',
            delay: 1
        })
        .to(this.copyButton.querySelector('span'), {
            opacity: 1,
            duration: 0.2
        });
    }
}

// Parallax Effects
class ParallaxManager {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const speed = element.dataset.parallax || 0.1;
            
            gsap.to(element, {
                y: () => (element.offsetHeight * speed),
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
}

// Scroll Animations Manager
class ScrollAnimationsManager {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        this.sections.forEach(section => {
            this.createScrollTrigger(section);
        });
    }

    createScrollTrigger(section) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
                markers: false // Set to true for debugging
            }
        });

        // Add animations based on section type
        if (section.classList.contains('hero-section')) {
            this.animateHeroSection(tl, section);
        } else if (section.classList.contains('project-section')) {
            this.animateProjectSection(tl, section);
        }
        // Add more section-specific animations
    }

    animateHeroSection(timeline, section) {
        timeline
            .from(section.querySelector('.hero-content'), {
                y: 100,
                opacity: 0
            })
            .from(section.querySelector('.circle'), {
                scale: 0.5,
                opacity: 0
            }, '-=0.5');
    }

    animateProjectSection(timeline, section) {
        const projects = section.querySelectorAll('.project-item');
        
        projects.forEach((project, index) => {
            timeline.from(project, {
                y: 50,
                opacity: 0,
                delay: index * 0.1
            });
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frames = [];
        this.lastFrameTimeStamp = performance.now();
    }

    init() {
        this.animate();
    }

    animate() {
        const now = performance.now();
        this.frames.push(now - this.lastFrameTimeStamp);
        
        if (this.frames.length > 60) {
            this.frames.shift();
        }
        
        this.lastFrameTimeStamp = now;
        this.fps = Math.round(1000 / (this.frames.reduce((a, b) => a + b) / this.frames.length));

        if (this.fps < 30) {
            console.warn('Low FPS detected:', this.fps);
            this.optimizePerformance();
        }

        requestAnimationFrame(() => this.animate());
    }

    optimizePerformance() {
        // Reduce animation complexity
        document.body.classList.add('reduce-motion');
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.header = document.querySelector('.main-nav');
        this.hamburger = document.querySelector('.hamburger');
        this.navOverlay = document.querySelector('.nav-overlay');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.handleScroll();
        this.bindNavLinks();
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        const tl = gsap.timeline();

        if (this.isOpen) {
            tl.to(this.navOverlay, {
                visibility: 'visible',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            })
            .to('.nav-links a', {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.3');
        } else {
            tl.to('.nav-links a', {
                y: 100,
                opacity: 0,
                stagger: 0.05,
                duration: 0.3,
                ease: 'power2.in'
            })
            .to(this.navOverlay, {
                visibility: 'hidden',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });
        }
    }

// Continuing NavigationManager class...

    handleScroll() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                this.header.classList.add('nav-hidden');
            } else {
                this.header.classList.remove('nav-hidden');
            }
            
            lastScroll = currentScroll;

            // Add solid background after certain scroll
            if (currentScroll > 50) {
                this.header.classList.add('nav-scrolled');
            } else {
                this.header.classList.remove('nav-scrolled');
            }
        });
    }

    bindNavLinks() {
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (this.isOpen) {
                    this.toggleMenu();
                }

                this.smoothScroll(target);
            });
        });
    }

    smoothScroll(target) {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: target,
                autoKill: false
            },
            ease: 'power3.inOut'
        });
    }
}

// Image Lazy Loading
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(image => observer.observe(image));
    }

    loadImage(image) {
        const src = image.getAttribute('data-src');
        
        image.onload = () => {
            image.classList.add('loaded');
            image.removeAttribute('data-src');
        };

        image.src = src;
    }

    loadAllImages() {
        this.images.forEach(image => this.loadImage(image));
    }
}

// Audio Manager for Hover Sounds
class AudioManager {
    constructor() {
        this.sounds = {
            hover: new Audio('assets/hover.mp3'),
            click: new Audio('assets/click.mp3')
        };
        this.init();
    }

    init() {
        // Preload sounds
        Object.values(this.sounds).forEach(sound => {
            sound.load();
            sound.volume = 0.2;
        });

        this.bindHoverSounds();
        this.bindClickSounds();
    }

    bindHoverSounds() {
        const hoverElements = document.querySelectorAll('[data-sound="hover"]');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });
    }

    bindClickSounds() {
        const clickElements = document.querySelectorAll('[data-sound="click"]');
        
        clickElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playSound('click');
            });
        });
    }

    playSound(soundName) {
        const sound = this.sounds[soundName];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Initialize Everything
class App {
    constructor() {
        this.init();
    }

    async init() {
        // Create instances of all managers
        this.loading = new LoadingAnimation();
        await this.loading.playLoadingAnimation();

        // Initialize core functionality
        this.cursor = new CustomCursor();
        this.scroll = new SmoothScroll();
        this.nav = new NavigationManager();
        
        // Initialize visual effects
        this.parallax = new ParallaxManager();
        this.mouseTrail = new MouseTrailEffect();
        this.textAnimations = new TextAnimations();
        
        // Initialize interaction handlers
        this.portfolio = new PortfolioGrid();
        this.discord = new DiscordIntegration();
        this.magnetic = new MagneticButtons();
        
        // Initialize performance monitoring
        if (process.env.NODE_ENV === 'development') {
            this.performance = new PerformanceMonitor();
        }

        // Add resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        // Update all necessary components on resize
        this.scroll.resize();
        // Add other resize handlers as needed
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    const spinner = document.querySelector('.loading-spinner');

    const tl = gsap.timeline({
        onComplete: () => {
            setTimeout(() => {
                // Stop spinner animation
                spinner.style.animation = "none";
                
                // Hide loader
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => loader.style.display = "none"
                });
            }, 500);
        }
    });

    // Loader Animation
    tl.to(loaderText, { opacity: 1, duration: 1, ease: "power3.out" });
});
