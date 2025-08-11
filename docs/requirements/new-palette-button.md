
# New Palette Button

# File Location

The new palette modal should be in the
/src/components/dialogs/ directory

## Description

- It's a Shadcn/ui Modal
- It has a form to create a new palette (use React Hook Form)
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