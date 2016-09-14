Version - 0.3.16
----

- 516feec: linter
- f726d29: refactor tests to match component changes
- f242342: add id to login button
- 03269be: linter
- 0c99436: linter
- d364a74: linter
- 2834a42: add style sheet for change password route
- e9bae13: refactor render function to create reset password function. add new confirm re-login function.
- ca251ff: add new assets for confirm password reset
- 441a873: linter
- 77f0480: add style rules for forgot password, confirm teacher, and confirm student pages
- 8840956: add confirm teacher and confirm student password reset screens. add reference to user type to state. add function for setting user type to state. refactor forgot password page
- cef7302: add new assets for reset password
- d641b9c: add responsive styles for login page
- 58c73bc: refactor login component. remove tabs. add functions for rendering login and forgot password pages.
- b2f86ca: add new login page assets
- 3a40efe: Version bump [ci skip]

Version - 0.3.15
----

- 6e72f47: remove unused component and styles
- bd813d3: Version bump [ci skip]

Version - 0.3.14
----

- 19c862b: linter
- c96a0d7: add initial testing, test data, and smoke test file for newsfeed
- 7c71703: remove default from export declaration on class. remove on error props for images
- 6d8aa6f: update style rules, refactor for linter
- dd5554a: Version bump [ci skip]

Version - 0.3.13
----

- e99cf48: add expect clause to test to check for flipcase
- efe45f4: rename class
- ae16532: remove commented test code
- 6d3c8ae: Version bump [ci skip]
- 78945d8: linter

Version - 0.3.12
----

- 78945d8: linter

Version - 0.3.11
----



Version - 0.0.0
---------------

- 48c2758: bump version
- 313d0a2: removed useless long line
- 3569521: fixed terms tests
- 94a4f73: imagemin
- c60d2b1: minor hotfixes to allow for loading saved game data and rendering games in mobile
- 3ea748f: update tests after merge
- b592cd8: linter
- 2edb699: update test cases
- 9cd92e1: linter
- 47af18e: remove unused variables
- f0d998f: remove unescessary media queries and set true 9:16 aspect ratio for game frame
- 956527d: remove screenfull state from component state
- 3407154: linting
- 797f4cf: removed bad sweater classes
- a1d5cea: fixed pushdown on homepage
- e88527a: bump version
- 0ca2b63: allow loaded data to be sent to game
- c6cb1c8: adjust aspect ratio
- bf2ae3d: do not send a body on delete requests
- b2a38b3: linting
- 9370db2: extra parentheses
- 32cb9c9: update render function to not render title if not yet available
- 435c945: update label on site nav menu
- 0b6a875: allow configurable upload preset
- edad81e: moved cloudinary name to env var
- a7e7585: point at staging cloudinary
- 89d6a16: linter
- 7cab51c: update styles to properly resize iframe. add state for when screenfull is activated. update values in variables.js
- 6f49730: short on getting group hal link
- effeabf: bump version
- f9bd4f4: cherry pick f6f6115
- 1760ba8: linter
- 92917b8: refactor and condense size variables for rendering iframes across devices
- da65cb9: update style rules to render iframes at 9 by 16 across devices
- 44f5ede: update ref for screenful request
- 0f66f98: add game id
- f6f6115: fixed mobile skribble and login style
- f5c87ac: bump version
- 58652b6: linting
- 372f00b: fixed bad detector call
- 89c72de: linting
- 547dcd6: linting
- e3a395d: added desktop only flag
- 6fd50c5: changed function name and fixed linting
- 0cb4187: changed function name
- 3e76b40: update file names for all about you flips. refactor game component to include ga
- b65a0a5: added desktop flag
- 21aca40: moved misplaced overflow
- 0839dbe: bump version
- e332475: disabled school smokem
- 6528744: undoing some mistakes from rebasing
- f116e92: updated smoke tests for game route
- 6789d0c: linting, plus a leftover conflict
- 1bab9cf: changing some numbers
- 55e0f09: linting
- 87a0b0c: fullscreen works
- 10e5154: moved check for portrait to game component
- 7f008f0: fullscreen for overlay
- d1375b1: webpack production config
- b4b86ff: screen added, but full screen is kaput
- 0599dd2: fix to production build, renamed docker-compose to .dist
- 2ec1d67: changed to msg from Val
- c857f0b: overlay screen added
- 93c5877: linting
- 2c3abd7: typos, cleaned up
- 300544c: refactored friends
- 2a88c17: added suggested friends link if no friends
- f5e7be0: linter
- bb8d27c: move create student component into its own file. remove unused modules and const. add current user to map state to props
- f5403d7: friends
- 8e88bdd: Linting
- 20b5047: removed unused addFriend variable.
- 751686b: Dont readd docker-compose.yml
- 07e75d7: simplified the logic for friend request confirmation
- 960e04a: added a function for stripping spaces from username
- 9a69cb0: Changed style of button a bit
- 5b32aba: domain tweaks
- 5e5a353: Removed unnecessary line that was previously to test something
- 22ff1c0: Changed logout button and linting
- ba7539a: add flip gifs for all about you survey
- 92f2f63: fixed production build config
- 6fd7204: terms and logout unit/smoke tests
- fce62db: adjust max text size
- c165180: update variables for responsive resizing in landscape mode
- 6f98a74: update media queries for resizing copy on game tiles
- 425ca0e: fixed hal link
- 8510117: stop sending too much to rollbar
- 6d4d8d3: fixed broken default profiles
- ee2f1ad: switch to status
- 76fe25c: removed bad init event
- 96a2723: added a comment
- c612d72: added extra margin for login fields
- 5d9a4c1: Merge with feature/Bugfixes-Gengar_CORE-956
- e6d2611: added alternating colors for background of game tiles on hover
- 3a5e863: switch to status
- 0cc65f0: added success message to display after adding a friend
- 9c0d1cb: added success message to display after adding a friend
- b148aa4: fixes
- 0768efd: Added message and got rid of import button
- b61832c: added unit tests for decoding perms method
- 35d140b: switch to return null for the timer if a user is not logged in
- d501f96: coverted method of rendering edit fields to decode permissions of each field individually and then render static or editable or not at all
- c837f1c: fixed unit
- 645d426: remove create user tests as that is not in edit class anymore
- 5acca76: linting
- 709eb0d: switch back to branch on failure
