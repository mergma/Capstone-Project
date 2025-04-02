document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel immediately
    initializeCarousel();

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Start button
    document.querySelector('.start-button').addEventListener('click', () => {
        alert('Starting the AI-Powered MBTI Test...');
    });
});

function initializeCarousel() {
    const features = document.querySelector('.features');
    const cards = document.querySelectorAll('.feature-card');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    let currentCardIndex = 0;
    let isTransitioning = false;

    // Only initialize if we have the necessary elements
    if (!features || !leftArrow || !rightArrow || cards.length === 0) return;

    function updateCarousel() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Update transform for sliding
        const offset = -currentCardIndex * 100;
        features.style.transform = `translateX(${offset}%)`;

        // Update active states
        cards.forEach((card, index) => {
            if (index === currentCardIndex) {
                card.classList.add('active');
                card.style.opacity = '1';
            } else {
                card.classList.remove('active');
                card.style.opacity = '0.5';
            }
        });

        // Update arrow states
        leftArrow.style.opacity = currentCardIndex === 0 ? '0.5' : '1';
        rightArrow.style.opacity = currentCardIndex === cards.length - 1 ? '0.5' : '1';
        leftArrow.style.pointerEvents = currentCardIndex === 0 ? 'none' : 'auto';
        rightArrow.style.pointerEvents = currentCardIndex === cards.length - 1 ? 'none' : 'auto';

        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }

    // Arrow click handlers
    leftArrow.addEventListener('click', function() {
        if (!isTransitioning && currentCardIndex > 0) {
            currentCardIndex--;
            updateCarousel();
        }
    });

    rightArrow.addEventListener('click', function() {
        if (!isTransitioning && currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateCarousel();
        }
    });

    // Touch handling
    let touchStartX = 0;
    let touchStartY = 0;

    features.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    features.addEventListener('touchend', function(e) {
        if (isTransitioning) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = Math.abs(touchEndY - touchStartY);

        // Only handle horizontal swipes
        if (deltaY < 50 && Math.abs(deltaX) > 50) {
            if (deltaX > 0 && currentCardIndex > 0) {
                // Swipe right
                currentCardIndex--;
                updateCarousel();
            } else if (deltaX < 0 && currentCardIndex < cards.length - 1) {
                // Swipe left
                currentCardIndex++;
                updateCarousel();
            }
        }
    }, { passive: true });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                // Reset for desktop view
                features.style.transform = '';
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
                cards.forEach(card => {
                    card.classList.remove('active');
                    card.style.opacity = '1';
                });
            } else {
                // Reset for mobile view
                leftArrow.style.display = 'block';
                rightArrow.style.display = 'block';
                updateCarousel();
            }
        }, 250);
    });

    // Initial setup
    if (window.innerWidth <= 768) {
        updateCarousel();
    } else {
        cards.forEach(card => card.style.opacity = '1');
    }
}
