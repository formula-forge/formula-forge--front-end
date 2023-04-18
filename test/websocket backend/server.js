const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

// Map to store client connections
const clientTokens = { 123: "123", 456: "456" }; //这是用户的id和token
const clients = new Map(); //这是用户的id和websocket的映射

wss.on("connection", (ws) => {
  let clientID = null;
  let targetId = null; //目标的id
  let targetType = null; //目标的类型, 是用户还是群组
  // Handle incoming messages from the client
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "connect-to-friend") {
        if (!data.clientID) {
          //参数不完整, 终止连接
          console.log(`参数不完整, 终止连接 ${data.clientID}!`);
          ws.close();
          return;
        }
        if (data.token !== clientTokens[data.clientID]) {
          //token不匹配, 终止连接
          console.log("token不匹配, 终止连接");
          ws.close();
          return;
        }
        clientID = data.clientID;
        targetType = "friend";
        targetId = data.friendID;
        clients.set(data.clientID, ws); //将用户id和websocket连接存储起来
        console.log(`successfully connected with ${data.clientID}!`);
      } else if (data.type === "connect-to-group") {
        //TODO
      } else if (data.type === "message") {
        clients.forEach((client, clientId) => {
          if (clientId === targetId) {
            client.send(`${message}`);
            console.log(`${clientID} send message to ${targetId}: ${message}`);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  // Handle disconnections
  ws.on("close", () => {
    console.log(`Client disconnected with ${clientID}`);

    // Remove the client from the map
    clients.delete(clientID);
  });
});
