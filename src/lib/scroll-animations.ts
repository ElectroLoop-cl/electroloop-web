import { animate, stagger } from "motion";

interface ScrollAnimationOptions {
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  threshold?: number;
}

/**
 * Animates elements when they come into view (scroll trigger)
 * Uses Motion library for smooth animations
 */
export function setupScrollAnimations(options: ScrollAnimationOptions = {}) {
  const {
    duration = 0.6,
    delay = 0,
    staggerDelay = 0.1,
    threshold = 0.2,
  } = options;

  // Find all elements with data-scroll-animate attribute
  const elements = document.querySelectorAll("[data-scroll-animate]");

  console.log('🎬 Setting up scroll animations for', elements.length, 'elements');

  if (!elements.length) {
    console.warn('⚠️ No elements with data-scroll-animate found');
    return;
  }

  // Set initial state for all elements (invisible before animation)
  elements.forEach((el) => {
    const element = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
  });

  // Create Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animationType = element.dataset.scrollAnimate || "fade-up";
          console.log('🎨 Triggering animation:', animationType, 'on element:', element);

          // Determine animation based on data attribute
          switch (animationType) {
            case "fade-up":
              animateFadeUp(element, duration, delay);
              break;
            case "fade-in":
              animateFadeIn(element, duration, delay);
              break;
            case "scale":
              animateScale(element, duration, delay);
              break;
            case "slide-left":
              animateSlideLeft(element, duration, delay);
              break;
            case "slide-right":
              animateSlideRight(element, duration, delay);
              break;
            default:
              animateFadeUp(element, duration, delay);
          }

          // Unobserve after animation to prevent re-triggering
          observer.unobserve(element);
        }
      });
    },
    { threshold }
  );

  // Observe all elements
  elements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Fade + Slide Up animation
 */
function animateFadeUp(element: HTMLElement, duration: number, delay: number) {
  console.log('⬆️ animateFadeUp called with duration:', duration, 'delay:', delay);
  try {
    animate(
      element,
      {
        opacity: [0, 1],
        transform: ["translateY(30px)", "translateY(0)"],
      },
      {
        duration,
        delay,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like easing
      }
    );
    console.log('✅ animate() executed successfully');
  } catch (err) {
    console.error('❌ Error in animate():', err);
  }
}

/**
 * Fade In animation
 */
function animateFadeIn(element: HTMLElement, duration: number, delay: number) {
  animate(
    element,
    {
      opacity: [0, 1],
    },
    {
      duration,
      delay,
      easing: "ease-out",
    }
  );
}

/**
 * Scale animation (grow from center)
 */
function animateScale(element: HTMLElement, duration: number, delay: number) {
  animate(
    element,
    {
      opacity: [0, 1],
      transform: ["scale(0.9)", "scale(1)"],
    },
    {
      duration,
      delay,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  );
}

/**
 * Slide from left animation
 */
function animateSlideLeft(
  element: HTMLElement,
  duration: number,
  delay: number
) {
  animate(
    element,
    {
      opacity: [0, 1],
      transform: ["translateX(-40px)", "translateX(0)"],
    },
    {
      duration,
      delay,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  );
}

/**
 * Slide from right animation
 */
function animateSlideRight(
  element: HTMLElement,
  duration: number,
  delay: number
) {
  animate(
    element,
    {
      opacity: [0, 1],
      transform: ["translateX(40px)", "translateX(0)"],
    },
    {
      duration,
      delay,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  );
}

/**
 * Stagger multiple elements
 */
export function setupStaggeredScrollAnimations(
  containerSelector: string,
  childSelector: string,
  options: ScrollAnimationOptions = {}
) {
  const {
    duration = 0.6,
    staggerDelay = 0.1,
    threshold = 0.2,
  } = options;

  const containers = document.querySelectorAll(containerSelector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const children = container.querySelectorAll(childSelector);

          // Animate children with stagger
          children.forEach((child, index) => {
            const element = child as HTMLElement;
            animate(
              element,
              {
                opacity: [0, 1],
                transform: ["translateY(30px)", "translateY(0)"],
              },
              {
                duration,
                delay: index * staggerDelay,
                easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }
            );
          });

          observer.unobserve(container);
        }
      });
    },
    { threshold }
  );

  containers.forEach((container) => {
    observer.observe(container);
  });
}
