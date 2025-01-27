import { Gift, SendStatus } from "../../declarations/backend/backend.did";

export const getSendStatus = (
  gift: Gift,
  sendStatus: SendStatus[],
): SendStatus => {
  const status = sendStatus.find((stat) => stat.id === gift.id) ?? {
    id: gift.id,
    status: "unknown",
  };
  return status;
};

export const status = (gift: Gift, sendStatus: SendStatus[]): string => {
  let stat = getSendStatus(gift, sendStatus);
  switch (stat.status) {
    case "cardRevoked":
    case "cardRevoking":
      return "revoked";
    case "init":
    case "sendCancel":
      return "new";
    default:
      return stat.status;
  }
};

export const isRevoked = (gift: Gift, sendStatus: SendStatus[]): boolean => {
  return status(gift, sendStatus) === "revoked";
};

export const isRefundable = (gift: Gift, refundable: string[]): boolean => {
  return refundable.indexOf(gift.id) >= 0;
};
