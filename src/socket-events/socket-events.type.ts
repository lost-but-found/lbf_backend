export enum SocketEvents {
  JoinChats = "join-chats",
  CreateChat = "create-chat",
  JoinNewChat = "join-new-chat",
  ReceiveJoinNewChat = "receive-join-new-chat",
  RemoveChat = "remove-chat",
  ReceiveRemoveChat = "receive-remove-chat",
  IsOnline = "is-online",
  ReceiveIsOnline = "receive-is-online",
  IsOffline = "is-offline",
  Typing = "typing",
  ReceiveTyping = "receive-typing",
  StopTyping = "stop-typing",
  ReceiveStopTyping = "receive-stop-typing",
  SendMessage = "send-message",
  ReceiveMessage = "receive-message",
  ViewUnreadMessages = "view-unread-messages",
  ReceiveViewUnreadMessages = "receive-view-unread-messages",
}