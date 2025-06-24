[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fJgEQL7f)

# Programming Assignment 02 -- Phreddit ( Phake Reddit with React )

**In the sections below, list and describe each contribution briefly.**

## Team Member 1 Contribution

<Name of Team Member 1>

- Search Results View

  - Copied newest, oldest, active from home view
  - Proper integration with banner and routing in phreddit.js

- Post View with Threaded Comments

  - Display post according to assignment
  - Add comment button and reply button on all comments
  - All comments properly threaded
  - Wrap reply callback to ensure original post ID is always passed

- New Community View

  - User can enter community name and description and username
  - Support for hyperlink
  - Validation for required fields

- New Comment View

  - Let users submit new comment or reply
  - Validates comment content and username
  - Validates hyperlink
  - On successful submission, navigates back to post view (using original postID)

- Navigation adjustments in phreddit.js
  - Store both parent type and parent ID separate from original post ID
  - Modified navigateToNewComment function to prevent post not found error

## Team Member 2 Contribution

<Gavin Levitt>
- imported stylesheets App.css
- Phreddit.js
- head banner: fixed position
  - site logo/title
    - functionally a home button
  - search-bar/box 
    - brings up searchview upon 'enter'
  - create comm btn
    - loads in new comm view
- Navbar: fixed positionally
  - home btn
    - renders home view w/ new sorting
  - comm list (clickable)
- Comm view (header, creator, description, etc.)
- Posts
  - comment threading and replys
- hyperlinks regex for hyperlink notation
