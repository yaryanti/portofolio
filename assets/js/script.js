// ===== MOBILE MENU TOGGLE =====
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

// ===== DROPDOWN MENU FOR MOBILE =====
const dropdownLinks = document.querySelectorAll('.dropdown > .navbar-link');

dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = link.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// ===== ACCORDION FUNCTIONALITY =====
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const accordionContent = accordionItem.querySelector('.accordion-content');
        const accordionBody = accordionItem.querySelector('.accordion-body');

        // Toggle active class
        accordionItem.classList.toggle('active');

        // Toggle accordion content
        if (accordionItem.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionBody.scrollHeight + 'px';
        } else {
            accordionContent.style.maxHeight = '0';
        }

        // Close other accordions (optional - remove if you want multiple open)
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                const otherItem = otherHeader.parentElement;
                const otherContent = otherItem.querySelector('.accordion-content');
                otherItem.classList.remove('active');
                otherContent.style.maxHeight = '0';
            }
        });
    });
});

// ===== TYPING EFFECT FOR NAME (LOOPING) =====
function typingEffectLoop(element, text, typeSpeed = 80, deleteSpeed = 50, pauseTime = 2000) {
    let index = 0;
    let isDeleting = false;
    element.textContent = '';
    element.classList.add('typing-effect');

    function type() {
        const currentText = text.substring(0, index);
        element.textContent = currentText;

        if (!isDeleting && index < text.length) {
            // Typing phase
            index++;
            setTimeout(type, typeSpeed);
        } else if (!isDeleting && index === text.length) {
            // Pause before deleting
            setTimeout(() => {
                isDeleting = true;
                type();
            }, pauseTime);
        } else if (isDeleting && index > 0) {
            // Deleting phase
            index--;
            setTimeout(type, deleteSpeed);
        } else if (isDeleting && index === 0) {
            // Pause before typing again
            isDeleting = false;
            setTimeout(type, 500);
        }
    }

    type();
}

// Initialize typing effect on profile pages
window.addEventListener('DOMContentLoaded', () => {
    const profileName = document.querySelector('.profile-name');
    
    if (profileName && profileName.dataset.name) {
        const fullName = profileName.dataset.name;
        typingEffectLoop(profileName, fullName, 100, 50, 2500);
    }
});

// ===== SMOOTH SCROLL =====
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

// ===== CLOSE MOBILE MENU WHEN CLICKING OUTSIDE =====
document.addEventListener('click', (e) => {
    if (navbarMenu && navbarToggle) {
        if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
            navbarMenu.classList.remove('active');
        }
    }
});

// ===== LAZY LOADING FOR IMAGES =====
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== IMAGE SLIDER FUNCTIONALITY =====
class ImageSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.container = sliderElement.querySelector('.slider-container');
        this.images = sliderElement.querySelectorAll('.slider-image');
        this.prevBtn = sliderElement.querySelector('.slider-btn.prev');
        this.nextBtn = sliderElement.querySelector('.slider-btn.next');
        this.dotsContainer = sliderElement.querySelector('.slider-dots');
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Create dots
        this.images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Auto slide
        this.startAutoSlide();
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    updateSlider() {
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 3000);
    }
    
    stopAutoSlide() {
        clearInterval(this.autoSlideInterval);
    }
}

// Initialize all sliders
window.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.image-slider');
    sliders.forEach(slider => new ImageSlider(slider));
});

// ===== ANIMATION ON SCROLL =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .accordion-item, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'all 0.6s ease-in-out';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
};

// Initialize animations when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}
