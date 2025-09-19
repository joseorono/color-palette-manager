
# ✅ To-Do List


## CSS
- [x] Minor adjustment to the CSS variables used by Shadcn/UI to fix some
issues with buttons and light mode.

## Misc
- [x] Add a "Try it out" button to the landing page that opens the Palette Editor in a new tab.
- [ ] Fix: setState in render warning in the Palette Editor. Find where `setState` or `toast()` is being called during render.
- [x] Rewrite handleSizeChange to actually use the palette generator.
- [x] Make it so the color count of the palette is stored and set by the Store.
- [x] Redesign the Select Generation Method modal.
- [ ] basedOnColor links doesn't work. E.g. /app/palette-edit/?basedOnColor=#FF6B6B
- [x] regenerateUnlocked should be reimplemented, using our utilities like getLockedColors
- [x] Fix: Currently the existing locked colors aren't being passed to generateHarmoniousHexCsv
- [x] Fix: The Preview button has some visual bugs (Text overflows the container...).

### 🎨 Color Tools
- [ ] Eyedropper


