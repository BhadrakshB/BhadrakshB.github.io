
document.addEventListener('DOMContentLoaded', () => {
    const marqueeContent = document.querySelector('.flex.w-max.animate-scroll');
    if (marqueeContent) {
        const items = Array.from(marqueeContent.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }
});
