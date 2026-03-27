/**
* Template Name: Folio
* Updated: Dec 10 2023 with Modern UI Enhancements
* Template URL: https://bootstrapmade.com/folio-bootstrap-portfolio-template/
* Author: BootstrapMade.com
* Enhanced by: Your Name
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  // Add Animate.css for animations
  const animateCSS = (element, animation, prefix = 'animate__') => {
    return new Promise((resolve) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);

      node.classList.add(`${prefix}animated`, animationName);

      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });
  };

  // Typed.js initialization for hero section
  const initTyped = () => {
    if (document.querySelector('.typed')) {
      const typedStrings = document.querySelector('.typed').getAttribute('data-typed-items');
      if (typedStrings) {
        new Typed('.typed', {
          strings: JSON.parse('["' + typedStrings.split(',').join('","') + '"]'),
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  };

  /**
   * Easy selector helper function with improved performance
   */
  const select = (el, all = false, parent = document) => {
    // Handle null/undefined input
    if (!el) return null;
    
    // If element is already a DOM element or NodeList, return as is
    if (typeof el !== 'string') {
      return all ? (Array.isArray(el) ? el : [...el]) : el;
    }
    
    // Trim and handle empty string case
    el = el.trim();
    if (!el) return all ? [] : null;
    
    try {
      return all ? [...parent.querySelectorAll(el)] : parent.querySelector(el);
    } catch (error) {
      console.error('Invalid selector:', el, error);
      return all ? [] : null;
    }
  };

  /**
   * Enhanced event listener with better performance and options support
   */
  const on = (type, el, listener, options = {}) => {
    const elements = select(el, true);
    if (!elements || elements.length === 0) return;

    const handler = (e) => {
      if (typeof listener === 'function') {
        listener.call(e.target, e);
      }
    };

    if (Array.isArray(elements)) {
      elements.forEach(element => {
        element.addEventListener(type, handler, options);
      });
    } else {
      elements.addEventListener(type, handler, options);
    }

    // Return a function to remove the event listener
    return () => {
      if (Array.isArray(elements)) {
        elements.forEach(element => {
          element.removeEventListener(type, handler, options);
        });
      } else {
        elements.removeEventListener(type, handler, options);
      }
    };
  };

  /**
   * Enhanced scroll event listener with throttling for performance
   */
  const onscroll = (el, listener, throttleDelay = 100) => {
    if (!el) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    const throttledListener = (e) => {
      lastScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (typeof listener === 'function') {
            listener({
              scrollTop: lastScrollTop,
              direction: lastScrollTop > (this.lastScrollTop || 0) ? 'down' : 'up',
              event: e
            });
          }
          ticking = false;
          this.lastScrollTop = lastScrollTop <= 0 ? 0 : lastScrollTop;
        });
        ticking = true;
      }
    };
    
    el.addEventListener('scroll', throttledListener, { passive: true });
    
    // Return cleanup function
    return () => {
      el.removeEventListener('scroll', throttledListener, { passive: true });
    };
  };

  /**
   * Enhanced navbar links active state on scroll with intersection observer
   */
  const initNavbarLinks = () => {
    const navbarlinks = select('#navbar .nav-link', true);
    if (!navbarlinks.length) return;

    // Add smooth scrolling to all links
    navbarlinks.forEach(link => {
      if (link.hash) {
        on('click', link, (e) => {
          e.preventDefault();
          const target = select(link.hash);
          if (target) {
            // Close mobile menu if open
            const navbar = select('#navbar');
            if (navbar.classList.contains('navbar-mobile')) {
              navbar.classList.remove('navbar-mobile');
              const navbarToggle = select('.mobile-nav-toggle');
              if (navbarToggle) {
                navbarToggle.classList.toggle('bi-list');
                navbarToggle.classList.toggle('bi-x');
              }
            }
            
            // Scroll to section
            scrollto(link.hash);
          }
        });
      }
    });

    // Set up intersection observer for section highlighting
    const sections = [];
    navbarlinks.forEach(link => {
      if (link.hash) {
        const section = select(link.hash);
        if (section) {
          sections.push({
            element: section,
            link: link,
            top: section.offsetTop,
            height: section.offsetHeight
          });
        }
      }
    });

    if (sections.length > 0) {
      const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(({ element, link, top, height }) => {
          if (scrollPosition >= top && scrollPosition <= top + height) {
            // Remove active class from all links
            navbarlinks.forEach(navLink => navLink.classList.remove('active'));
            // Add active class to current link
            link.classList.add('active');
          }
        });
      };

      // Initial update
      updateActiveLink();
      
      // Update on scroll
      window.addEventListener('scroll', updateActiveLink, { passive: true });
    }
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Enhanced header scroll effect with requestAnimationFrame for performance
   */
  const initHeaderScroll = () => {
    const header = select('#header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    const updateHeader = () => {
      const currentScroll = window.scrollY;
      
      // Add/remove header-scrolled class based on scroll position
      if (currentScroll > 100) {
        header.classList.add('header-scrolled');
        
        // Optional: Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 200) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      } else {
        header.classList.remove('header-scrolled');
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
      ticking = false;
    };
    
    // Throttle scroll events
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    
    // Initial check
    updateHeader();
  };

  /**
   * Enhanced back to top button with smooth scroll and fade effects
   */
  const initBackToTop = () => {
    const backToTop = select('.back-to-top');
    if (!backToTop) return;
    
    // Create back to top button if it doesn't exist
    if (!backToTop) {
      const backToTopBtn = document.createElement('a');
      backToTopBtn.href = '#';
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      document.body.appendChild(backToTopBtn);
    }
    
    // Toggle back to top button visibility
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    };
    
    // Smooth scroll to top
    on('click', backToTop, (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Initial check
    toggleBackToTop();
    
    // Update on scroll
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
  };

  /**
   * Enhanced mobile navigation with improved accessibility
   */
  const initMobileNav = () => {
    const mobileNavToggle = select('.mobile-nav-toggle');
    if (!mobileNavToggle) return;
    
    const navbar = select('#navbar');
    const navbarToggles = [].slice.call(document.querySelectorAll('.mobile-nav-toggle'));
    
    // Toggle mobile navigation
    const toggleNav = (e) => {
      if (e) e.preventDefault();
      
      // Toggle mobile nav classes
      navbar.classList.toggle('navbar-mobile');
      
      // Toggle menu icon
      navbarToggles.forEach(toggle => {
        toggle.classList.toggle('bi-list');
        toggle.classList.toggle('bi-x');
      });
      
      // Toggle body scroll
      document.body.classList.toggle('mobile-nav-active');
      
      // Focus management for accessibility
      const isOpen = navbar.classList.contains('navbar-mobile');
      if (isOpen) {
        // Focus first focusable element in the nav
        const firstNavItem = navbar.querySelector('a, button, [tabindex="0"]');
        if (firstNavItem) firstNavItem.focus();
        
        // Trap focus inside the mobile menu
        trapFocus(navbar);
      } else {
        // Return focus to the toggle button
        mobileNavToggle.focus();
      }
    };
    
    // Add click event to mobile nav toggle
    on('click', '.mobile-nav-toggle', toggleNav);
    
    // Close mobile menu when clicking on a nav link
    on('click', '#navbar .nav-link', () => {
      if (navbar.classList.contains('navbar-mobile')) {
        toggleNav();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('navbar-mobile')) {
        toggleNav();
      }
    });
  };
  
  /**
   * Trap focus inside an element for accessibility
   */
  const trapFocus = (element) => {
    if (!element) return;
    
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];
    
    // Focus first element
    if (firstFocusableElement) firstFocusableElement.focus();
    
    // Handle tab key
    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    });
  };

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Enhanced smooth scrolling with offset for fixed header
   */
  const initSmoothScroll = () => {
    // Handle all anchor links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Skip if it's not a link to the same page
      if (anchor.getAttribute('href') === '#' || 
          anchor.getAttribute('href') === '' || 
          anchor.getAttribute('href').startsWith('#')) {
        
        on('click', anchor, (e) => {
          const targetId = anchor.getAttribute('href');
          
          // Skip if no target ID
          if (!targetId || targetId === '#') return;
          
          const targetElement = select(targetId);
          if (!targetElement) return;
          
          e.preventDefault();
          
          // Close mobile menu if open
          const navbar = select('#navbar');
          if (navbar && navbar.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile');
            const navbarToggle = select('.mobile-nav-toggle');
            if (navbarToggle) {
              navbarToggle.classList.toggle('bi-list');
              navbarToggle.classList.toggle('bi-x');
            }
          }
          
          // Calculate scroll position with offset
          const header = select('#header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;
          
          // Smooth scroll to target
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            window.location.hash = targetId;
          }
        });
      }
    });
    
    // Handle scroll to top for empty hashes
    on('click', 'a[href="#"]', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Update URL
      if (history.pushState) {
        history.pushState(null, null, ' ');
      } else {
        window.location.hash = '';
      }
    });
  };

  /**
   * Enhanced testimonials slider with better responsiveness
   */
  const initTestimonialsSlider = () => {
    const testimonialsSlider = select('.testimonials-slider');
    if (!testimonialsSlider) return;
    
    return new Swiper(testimonialsSlider, {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: true,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
          }
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 40,
        }
      },
      on: {
        init: function() {
          // Add animation classes to active slide
          this.slides[this.activeIndex].classList.add('swiper-slide-active-animate');
        },
        slideChangeTransitionStart: function() {
          // Remove animation classes from all slides
          this.slides.forEach(slide => {
            slide.classList.remove('swiper-slide-active-animate');
          });
          // Add animation class to active slide
          this.slides[this.activeIndex].classList.add('swiper-slide-active-animate');
        }
      }
    });
  };

  /**
   * Enhanced Pure Counter with Intersection Observer
   */
  const initPureCounter = () => {
    // Check if PureCounter is available
    if (typeof PureCounter !== 'undefined') {
      new PureCounter({
        // Options can be customized here
        selector: '.purecounter',
        start: 0,                       // Starting number
        end: 0,                         // End number (will be overridden by data-purecounter-end)
        duration: 2,                    // Duration in seconds
        delay: 10,                      // Delay between each number's increment
        once: true,                     // Count only once
        pulse: true,                    // Pulse effect
        decimals: 0,                    // Number of decimal places
        legacy: false,                  // If true, uses this scroller's setup, and if !window.IntersectionObserver
        filesizing: false,              // This will enable file size formatting
        currency: false,                // This will enable currency formatting
        formater: function (value, counter) {
          // Custom formatter function
          return value.toLocaleString();
        },
        // You can also add a callback when counting is complete
        onCount: function(instance) {
          console.log('Counting complete!', instance);
        }
      });
    } else {
      // Fallback for when PureCounter is not available
      const counters = select('.purecounter', true);
      
      if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target;
              const end = parseInt(target.getAttribute('data-purecounter-end') || '0');
              const duration = parseInt(target.getAttribute('data-purecounter-duration') || '2000');
              const start = parseInt(target.getAttribute('data-purecounter-start') || '0');
              const step = (end - start) / (duration / 16); // 60fps
              
              let current = start;
              const updateCounter = () => {
                current += step;
                if (current >= end) {
                  current = end;
                  target.textContent = current.toLocaleString();
                } else {
                  target.textContent = Math.floor(current).toLocaleString();
                  requestAnimationFrame(updateCounter);
                }
              };
              
              updateCounter();
              observer.unobserve(target);
            }
          });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
          observer.observe(counter);
        });
      }
    }
  };

  /**
   * Enhanced GLightbox with custom settings
   */
  const initGLightbox = () => {
    // Check if GLightbox is available
    if (typeof GLightbox === 'undefined') return;
    
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      plyr: {
        config: {
          ratio: '16:9',
          fullscreen: { enabled: true, fallback: true, iosNative: true },
          youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3 },
          vimeo: { byline: false, portrait: false, title: false },
          previewThumbnails: { enabled: true, src: '' },
        }
      },
      onOpen: () => {
        // Pause all videos when lightbox opens
        document.querySelectorAll('video').forEach(video => video.pause());
      },
      onSlideAfterLoad: (slide) => {
        // Add custom class to the current slide
        const slides = document.querySelectorAll('.gslide');
        slides.forEach(s => s.classList.remove('active'));
        slide.classList.add('active');
        
        // Lazy load images in lightbox
        const img = slide.querySelector('img[data-src]');
        if (img) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      },
      onClose: () => {
        // Cleanup when lightbox is closed
        document.querySelectorAll('.gslide').forEach(slide => {
          slide.classList.remove('active');
        });
      }
    });
    
    // Add custom navigation buttons
    lightbox.on('slide_after_load', () => {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'gprev';
      prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
      prevBtn.onclick = () => lightbox.prev();
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'gnext';
      nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
      nextBtn.onclick = () => lightbox.next();
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'gclose';
      closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
      closeBtn.onclick = () => lightbox.close();
      
      const controls = document.createElement('div');
      controls.className = 'glightbox-controls';
      controls.appendChild(prevBtn);
      controls.appendChild(nextBtn);
      controls.appendChild(closeBtn);
      
      const container = document.querySelector('.gcontainer');
      if (container && !document.querySelector('.glightbox-controls')) {
        container.appendChild(controls);
      }
    });
    
    return lightbox;
  };

  /**
   * Enhanced portfolio details slider with lightbox
   */
  const initPortfolioSlider = () => {
    const portfolioSliders = select('.portfolio-details-slider', true);
    if (!portfolioSliders || portfolioSliders.length === 0) return;
    
    portfolioSliders.forEach(slider => {
      const swiper = new Swiper(slider, {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        // Enable lazy loading
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true,
        },
        // Enable parallax
        parallax: true,
        // Enable mousewheel control
        mousewheel: {
          invert: false,
          sensitivity: 1,
          releaseOnEdges: true,
        },
        // Enable hash navigation
        hashNavigation: {
          watchState: true,
        },
        // Enable auto height
        autoHeight: true,
        // Enable breakpoints
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30
          },
          1200: {
            slidesPerView: 1,
            spaceBetween: 40
          }
        },
        // Callbacks
        on: {
          init: function() {
            // Initialize lightbox for each slide
            this.slides.forEach((slide, index) => {
              const img = slide.querySelector('img');
              if (img) {
                // Add zoomable class for lightbox
                img.classList.add('zoomable');
                
                // Add click event for lightbox
                img.addEventListener('click', () => {
                  // Create lightbox element if it doesn't exist
                  let lightbox = select('#portfolio-lightbox');
                  if (!lightbox) {
                    lightbox = document.createElement('div');
                    lightbox.id = 'portfolio-lightbox';
                    lightbox.className = 'portfolio-lightbox';
                    lightbox.innerHTML = `
                      <div class="lightbox-content">
                        <span class="close-lightbox">&times;</span>
                        <img src="" alt="" class="lightbox-img">
                        <div class="lightbox-caption"></div>
                      </div>
                    `;
                    document.body.appendChild(lightbox);
                    
                    // Close lightbox when clicking outside the image
                    lightbox.addEventListener('click', (e) => {
                      if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                        lightbox.style.display = 'none';
                        document.body.style.overflow = 'auto';
                      }
                    });
                    
                    // Close with ESC key
                    document.addEventListener('keydown', (e) => {
                      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                        lightbox.style.display = 'none';
                        document.body.style.overflow = 'auto';
                      }
                    });
                  }
                  
                  // Update lightbox content
                  const lightboxImg = select('.lightbox-img', false, lightbox);
                  const lightboxCaption = select('.lightbox-caption', false, lightbox);
                  
                  if (lightboxImg) lightboxImg.src = img.src;
                  if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
                  
                  // Show lightbox
                  lightbox.style.display = 'flex';
                  document.body.style.overflow = 'hidden';
                });
              }
            });
          },
          slideChange: function() {
            // Update active slide indicator
            const activeIndex = this.realIndex + 1;
            const slideCount = this.slides.length;
            const counter = select('.swiper-counter', false, this.el);
            
            if (counter) {
              counter.textContent = `${activeIndex} / ${slideCount}`;
            }
          },
          resize: function() {
            // Handle responsive adjustments
            this.update();
          }
        }
      });
      
      return swiper;
    });
  };

  // Initialize all components
  initTyped();
  initNavbarLinks();
  initHeaderScroll();
  initBackToTop();
  initMobileNav();
  initSmoothScroll();
  initTestimonialsSlider();
  initPureCounter();
  initGLightbox();
  initPortfolioSlider();

})()