#!/bin/bash
# Animation Performance Check Hook
# Monitors animation files for performance issues on file changes

set -e

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Animation Performance Check${NC}"
echo "================================"

FILE=$1

if [ -z "$FILE" ]; then
    echo "Usage: $0 <file-path>"
    exit 1
fi

if [ ! -f "$FILE" ]; then
    echo "File not found: $FILE"
    exit 0
fi

ISSUES=0

# Check file content
CONTENT=$(cat "$FILE")

echo "Analyzing: $FILE"
echo ""

# Check 1: Layout-triggering animations
echo -n "Checking for layout-triggering animations... "
if echo "$CONTENT" | grep -qE "animate.*\{[^}]*(width|height|top|left|right|bottom|padding|margin)[^}]*\}"; then
    echo -e "${RED}FOUND${NC}"
    echo "  Issue: Animating layout properties causes expensive recalculations"
    echo "  Fix: Use transform (translateX/Y, scale) instead"
    ((ISSUES++))
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 2: Missing will-change for complex animations
echo -n "Checking for will-change optimization... "
if echo "$CONTENT" | grep -qE "(keyframes|@keyframes|animate)" && ! echo "$CONTENT" | grep -q "will-change"; then
    echo -e "${YELLOW}MISSING${NC}"
    echo "  Suggestion: Add will-change for complex animations"
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 3: Multiple animation libraries
echo -n "Checking for animation library conflicts... "
LIBS=0
echo "$CONTENT" | grep -q "framer-motion" && ((LIBS++))
echo "$CONTENT" | grep -q "gsap" && ((LIBS++))
echo "$CONTENT" | grep -q "@react-spring" && ((LIBS++))
echo "$CONTENT" | grep -q "anime" && ((LIBS++))

if [ $LIBS -gt 1 ]; then
    echo -e "${YELLOW}MULTIPLE ($LIBS)${NC}"
    echo "  Warning: Multiple animation libraries may increase bundle size"
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 4: Large stagger counts
echo -n "Checking stagger performance... "
if echo "$CONTENT" | grep -qE "staggerChildren:\s*0\.[0-9][0-9]" || echo "$CONTENT" | grep -qE "stagger:\s*0\.[0-9][0-9]"; then
    echo -e "${YELLOW}REVIEW${NC}"
    echo "  Note: Large stagger delays can make animations feel slow"
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 5: Spring configurations
echo -n "Checking spring configurations... "
if echo "$CONTENT" | grep -qE "stiffness:\s*[0-9]{4}"; then
    echo -e "${YELLOW}REVIEW${NC}"
    echo "  Note: Very high stiffness values may cause jittery animations"
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 6: Reduced motion support
echo -n "Checking accessibility compliance... "
if echo "$CONTENT" | grep -qE "(motion\.|animate|useAnimation)" && ! echo "$CONTENT" | grep -qE "(useReducedMotion|prefers-reduced-motion)"; then
    echo -e "${RED}MISSING${NC}"
    echo "  Required: Add reduced motion support for accessibility"
    ((ISSUES++))
else
    echo -e "${GREEN}OK${NC}"
fi

# Check 7: Animation cleanup
echo -n "Checking for proper cleanup... "
if echo "$CONTENT" | grep -qE "(useAnimation|AnimationControls|gsap\.to)" && echo "$CONTENT" | grep -q "useEffect"; then
    if ! echo "$CONTENT" | grep -qE "return\s*\(\s*\)\s*=>" && ! echo "$CONTENT" | grep -q "cleanup\|revert\|kill"; then
        echo -e "${YELLOW}REVIEW${NC}"
        echo "  Note: Ensure animations are cleaned up on unmount"
    else
        echo -e "${GREEN}OK${NC}"
    fi
else
    echo -e "${GREEN}OK${NC}"
fi

echo ""
echo "================================"
if [ $ISSUES -gt 0 ]; then
    echo -e "${RED}Found $ISSUES issue(s) that should be addressed${NC}"
else
    echo -e "${GREEN}No critical performance issues detected${NC}"
fi

exit 0
