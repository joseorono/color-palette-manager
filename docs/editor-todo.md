## High Priority

- [x] Settle on a **final design for the Color Cards**
- [x] **Fix Creating new palette from the editor** It doesn't work. Weird!.
- [x] Fix **responsive issues**
  - There may be others, but the most salient one happens at around 888px x 631px (feasible for a small tablet or windowed Electron app)

## Navbar Improvements

### High Priority

- [x] **Fix bug with the Save Icon**, it changes to a checkmark when saving but doesn't go back to the floppy disk icon a few seconds after saving.
- [x] **Add 'Add Color' keyboard shortcut** (Maybe Shift + A)
- [x] **Reorder navbar actions**: Share - Preview - Export - Save (primary)
- [x] **Update Preview button** with two options:
  - Preview Palette (opens side pane to the right)
  - Full-Screen Preview (opens new tab with palette ID)
  - Remove "Color Details" option
- [x] **Fix keyboard shortcuts dialog** making page unresponsive
- [x] **Convert Generate button** to split button:
  - Main button: Sparkles icon for AI generation
  - Dropdown: Settings gear icon for Generation Methods/Preferred Palette Types

### Medium Priority

- [x] **Create mobile bottom bar** for mobile navigation
- [x] **Change save icon** from checkmark to floppy disk
- [x] **Remove unused hamburger menu options** (keep only keyboard shortcuts)

## Backend/Logic Improvements

### High Priority

- [x] **Implement GenerateHarmonious** with palette type props and respect locked colors - Jose: I'll do this but I need the UI/store to pass the palette type to the GenerateHarmonious function. It already takes the argument.
- [x] Create method to filter only locked colors from Color[] array

### Medium Priority

- [x] **Fix unnecessary scroll** in palette editor (height/flex issue - use flex instead of min-height 100%)


## Notes

- Extract From Image button keeps camera icon
- Generate and Extract buttons should be icon buttons
- Save button should be primary action in navbar
