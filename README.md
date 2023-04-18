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
- 初步支持公式输入, `$...$ 与 $$...$$` 两种形式

### 23.4.18 2

修改了聊天页面的 WebSocket 代码大致的交互内容:(C-Client; S-Server, S 在接受消息后判断
其中的 type)

- 与好友聊天:
  - C: 初次建立连接,发送字符化的 message,内容如下:
  ```
  message = {
      type: "connect-to-friend",
      clientID: user,
      token: user, //用于验证身份的token, 由后端生成, 此处为测试用
      friendID: friend,
  };
  ```
  - S: 判断 type 为 "connect-to-friend" 后检查 token 是否正确, 错误则断开连接, 正确则
    将当前 C 加入已连接的列表, 且设置目标类型为好友
- 发送消息:
  - C: 发送字符化的 message,内容如下:
  ```
  const message = {
      type: "message",
      sender: user,
      receiver: friend,
      content: inputValue,
      timestamp: formattedDateTime,
    };
  ```
  - S: 判断 type 为"message"后:
    - 若当前的目标类型为好友, 则检查已连接列表内是否有目标, 有则向该 C 发送相同的
      message, 没有的情况我暂时没考虑
    - 若当前的目标类型为群组, 则向在该群组内的 C 发送消息

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

_暂时将 build 产生的根目录设为"./", 如此可使 build 里的 intex.html 能够直接在本地运行_

## 其余的指令暂时弃用
