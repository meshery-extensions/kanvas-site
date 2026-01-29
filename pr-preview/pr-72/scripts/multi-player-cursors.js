/**
 * Multi-player Cursors Animation
 * Displays animated cursors with names moving randomly within containers
 */

(function() {
  'use strict';

  // Configuration
  const CURSORS = [
    { src: '/images/cursors/cursor-1.svg', name: 'Aditya' },
    { src: '/images/cursors/cursor-2.svg', name: 'Jorge' },
    { src: '/images/cursors/cursor-3.svg', name: 'Suzan' },
    { src: '/images/cursors/cursor-4.svg', name: 'Ryan' },
    { src: '/images/cursors/cursor-5.svg', name: 'Sara Lin' }
  ];

  const ANIMATION_DURATION = 3000; // 3 seconds
  const ANIMATION_INTERVAL = 6000; // 6 seconds between movements
  const CURSOR_SIZE = 50; // Default cursor size in pixels
  const EDGE_PADDING = 20; // Padding from container edges
  const MIN_INTERVAL_FACTOR = 0.6;
  const MAX_INTERVAL_FACTOR = 1.4;

  /**
   * Initialize cursors in a container
   */
  function initCursors(container, cursorIndices = [0, 1]) {
    if (!container) return;

    const cursors = [];

    cursorIndices.forEach((index) => {
      if (index >= CURSORS.length) return;

      const cursorData = CURSORS[index];
      const cursorElement = createCursorElement(cursorData);
      container.appendChild(cursorElement);
      cursors.push(cursorElement);

      // Set initial random position
      setInitialRandomPosition(container, cursorElement);

      // Start animation loop on an independent timer
      const initialDelay = getRandomInterval();
      setTimeout(() => {
        scheduleCursorMovement(container, cursorElement);
      }, initialDelay);
    });
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
   * Get random position within container bounds with equal padding on all sides
   */
  function getRandomPosition(container) {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const minX = EDGE_PADDING;
    const minY = EDGE_PADDING;
    const maxX = Math.max(minX, width - CURSOR_SIZE - EDGE_PADDING);
    const maxY = Math.max(minY, height - CURSOR_SIZE - EDGE_PADDING);

    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    return { x: randomX, y: randomY };
  }

  /**
   * Get randomized interval for independent movement
   */
  function getRandomInterval() {
    const min = ANIMATION_INTERVAL * MIN_INTERVAL_FACTOR;
    const max = ANIMATION_INTERVAL * MAX_INTERVAL_FACTOR;
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
   * Schedule cursor movement on its own timer
   */
  function scheduleCursorMovement(container, element) {
    // Check if container and cursor still exist
    if (!document.body.contains(container) || !document.body.contains(element)) return;

    animateCursor(container, element);

    const nextDelay = getRandomInterval();
    setTimeout(() => {
      scheduleCursorMovement(container, element);
    }, nextDelay);
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
