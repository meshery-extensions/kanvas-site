/**
 * Multi-player Cursors Animation
 * Displays animated cursors, social-proof indicators, and live activity states.
 */

(function() {
  'use strict';

  const CURSORS = [
    { src: '/images/cursors/cursor-1.svg', name: 'Aditya', role: 'Platform Team' },
    { src: '/images/cursors/cursor-2.svg', name: 'Jorge', role: 'SRE' },
    { src: '/images/cursors/cursor-3.svg', name: 'Suzan', role: 'Cloud Architect' },
    { src: '/images/cursors/cursor-4.svg', name: 'Ryan', role: 'Developer' },
    { src: '/images/cursors/cursor-5.svg', name: 'Sara Lin', role: 'Security' }
  ];

  const ACTIVITY_MESSAGES = [
    '[John] linked services',
    '[Scott] added external AI gateway',
    '[Xi] commented on "zone c" topology',
    '[Alice] updated labels',
    '[Carlos] synced changes',
    '[Zhu] commented on design',
    '[Lin] allowed 443/tcp in firewall',
    '[Olivia] deployed to staging',
    '[Hans] opened pull request with latest changes',
    '[Jorge] established terminal session on pod/nginx-a3f'
  ];

  const SOCIAL_PROOF_DEFAULTS = {
    online: 24
  };

  const SOCIAL_PROOF_LABELS = {
    online: 'online now'
  };

  const ANIMATION_DURATION = 3000;
  const ANIMATION_INTERVAL = 6000;
  const CURSOR_SIZE = 50;
  const EDGE_PADDING = 20;
  const MIN_INTERVAL_FACTOR = 0.6;
  const MAX_INTERVAL_FACTOR = 1.4;
  const SOCIAL_PROOF_INTERVAL = 3600;
  const ACTIVITY_HIDE_DELAY = 1800;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getRandomInterval() {
    const min = ANIMATION_INTERVAL * MIN_INTERVAL_FACTOR;
    const max = ANIMATION_INTERVAL * MAX_INTERVAL_FACTOR;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomPosition(container) {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const minX = EDGE_PADDING;
    const minY = EDGE_PADDING;
    const maxX = Math.max(minX, width - CURSOR_SIZE - EDGE_PADDING);
    const maxY = Math.max(minY, height - CURSOR_SIZE - EDGE_PADDING);

    return {
      x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
      y: Math.floor(Math.random() * (maxY - minY + 1)) + minY
    };
  }

  function setCursorPosition(element, pos, duration) {
    if (!element) return;

    if (duration && duration > 0) {
      element.style.transition = `transform ${duration}ms ease`;
      window.setTimeout(() => {
        element.style.transition = '';
      }, duration);
    }

    element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    element.dataset.x = String(pos.x);
    element.dataset.y = String(pos.y);
  }

  function createCursorElement(cursorData) {
    const wrapper = document.createElement('div');
    wrapper.className = 'multi-cursor';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.dataset.name = cursorData.name;

    const img = document.createElement('img');
    img.src = cursorData.src;
    img.alt = cursorData.name;

    const meta = document.createElement('div');
    meta.className = 'multi-cursor__meta';

    const role = document.createElement('span');
    role.className = 'multi-cursor__role';
    role.textContent = cursorData.role;

    const activity = document.createElement('span');
    activity.className = 'multi-cursor__activity';
    activity.textContent = 'active now';

    meta.appendChild(role);
    meta.appendChild(activity);
    wrapper.appendChild(img);
    wrapper.appendChild(meta);

    return wrapper;
  }

  function parseSocialProofConfig(config) {
    if (!config || typeof config !== 'string') {
      return { ...SOCIAL_PROOF_DEFAULTS };
    }

    const parsed = { ...SOCIAL_PROOF_DEFAULTS };
    const entries = config.split(';');

    entries.forEach((entry) => {
      const parts = entry.split('=');
      if (parts.length !== 2) return;

      const key = parts[0].trim();
      const value = Number(parts[1].trim());
      if (!key || Number.isNaN(value)) return;

      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        parsed[key] = value;
      }
    });

    return parsed;
  }

  function initSocialProof(surface, config) {
    if (!surface) return null;

    let panel = surface.querySelector('.cursor-social-proof');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'cursor-social-proof';
      panel.setAttribute('aria-live', 'polite');
      surface.appendChild(panel);
    }

    const metrics = parseSocialProofConfig(config);
    panel.innerHTML = '';

    const pills = {};
    Object.keys(metrics).forEach((metricKey) => {
      const pill = document.createElement('div');
      pill.className = 'cursor-proof-pill';
      pill.dataset.metric = metricKey;

      const value = document.createElement('span');
      value.className = 'cursor-proof-pill__value';
      value.textContent = String(metrics[metricKey]);

      const label = document.createElement('span');
      label.className = 'cursor-proof-pill__label';
      label.textContent = SOCIAL_PROOF_LABELS[metricKey] || metricKey;

      pill.appendChild(value);
      pill.appendChild(label);
      panel.appendChild(pill);
      pills[metricKey] = pill;
    });

    const activity = document.createElement('div');
    activity.className = 'cursor-proof-activity';
    panel.appendChild(activity);

    return {
      metrics,
      pills,
      activity
    };
  }

  function updateSocialProofMetric(state, key, nextValue) {
    if (!state || !state.pills[key]) return;

    state.metrics[key] = nextValue;
    const valueNode = state.pills[key].querySelector('.cursor-proof-pill__value');
    if (!valueNode) return;

    valueNode.textContent = String(nextValue);
    state.pills[key].classList.add('is-updating');
    window.setTimeout(() => {
      state.pills[key].classList.remove('is-updating');
    }, 500);
  }

  function updateSocialProofActivity(state, message) {
    if (!state || !state.activity) return;

    state.activity.textContent = message;
    state.activity.classList.add('is-live');
    window.setTimeout(() => {
      state.activity.classList.remove('is-live');
    }, 900);
  }

  function scheduleSocialProofUpdates(state) {
    if (!state) return;

    // Clear any existing interval to avoid multiple timers and potential leaks.
    if (state.socialProofIntervalId) {
      window.clearInterval(state.socialProofIntervalId);
      state.socialProofIntervalId = null;
    }

    state.socialProofIntervalId = window.setInterval(() => {
      const onlineDelta = Math.floor(Math.random() * 5) - 2;

      updateSocialProofMetric(state, 'online', clamp(state.metrics.online + onlineDelta, 8, 99));
    }, SOCIAL_PROOF_INTERVAL);
  }

  function clearSocialProofUpdates(state) {
    if (!state || !state.socialProofIntervalId) return;
    window.clearInterval(state.socialProofIntervalId);
    state.socialProofIntervalId = null;
  }
  function showCursorActivity(cursorElement, message) {
    if (!cursorElement || !message) return;

    const activityNode = cursorElement.querySelector('.multi-cursor__activity');
    if (!activityNode) return;

    activityNode.textContent = message;
    activityNode.classList.add('is-visible');

    window.setTimeout(() => {
      activityNode.classList.remove('is-visible');
    }, ACTIVITY_HIDE_DELAY);
  }

  function animateCursor(container, element, allCursors) {
    const pos = getRandomPosition(container);
    setCursorPosition(element, pos, ANIMATION_DURATION);

    if (allCursors.length > 0 && Math.random() > 0.65) {
      const randomCursor = allCursors[Math.floor(Math.random() * allCursors.length)];
      const randomMessage = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
      showCursorActivity(randomCursor, randomMessage);
    }
  }

  function scheduleCursorMovement(container, element, allCursors) {
    if (!document.body.contains(container) || !document.body.contains(element)) return;

    animateCursor(container, element, allCursors);

    const nextDelay = getRandomInterval();
    window.setTimeout(() => {
      scheduleCursorMovement(container, element, allCursors);
    }, nextDelay);
  }

  function initCursors(container, cursorIndices = [0, 1]) {
    if (!container) return;

    const cursors = [];
    const surface = container.closest('.canvas-preview') || container.parentElement || container;

    cursorIndices.forEach((index) => {
      if (index >= CURSORS.length) return;

      const cursorData = CURSORS[index];
      const cursorElement = createCursorElement(cursorData);
      container.appendChild(cursorElement);
      cursors.push(cursorElement);

      setCursorPosition(cursorElement, getRandomPosition(container));

      const initialDelay = getRandomInterval();
      window.setTimeout(() => {
        scheduleCursorMovement(container, cursorElement, cursors);
      }, initialDelay);
    });

    const socialProofState = initSocialProof(surface, container.getAttribute('data-social-proof'));
    if (socialProofState) {
      updateSocialProofActivity(socialProofState, 'Live collaboration is active');
      scheduleSocialProofUpdates(socialProofState);
    }

    if (socialProofState) {
      window.setInterval(() => {
        const message = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
        updateSocialProofActivity(socialProofState, message);
      }, 4200);
    }
  }

  function init() {
    const containers = document.querySelectorAll('[data-cursors]');

    containers.forEach((container) => {
      const cursorIndices = container.getAttribute('data-cursors')
        .split(',')
        .map(i => parseInt(i.trim(), 10))
        .filter(i => !isNaN(i));

      if (cursorIndices.length > 0) {
        initCursors(container, cursorIndices);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MultiPlayerCursors = {
    init: init,
    initCursors: initCursors
  };
})();
