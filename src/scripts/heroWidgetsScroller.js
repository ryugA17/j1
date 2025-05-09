import lottie from 'lottie-web';

export function initHeroWidgetsAnimation(targetElementId) {
  const container = document.getElementById(targetElementId);
  if (!container) {
    console.error(`Lottie target element with ID '${targetElementId}' not found.`);
    return null;
  }

  const animation = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/animations/widgets.json',
  });

  animation.addEventListener('DOMLoaded', () => {
    const svgElement = container.querySelector('svg');
    if (svgElement) {
      svgElement.style.width = '100%';
      svgElement.style.height = '100%';
      svgElement.style.objectFit = 'contain';
    }

    const heroSectionElement = document.getElementById('hero-section'); 
    if (!heroSectionElement) {
      console.error('Scroll jacking parent (#hero-section) not found.');
      return;
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      
      const heroSectionTop = heroSectionElement.offsetTop;
      // The duration of scroll over which the animation should play is the total height of hero-section
      // minus one viewportHeight (which is the height of the pinned content area).
      const heroScrollableDistance = heroSectionElement.offsetHeight - viewportHeight;

      if (heroScrollableDistance <= 0) {
        // Fallback if hero-section is not taller than viewport (no scroll jacking possible)
        const progressAtTop = Math.min(1, Math.max(0, scrollTop / viewportHeight));
        animation.goToAndStop(progressAtTop * animation.totalFrames, true);
        return;
      }
      
      // Calculate scroll progress specifically within the hero-section's scrollable range
      const scrollRelativeToHeroStart = Math.max(0, scrollTop - heroSectionTop);
      let scrollPercent = Math.min(1, scrollRelativeToHeroStart / heroScrollableDistance);
      
      const frame = scrollPercent * animation.totalFrames;
      animation.goToAndStop(frame, true);
    });
  });

  return animation;
} 