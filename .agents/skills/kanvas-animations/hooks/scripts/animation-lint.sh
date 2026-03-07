#!/bin/bash
# Animation Lint Hook
# Checks animation code for common issues before commit

set -e

echo "Running animation lint checks..."

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx?|jsx?)$' || true)

if [ -z "$STAGED_FILES" ]; then
    echo "No TypeScript/JavaScript files to check."
    exit 0
fi

# Check for non-GPU animated properties
check_non_gpu_properties() {
    local file=$1
    if grep -n "animate.*\(width\|height\|top\|left\|right\|bottom\|margin\|padding\)" "$file" 2>/dev/null; then
        echo -e "${YELLOW}Warning:${NC} $file contains animations on non-GPU properties"
        echo "  Consider using transform (translateX/Y, scale) instead"
        ((WARNINGS++))
    fi
}

# Check for missing reduced motion support
check_reduced_motion() {
    local file=$1
    if grep -q "framer-motion\|@react-spring" "$file" 2>/dev/null; then
        if ! grep -q "useReducedMotion\|prefers-reduced-motion" "$file" 2>/dev/null; then
            echo -e "${YELLOW}Warning:${NC} $file uses animations but may lack reduced motion support"
            ((WARNINGS++))
        fi
    fi
}

# Check for animation cleanup
check_animation_cleanup() {
    local file=$1
    if grep -q "useAnimation\|gsap\|anime" "$file" 2>/dev/null; then
        if grep -q "useEffect" "$file" 2>/dev/null; then
            if ! grep -q "return.*=>" "$file" 2>/dev/null; then
                echo -e "${YELLOW}Warning:${NC} $file may have animation without cleanup"
                ((WARNINGS++))
            fi
        fi
    fi
}

# Check for magic numbers in animations
check_magic_numbers() {
    local file=$1
    if grep -nE "duration:\s*[0-9]+(\.[0-9]+)?\s*[,}]" "$file" 2>/dev/null | grep -vE "duration:\s*(0\.15|0\.2|0\.25|0\.3|0\.4|0\.5|0\.6|0\.8|1)" > /dev/null; then
        echo -e "${YELLOW}Info:${NC} $file has non-standard animation durations"
        echo "  Consider using animation tokens for consistency"
    fi
}

# Check for infinite animations without user control
check_infinite_animations() {
    local file=$1
    if grep -nE "repeat:\s*(Infinity|-1)|animation.*infinite" "$file" 2>/dev/null; then
        if ! grep -q "pause\|stop\|cancel" "$file" 2>/dev/null; then
            echo -e "${YELLOW}Warning:${NC} $file has infinite animation without pause control"
            ((WARNINGS++))
        fi
    fi
}

echo "Checking ${#STAGED_FILES[@]} files..."
echo ""

for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        check_non_gpu_properties "$file"
        check_reduced_motion "$file"
        check_animation_cleanup "$file"
        check_magic_numbers "$file"
        check_infinite_animations "$file"
    fi
done

echo ""
echo "Animation lint complete."
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}Commit blocked due to animation errors.${NC}"
    exit 1
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Commit allowed with warnings. Consider fixing above issues.${NC}"
fi

echo -e "${GREEN}Animation checks passed!${NC}"
exit 0
