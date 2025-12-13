document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuButton = document.querySelector('button[aria-label="Toggle mobile menu"]');
    // Correctly select the mobile navigation menu
    const mobileNav = document.querySelector('nav.md\\:hidden');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            // The mobile nav has the `hidden` class by default. Remove it to show.
            mobileNav.classList.toggle('hidden');
        });
    }

    // Carousel functionality
    const workSection = document.getElementById('work');
    if (workSection) {
        const scrollContainer = workSection.querySelector('.no-scrollbar');
        const scrollLeftButton = workSection.querySelector('button[aria-label="Scroll Left"]');
        const scrollRightButton = workSection.querySelector('button[aria-label="Scroll Right"]');

        if (scrollContainer && scrollLeftButton && scrollRightButton) {
            scrollLeftButton.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });

            scrollRightButton.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Marquee / skills-slider functionality
    const skillsSlider = document.querySelector('.animate-marquee');
    if (skillsSlider) {
        // Select all direct child elements of the marquee container
        const skills = skillsSlider.querySelectorAll(':scope > div');
        skills.forEach(skill => {
            const clone = skill.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            skillsSlider.appendChild(clone);
        });
    }
});