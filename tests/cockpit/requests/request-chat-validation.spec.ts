import { test, expect } from "../../fixtures/roles.fixture";
import { RequestChatPage } from "../../../pages/request/request-chat.page";
import { REQUEST_CHAT_DATA } from "../../data/request.testdata";

test("Admin & User can see each other chat and reply", async ({
  adminPage,
  userPage,
}) => {
  await adminPage.goto("/spaces");
  await userPage.goto("/spaces");
  const adminChat = new RequestChatPage(adminPage);
  const userChat = new RequestChatPage(userPage);

  // ======================================
  // 🔐 ADMIN SENDS MESSAGE
  // ======================================
  await adminChat.navigateToCockpitRequest(REQUEST_CHAT_DATA.requestId);

  await adminChat.sendMessage(REQUEST_CHAT_DATA.adminMessage);

  await expect(
    adminChat.messageBubble(REQUEST_CHAT_DATA.adminMessage),
  ).toBeVisible();

  // ======================================
  // 👤 USER SEES ADMIN MESSAGE
  // ======================================
  await userChat.openSupportTickets();

  await userChat.searchRequest(REQUEST_CHAT_DATA.requestTitle);
  await userChat.openRequest(REQUEST_CHAT_DATA.requestTitle);

  await expect(
    userChat.messageBubble(REQUEST_CHAT_DATA.adminMessage),
  ).toBeVisible();

  // ======================================
  // 👤 USER REPLIES
  // ======================================
  await userChat.sendMessage(REQUEST_CHAT_DATA.userReply);

  await expect(
    userChat.messageBubble(REQUEST_CHAT_DATA.userReply),
  ).toBeVisible();

  // ======================================
  // 🔐 ADMIN SEES USER REPLY
  // ======================================
  await adminPage.reload();
  await adminPage.waitForLoadState("networkidle");

  await expect(
    adminChat.messageBubble(REQUEST_CHAT_DATA.userReply),
  ).toBeVisible();

  // ======================================
  // 🔐 ADMIN REPLIES AGAIN
  // ======================================
  await adminChat.sendMessage(REQUEST_CHAT_DATA.adminReply);

  await expect(
    adminChat.messageBubble(REQUEST_CHAT_DATA.adminReply),
  ).toBeVisible();

  // ======================================
  // 👤 USER SEES ADMIN REPLY
  // ======================================
  await userPage.reload();
  await userChat.openRequest(REQUEST_CHAT_DATA.requestTitle);

  await userPage.waitForLoadState("networkidle");

  await expect(
    userChat.messageBubble(REQUEST_CHAT_DATA.adminReply),
  ).toBeVisible();
});
