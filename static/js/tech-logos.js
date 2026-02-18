// Keppel color palette for logos
export const KEPPEL_LIGHT = '#5FCDB8';
export const KEPPEL_PRIMARY = '#3AB09E';
export const KEPPEL_GLOW = '#4ECBB8';
export const BACKGROUND_COLOR = '#060c0c'
const KEPPEL_FILL = 'rgba(58, 176, 158, 0.3)';
const KEPPEL_FILL_LIGHT = 'rgba(95, 205, 184, 0.25)';

// Center cube icon - Server/Data center
export const CENTER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${KEPPEL_FILL}" stroke="${KEPPEL_PRIMARY}" stroke-width="1.2">
  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
  <line x1="6" y1="6" x2="6.01" y2="6"/>
  <line x1="6" y1="18" x2="6.01" y2="18"/>
</svg>`;

// 28 unique tech-themed SVG logos in Keppel colors with fills
export const TECH_LOGOS = [
    // 1. AWS-style cloud
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 16c-8 0-14 4-16 10-1-2-4-4-7-4-5 0-8 4-8 8s3 8 8 8h40c6 0 10-4 10-10s-4-10-10-10c0-6-8-12-17-12z"/>
  </svg>`,

    // 2. Kubernetes wheel
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL_LIGHT}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="20" fill="${KEPPEL_FILL}"/>
    <circle cx="32" cy="32" r="8" fill="${KEPPEL_LIGHT}"/>
    <line x1="32" y1="12" x2="32" y2="24"/>
    <line x1="32" y1="40" x2="32" y2="52"/>
    <line x1="12" y1="32" x2="24" y2="32"/>
    <line x1="40" y1="32" x2="52" y2="32"/>
    <line x1="17" y1="17" x2="26" y2="26"/>
    <line x1="38" y1="38" x2="47" y2="47"/>
    <line x1="47" y1="17" x2="38" y2="26"/>
    <line x1="26" y1="38" x2="17" y2="47"/>
  </svg>`,

    // 3. Docker whale
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M8 32c4-8 12-8 16-4h24c4-8 8-4 8 0v12c0 8-8 12-20 12H20c-12 0-16-8-12-20z"/>
    <rect x="20" y="28" width="6" height="6" fill="${KEPPEL_LIGHT}"/>
    <rect x="28" y="28" width="6" height="6" fill="${KEPPEL_LIGHT}"/>
    <rect x="36" y="28" width="6" height="6" fill="${KEPPEL_LIGHT}"/>
    <rect x="28" y="20" width="6" height="6" fill="${KEPPEL_LIGHT}"/>
  </svg>`,

    // 4. Terraform style (layered)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <polygon points="12,20 32,8 32,28 12,40" fill="${KEPPEL_FILL}"/>
    <polygon points="36,20 56,8 56,28 36,40" fill="${KEPPEL_PRIMARY}" fill-opacity="0.4"/>
    <polygon points="36,44 56,32 56,52 36,64" fill="${KEPPEL_FILL}"/>
  </svg>`,

    // 5. Lambda symbol
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="3">
    <path d="M16 12h8l8 20 8-20h8"/>
    <path d="M32 32l12 24"/>
    <path d="M24 56l8-24"/>
  </svg>`,

    // 6. Database cylinder
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <ellipse cx="32" cy="16" rx="18" ry="8" fill="${KEPPEL_PRIMARY}" fill-opacity="0.4"/>
    <path d="M14 16v32c0 4 8 8 18 8s18-4 18-8V16"/>
    <path d="M14 28c0 4 8 8 18 8s18-4 18-8"/>
    <path d="M14 40c0 4 8 8 18 8s18-4 18-8"/>
  </svg>`,

    // 7. Shield security
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 8L12 16v16c0 12 8 20 20 24 12-4 20-12 20-24V16L32 8z"/>
    <path d="M24 32l6 6 12-12" stroke="${KEPPEL_LIGHT}" stroke-width="3" fill="none"/>
  </svg>`,

    // 8. Network nodes
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_LIGHT}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="16" r="6"/>
    <circle cx="16" cy="48" r="6"/>
    <circle cx="48" cy="48" r="6"/>
    <line x1="32" y1="22" x2="20" y2="42" stroke="${KEPPEL_FILL_LIGHT}" stroke-width="3"/>
    <line x1="32" y1="22" x2="44" y2="42" stroke="${KEPPEL_FILL_LIGHT}" stroke-width="3"/>
    <line x1="22" y1="48" x2="42" y2="48" stroke="${KEPPEL_FILL_LIGHT}" stroke-width="3"/>
  </svg>`,

    // 9. API brackets
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${KEPPEL_LIGHT}" stroke-width="3">
    <path d="M20 12c-8 0-8 8-8 8v12l-4 4 4 4v12c0 0 0 8 8 8"/>
    <path d="M44 12c8 0 8 8 8 8v12l4 4-4 4v12c0 0 0 8-8 8"/>
    <circle cx="32" cy="32" r="4" fill="${KEPPEL_LIGHT}"/>
  </svg>`,

    // 10. Gear settings
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="10" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
    <path d="M32 8v8M32 48v8M8 32h8M48 32h8"/>
    <path d="M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"/>
  </svg>`,

    // 11. Server rack
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="12" y="8" width="40" height="14" rx="2"/>
    <rect x="12" y="26" width="40" height="14" rx="2"/>
    <rect x="12" y="44" width="40" height="14" rx="2"/>
    <circle cx="20" cy="15" r="2" fill="${KEPPEL_LIGHT}"/>
    <circle cx="20" cy="33" r="2" fill="${KEPPEL_LIGHT}"/>
    <circle cx="20" cy="51" r="2" fill="${KEPPEL_LIGHT}"/>
  </svg>`,

    // 12. Git branch
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_LIGHT}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="20" cy="16" r="6"/>
    <circle cx="20" cy="48" r="6"/>
    <circle cx="44" cy="32" r="6"/>
    <line x1="20" y1="22" x2="20" y2="42" stroke="${KEPPEL_FILL_LIGHT}" stroke-width="3"/>
    <path d="M20 28c0 0 0 4 8 4h10" stroke="${KEPPEL_FILL_LIGHT}" stroke-width="3" fill="none"/>
  </svg>`,

    // 13. Terminal/CLI
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="8" y="12" width="48" height="40" rx="4"/>
    <path d="M16 28l8 8-8 8" stroke="${KEPPEL_LIGHT}" stroke-width="3" fill="none"/>
    <line x1="28" y1="44" x2="44" y2="44" stroke="${KEPPEL_LIGHT}" stroke-width="3"/>
  </svg>`,

    // 14. Code/script
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${KEPPEL_LIGHT}" stroke-width="2.5">
    <path d="M24 16l-12 16 12 16"/>
    <path d="M40 16l12 16-12 16"/>
    <line x1="36" y1="12" x2="28" y2="52" stroke="${KEPPEL_PRIMARY}" stroke-width="3"/>
  </svg>`,

    // 15. Lock/security
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="16" y="28" width="32" height="28" rx="4"/>
    <path d="M20 28v-8c0-8 6-12 12-12s12 4 12 12v8" fill="none"/>
    <circle cx="32" cy="42" r="4" fill="${KEPPEL_LIGHT}"/>
    <line x1="32" y1="46" x2="32" y2="50"/>
  </svg>`,

    // 16. Microservices/hexagon
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <polygon points="32,8 52,20 52,44 32,56 12,44 12,20"/>
    <polygon points="32,20 42,26 42,38 32,44 22,38 22,26" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
  </svg>`,

    // 17. Pipeline/flow
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_LIGHT}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="12" cy="32" r="6"/>
    <circle cx="32" cy="32" r="6"/>
    <circle cx="52" cy="32" r="6"/>
    <line x1="18" y1="32" x2="26" y2="32" stroke-width="3"/>
    <line x1="38" y1="32" x2="46" y2="32" stroke-width="3"/>
    <path d="M32 12v14M32 38v14" stroke-width="2"/>
  </svg>`,

    // 18. Monitoring/chart
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="8" y="8" width="48" height="48" rx="4"/>
    <polyline points="16,40 24,28 32,36 40,20 48,32" fill="none" stroke="${KEPPEL_LIGHT}" stroke-width="3"/>
  </svg>`,

    // 19. Ansible/automation
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="24"/>
    <path d="M32 16v32" stroke-width="3"/>
    <path d="M24 28l8 8 8-8" stroke-width="3" fill="none"/>
    <path d="M20 44h24" stroke-width="3"/>
  </svg>`,

    // 20. Container/box
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 8l24 12v24l-24 12-24-12V20z"/>
    <path d="M32 8v24" stroke-width="2"/>
    <path d="M8 20l24 12 24-12" stroke-width="2" fill="none"/>
    <path d="M32 32v24" stroke-width="2"/>
  </svg>`,

    // 21. Prometheus/fire
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 8c-8 16-16 16-16 28 0 10 8 20 16 20s16-10 16-20c0-12-8-12-16-28z"/>
    <path d="M32 36c-2 4-6 4-6 10 0 4 4 8 6 8s6-4 6-8c0-6-4-6-6-10z" fill="${KEPPEL_LIGHT}"/>
  </svg>`,

    // 22. Grafana/dashboard
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="8" y="8" width="48" height="48" rx="4"/>
    <rect x="14" y="14" width="16" height="12" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
    <rect x="34" y="14" width="16" height="12" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
    <rect x="14" y="30" width="36" height="18" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
  </svg>`,

    // 23. Redis/keyvalue
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M8 24l24-12 24 12-24 12z" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
    <path d="M8 32l24 12 24-12" fill="none"/>
    <path d="M8 40l24 12 24-12" fill="none"/>
    <path d="M8 24v16"/>
    <path d="M56 24v16"/>
  </svg>`,

    // 24. Jenkins/butler
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="28" r="16"/>
    <path d="M20 44h24v12c0 4-4 8-12 8s-12-4-12-8z"/>
    <circle cx="26" cy="26" r="3" fill="${KEPPEL_LIGHT}"/>
    <circle cx="38" cy="26" r="3" fill="${KEPPEL_LIGHT}"/>
    <path d="M26 34c0 4 6 6 12 0" fill="none"/>
  </svg>`,

    // 25. Vault/safe
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="12" y="12" width="40" height="40" rx="4"/>
    <circle cx="32" cy="32" r="12" fill="${KEPPEL_PRIMARY}" fill-opacity="0.4"/>
    <line x1="32" y1="20" x2="32" y2="32" stroke-width="3"/>
    <line x1="32" y1="32" x2="40" y2="36" stroke-width="3"/>
  </svg>`,

    // 26. Elasticsearch/search
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="28" cy="28" r="16"/>
    <line x1="40" y1="40" x2="52" y2="52" stroke-width="4"/>
    <path d="M20 28h16" stroke-width="2"/>
    <path d="M20 22h12" stroke-width="2"/>
    <path d="M20 34h10" stroke-width="2"/>
  </svg>`,

    // 27. Kafka/streaming
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_LIGHT}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="20" cy="16" r="6"/>
    <circle cx="20" cy="48" r="6"/>
    <circle cx="44" cy="32" r="6"/>
    <path d="M26 18l12 10" stroke-width="3"/>
    <path d="M26 46l12-10" stroke-width="3"/>
    <circle cx="44" cy="16" r="4"/>
    <circle cx="44" cy="48" r="4"/>
  </svg>`,

    // 28. Nginx/server
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M16 12h8l24 40h-8z"/>
    <path d="M16 12v40" stroke-width="3"/>
    <path d="M48 12v40" stroke-width="3"/>
  </svg>`,
];

// Simple icons for opposite faces (front/back) - with fills
export const SIMPLE_ICONS = [
    // Circle dot
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="20"/>
    <circle cx="32" cy="32" r="8" fill="${KEPPEL_LIGHT}"/>
  </svg>`,

    // Square
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <rect x="16" y="16" width="32" height="32" rx="4"/>
  </svg>`,

    // Diamond
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 12l20 20-20 20-20-20z"/>
  </svg>`,

    // Triangle
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 12l22 40H10z"/>
  </svg>`,

    // Plus
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${KEPPEL_LIGHT}" stroke-width="4">
    <line x1="32" y1="12" x2="32" y2="52"/>
    <line x1="12" y1="32" x2="52" y2="32"/>
  </svg>`,

    // Star
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 12l6 16h16l-13 10 5 16-14-10-14 10 5-16-13-10h16z"/>
  </svg>`,

    // Hexagon
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 8l22 12v24l-22 12-22-12V20z"/>
  </svg>`,

    // Cross circle
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="20"/>
    <line x1="22" y1="22" x2="42" y2="42" stroke-width="3"/>
    <line x1="42" y1="22" x2="22" y2="42" stroke-width="3"/>
  </svg>`,

    // Double circle
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <circle cx="32" cy="32" r="22"/>
    <circle cx="32" cy="32" r="12" fill="${KEPPEL_PRIMARY}" fill-opacity="0.5"/>
  </svg>`,

    // Octagon
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M22 12h20l10 10v20l-10 10H22l-10-10V22z"/>
  </svg>`,

    // Arrow up
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${KEPPEL_FILL}" stroke="${KEPPEL_LIGHT}" stroke-width="2">
    <path d="M32 8l20 24H12z"/>
    <rect x="24" y="32" width="16" height="24"/>
  </svg>`,

    // Infinity
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${KEPPEL_LIGHT}" stroke-width="3">
    <path d="M20 32c-6-8-6-16 0-16s12 8 12 16-6 16-12 16-6-8 0-16z"/>
    <path d="M44 32c6 8 6 16 0 16s-12-8-12-16 6-16 12-16 6 8 0 16z"/>
  </svg>`,
];