/**
 * Simple animation utility using Intersection Observer
 * Automatically applies animations when elements enter the viewport
 */

document.addEventListener('DOMContentLoaded', () => {
  // Find all elements with animation classes
  const animatedElements = document.querySelectorAll('.animate');
  
  // Set up the Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class to trigger the animation
          entry.target.classList.add('visible');
          
          // Unobserve after animation has been triggered
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });
    
    // Observe all elements with animation classes
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}); 