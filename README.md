## 应用简介:

### 功能:

一个支持 latex 公式的聊天软件, 目前计划开发 web 端

### 框架:

这是一个使用 React 框架搭建的 web 应用前端

## 更新进度:

### 23.4.18

构建了好友列表与聊天界面

- 好友列表是硬编码的, 存储在 src\components\FriendList\test.json
- 聊天记录是本地存储的, 初始值硬编码, 存储在 src\components\Chat\test.json
- userID 与用户昵称的对应是硬编码的, 存储在 src\assets\userID\test.json

## 下面是 React 开发自带的 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for more
information.

_暂时将 build 产生的根目录设为"./", 如此可使 build 里的 intex.html 能够直接在本地运
行_

## 其余的指令暂时弃用
