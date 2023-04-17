import FriendDataService from "../../services/friend-service";
import React, { useState, useEffect } from "react";
import test from "./test.json";
import OneFriend from "./oneFriend";
import { nanoid } from "nanoid";

const friendsData = test.friends;

function FriendList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFriends(friendsData);
  }, []);

  const allFriends = friends.map((friend) => {
    return (
      <OneFriend
        name={friend.nickname ? friend.nickname : friend.name}
        id={friend.id}
        avatar={friend.avatar}
        key={nanoid()}
      />
    );
  });
  return <div className="friend-list">{allFriends}</div>;
}

export default FriendList;
