- My main goal is to make the editor attractive and easy to use, with a minimum of distractions. I think it's already dynamic enough with the drag-and-drop, theme switcher, responsive grid, sticky header, etc.

- I have this idea that the view could be split in "parts" vertically
    - 1: our app's navbar vertically.
    - 2: the editor's top bar
    - 3: the color grid itself
        - This could be the section that scrolls.
        - This is where the sidebar/sidepanes could be.
            - Maybe the form for palette metadata could slide in from the left, and the color editor could slide in from the right.
    - 4: The bottom bar with the options to save, export, share, delete, etc.

- For the Palette Metadata (Name, Description, Tags, etc), we could use a Shadcn Sidebar with a form inside it.
https://v3.shadcn.com/docs/components/sidebar

- The idea I've been toying with is a footer with a few options:
    - Save
    - Save as...
        - (This should open a modal to create a copy of a palette with a new name)
        - This could be inside the Dropdown in a split button.
    - Export
    - Share
    - Delete
