/**
 * Initialize scroll animations on page load
 * Imported in layout to enable Motion-based scroll triggers globally
 */

import { setupScrollAnimations } from '../lib/scroll-animations';

// Initialize scroll animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations({
      duration: 0.6,
      delay: 0,
      threshold: 0.2,
    });
  });
} else {
  // DOM is already loaded
  setupScrollAnimations({
    duration: 0.6,
    delay: 0,
    threshold: 0.2,
  });
}
