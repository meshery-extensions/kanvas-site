/**
 * Multi-player Cursors Animation
 * Displays animated cursors with names moving randomly within containers
 */

(function() {
  'use strict';

  // Configuration
  const CURSORS = [
    { src: '/images/cursors/cursor-1.svg', name: 'Sarah' },
    { src: '/images/cursors/cursor-2.svg', name: 'Jorge' },
    { src: '/images/cursors/cursor-3.svg', name: 'Suzan' },
    { src: '/images/cursors/cursor-4.svg', name: 'Ryan' }
  ];

  const ANIMATION_DURATION = 3000; // 3 seconds
  const ANIMATION_INTERVAL = 6000; // 6 seconds between movements
  const CURSOR_SIZE = 50; // Default cursor size in pixels
  const EDGE_PADDING = 50; // Padding from container edges

  /**
   * Initialize cursors in a container
   */
  function initCursors(container, cursorIndices = [0, 1]) {
    if (!container) return;

    const cursors = [];
    
    cursorIndices.forEach((index, i) => {
      if (index >= CURSORS.length) return;
      
      const cursorData = CURSORS[index];
      const cursorElement = createCursorElement(cursorData);
      container.appendChild(cursorElement);
      cursors.push(cursorElement);
      
      // Set initial random position
      setInitialRandomPosition(container, cursorElement);
      
      // Start animation with stagger
      setTimeout(() => {
        animateCursor(container, cursorElement);
      }, i * ANIMATION_DURATION);
    });

    // Continue animation loop
    const intervalId = setInterval(() => {
      // Check if container still exists in DOM
      if (!document.body.contains(container)) {
        clearInterval(intervalId);
        return;
      }
      
      cursors.forEach((cursor, i) => {
        // Check if cursor still exists
        if (!document.body.contains(cursor)) return;
        
        setTimeout(() => {
          animateCursor(container, cursor);
        }, i * ANIMATION_DURATION);
      });
    }, ANIMATION_INTERVAL);
  }

  /**
   * Create cursor DOM element
   */
  function createCursorElement(cursorData) {
    const wrapper = document.createElement('div');
    wrapper.className = 'multi-cursor';
    
    const img = document.createElement('img');
    img.src = cursorData.src;
    img.alt = cursorData.name;
    
    wrapper.appendChild(img);
    
    return wrapper;
  }

  /**
   * Get random position within container bounds
   */
  function getRandomPosition(container) {
    const rect = container.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - CURSOR_SIZE - EDGE_PADDING);
    const maxY = Math.max(0, rect.height - CURSOR_SIZE - EDGE_PADDING);
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    return { x: randomX, y: randomY };
  }

  /**
   * Set initial random position for cursor
   */
  function setInitialRandomPosition(container, element) {
    const pos = getRandomPosition(container);
    element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  }

  /**
   * Animate cursor to random position
   */
  function animateCursor(container, element) {
    const pos = getRandomPosition(container);
    
    element.style.transition = `transform ${ANIMATION_DURATION}ms ease`;
    element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    
    // Clear transition after animation completes
    setTimeout(() => {
      element.style.transition = '';
    }, ANIMATION_DURATION);
  }

  /**
   * Initialize all cursor containers on page load
   */
  function init() {
    // Find all containers with data-cursors attribute
    const containers = document.querySelectorAll('[data-cursors]');
    
    containers.forEach(container => {
      const cursorIndices = container.getAttribute('data-cursors')
        .split(',')
        .map(i => parseInt(i.trim(), 10))
        .filter(i => !isNaN(i));
      
      if (cursorIndices.length > 0) {
        initCursors(container, cursorIndices);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for manual initialization if needed
  window.MultiPlayerCursors = {
    init: init,
    initCursors: initCursors
  };
})();
