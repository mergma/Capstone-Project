document.addEventListener('DOMContentLoaded', function() {
    // Tombol "Take a Test"
    document.querySelector('.start-button').addEventListener('click', () => {
        alert('Starting the AI-Powered MBTI Test...');
    });

    // Initialize carousel on mobile devices
    if (window.innerWidth <= 767) {
        initializeCarousel();
    }

    // Reinitialize carousel on resize (e.g., orientation change)
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 767) {
            initializeCarousel();
        } else {
            // Reset transform on desktop
            const features = document.querySelector('.features');
            if (features) {
                features.style.transform = 'translateX(0)';
            }
        }
    });
});

function initializeCarousel() {
    const features = document.querySelector('.features');
    const cards = document.querySelectorAll('.feature-card');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');

    // If there are no cards or arrows, exit
    if (cards.length === 0 || !leftArrow || !rightArrow || !features) return;

    let currentCardIndex = 0;

    // Function to update carousel position
    function updateCarousel() {
        // Each card takes 85% width + 7.5% margin on each side = 100% total width per card
        const offset = -currentCardIndex * 100; // Move by 100% of the container width
        features.style.transform = `translateX(${offset}%)`;
    }

    // Arrow click handlers
    leftArrow.addEventListener('click', function() {
        if (currentCardIndex > 0) {
            currentCardIndex--;
        } else {
            currentCardIndex = cards.length - 1; // Loop to the last card
        }
        updateCarousel();
    });

    rightArrow.addEventListener('click', function() {
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
        } else {
            currentCardIndex = 0; // Loop to the first card
        }
        updateCarousel();
    });

    // Add touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    features.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    features.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left, show next card
            rightArrow.click();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right, show previous card
            leftArrow.click();
        }
    }

    // Initial update
    updateCarousel();
}
