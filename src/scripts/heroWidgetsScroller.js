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
    
    // Check if we're using scroll jacking (with ScrollJack component)
    const isUsingScrollJack = heroSectionElement.querySelector('.scroll-jack') !== null;
    
    if (!isUsingScrollJack) {
      // Original scroll-based animation control (use only if not using ScrollJack)
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        const heroSectionTop = heroSectionElement.offsetTop;
        const heroScrollableDistance = heroSectionElement.offsetHeight - viewportHeight;
  
        if (heroScrollableDistance <= 0) {
          const progressAtTop = Math.min(1, Math.max(0, scrollTop / viewportHeight));
          const fallbackFrame = progressAtTop * animation.totalFrames;
          animation.goToAndStop(fallbackFrame, true);
          // console.log('Hero Scroll Fallback:', { scrollTop, progressAtTop, fallbackFrame });
          return;
        }
        
        const scrollRelativeToHeroStart = Math.max(0, scrollTop - heroSectionTop);
        let scrollPercent = Math.min(1, scrollRelativeToHeroStart / heroScrollableDistance);
        
        const frame = scrollPercent * animation.totalFrames;
        animation.goToAndStop(frame, true);
        // Add console log for debugging scroll jacking
        console.log('Hero Scroll Jacking:', {
          scrollTop,
          heroSectionTop,
          heroOffsetHeight: heroSectionElement.offsetHeight,
          heroScrollableDistance,
          scrollRelativeToHeroStart,
          scrollPercent,
          frame,
          totalFrames: animation.totalFrames
        });
      });
    }
  });

  return animation;
} 