import {
  Gift,
  SendStatus,
  SendStatusEntry,
} from "../../declarations/backend/backend.did";
export type SendStatusKey = keyof SendStatus;

export const getSendStatus = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): SendStatus => {
  const s: SendStatusEntry = sendStatus.find((stat) => stat.id === gift.id) ?? {
    id: gift.id,
    status: { init: null },
  };
  return s.status;
};

export const statusKey = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): SendStatusKey => {
  let stat = getSendStatus(gift, sendStatus);
  const key = Object.keys(stat)[0] as keyof SendStatus;
  return key;
};

export const statusText = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): string => {
  return statusKey(gift, sendStatus);
};

export const isRevoked = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): boolean => {
  let s: SendStatusKey = statusKey(gift, sendStatus);

  const key = Object.keys(s)[0] as keyof SendStatus;

  switch (key) {
    case "revoked":
    case "revoking":
      return true;
    case "init":
    case "send":
    case "sendCanceled":
    case "claimed":
      return false;
  }

  return false;
};

export const isRefundable = (gift: Gift, refundable: string[]): boolean => {
  return refundable.indexOf(gift.id) >= 0;
};
