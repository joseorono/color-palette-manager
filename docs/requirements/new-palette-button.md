
# New Palette Modal

# File Location

The new palette modal should be in the
/src/components/dialogs/ directory

## Description

- It's a Shadcn/ui Modal
- It has a form to create a new palette (use React Hook Form)
- Validate the form with the help of Zod, and show error messages if the form is invalid.
    - Name is required
    - Description is required
    - Validation should be done in accordance to the schema defined in src/types/palette.ts and src/db/queries.ts, as well as validation standars detailed in docs/validation-notes.md
- The form has the following fields:
    - Name = Default Value: "New Palette"
    - Description = Default Value: "Your latest color palette."
    - Tags (optional) - Any categories you'd like to organize your palettes by
    - Is Public (optional) - Checkbox
    - Is Favorite (optional) - Checkbox
- Default Values:
    - Favorite Count = 0
- The form has a submit button with the text "Let's Create it!" that calls the PaletteDBQueries.insertPalette() function and redirects you to the Palette Editor with the new palette's id in the URL.

Example Palette Editor URL:
/palette-editor/?palette_id=12345678-1234-1234-1234-1234567890ab

## More:

It would be good for the tag's input element to work like this:
https://codepen.io/miladbruce/pen/PwezZE