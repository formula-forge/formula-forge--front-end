## Application Introduction

This is an online chat application which supports latex formula. The project is the
front-end of the application.

### Functions

- :white_check_mark: Register & Login
- :white_check_mark: Chat
  - :white_check_mark: Send text and latex formula
  - :white_check_mark: Chat history
  - :white_check_mark: Recnet chat list
  - :white_check_mark: Chat with friends & groups
- :white_check_mark: Friend
  - :white_check_mark: Add friend
  - :white_check_mark: Delete friend
  - :white_check_mark: Friend list
- :white_check_mark: Group
  - :white_check_mark: Create group
  - :white_check_mark: Delete group
  - :white_check_mark: Group list
  - :white_check_mark: Manage members
- :white_check_mark: Formula
  - :white_check_mark:Write `$` or `$$` to wrap latex formula
  - :white_check_mark: Edit your own stored formula just like emoji

### Tech Stack

This project is built with React.

In the project directory, you can run:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

`npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

The root directory of the project is currently set to `./`, so that you can deploy it
on your computer directly instead of having to upload it to a server.

NOTE: You can't get access to the back-end server, so actually you can't see anything
on your computer.\
If you want to know what the project looks like, this is our video (sorry that it is in
Chinese):

https://github.com/formula-forge/formula-forge--front-end/assets/127286614/5dad316d-7d00-496e-adc4-2c42c7f08e99

### How does the formulas be rendered

We use [MathJax](https://www.mathjax.org/) scripts to render the formulas.

In each chat session, we create a boolean React State `scriptTrigger` as a trigger
for rerendering. By using `useEffect()`, we can rerender the formulas when the State
changes. The formulas are rendered at the first time the chat session is opened. The
State's set function is delivered to `Typebox.js`. When the user sends a message,
`Typebox.js` sets the State to the opposite value, which triggers the rerendering.

Because React rerenders the page when a parent component's State is changed, the
formulas change into their original texts when the user switch the navigation bar. We
can solve this problem easily, but this leads to high render cost. Thus we simply
regard this as a feature. Also, this allows the user to inspect and copy the original
texts of the formulas.

### Project Structure

```bash
.
├── README.md
├── package-lock.json
├── package.json
├── formula.mp4 # A video showing how to use the formula feature
├── public # The default directory for React, containing icons.
├── build # The result of `npm run build`
└── src
    ├── App.css # The css file for App.js
    ├── App.js # The main component of the project
    ├── Context.js # Create the context used in the project. The context will provide the current user information for the opened windows. For example, provide the user id for the add friend window.
    ├── index.css # Basic css file, not many styles are defined here
    ├── index.js # The entry of the project
    ├── assets # The directory for images and test files
    ├── components # The directory for components
    |   ├── Add # The component for adding friends
    |   ├── Chat # The component for chatting with friends or groups
    |   ├── ChatList # Recent chat list
    |   ├── ContextMenu
    |   |   ├── SessionMenu.js # The right click menu for deleting a session
    |   |   └── SessionMenu.css
    |   ├── FriendList # Displaying friend list
    |   ├── GroupConfig # Creating or editing a group and managing members
    |   ├── GroupList # Displaying group list
    |   ├── Log
    |   ├── Register
    |   ├── ResetPassword
    |   ├── Setting # The user settings
    |   └── Users # The component for displaying user information
    |       ├── UserAvatar.js # Displaying user avatar. It is used in various places.
    |       ├── UserAvatar.css
    |       ├── UserInfo.js # A window displaying user name and status. You can add friends with the user in this window.
    |       └── UserInfo.css
    └── services # The directory for services
        ├── http-common.js # The axios instance
        ├── http-img.js # The axios instance for uploading images
        └── ... # The services for different APIs
```
