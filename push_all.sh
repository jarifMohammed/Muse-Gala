#!/bin/bash

# Commit message can be passed as an argument, or defaults to "Auto-update"
COMMIT_MSG=${1:-"Auto-update code"}

echo "========== Pushing individual repositories =========="

REPOS=(
    "muse-gala-backend"
    "muse_gala_admin_dashboard"
    "muse_gala_lender_dashboard"
    "muse_gala_website"
)

for REPO in "${REPOS[@]}"; do
    if [ -d "$REPO/.git" ]; then
        echo "-> Processing $REPO..."
        cd "$REPO"
        git add .
        # Commit if there are changes; continue otherwise
        git commit -m "$COMMIT_MSG" || true
        git push || true
        cd ..
        echo ""
    else
        echo "-> Skipping $REPO (not a git repository)"
    fi
done

echo "========== Pushing global repository =========="

# Temporarily rename .git folders so the global repo tracks the actual files
for REPO in "${REPOS[@]}"; do
    if [ -d "$REPO/.git" ]; then
        mv "$REPO/.git" "$REPO/.git_temp"
    fi
done

# Add all actual files in the global root
git add .

# Do not include the README.md file in the global commits
git reset README.md

# Commit and push
git commit -m "$COMMIT_MSG" || true
git push origin main || true

# Restore the .git folders for the individual repos
for REPO in "${REPOS[@]}"; do
    if [ -d "$REPO/.git_temp" ]; then
        mv "$REPO/.git_temp" "$REPO/.git"
    fi
done

echo "========== Done =========="
