import { Principal } from "@dfinity/principal";
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
  const s = statusKey(gift, sendStatus);
  if (s === "init") return "created";
  return s;
};

export const isRevoked = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): boolean => {
  let key: SendStatusKey = statusKey(gift, sendStatus);

  switch (key) {
    case "revoked":
    case "revoking":
      return true;
    case "init":
    case "sendCanceled":
    case "sendRequested":
    case "send":
    case "claimed":
      return false;
  }

  return false;
};

export const isClaimed = (
  gift: Gift,
  sendStatus: SendStatusEntry[],
): boolean => {
  let key: SendStatusKey = statusKey(gift, sendStatus);

  switch (key) {
    case "revoked":
    case "revoking":
    case "init":
    case "sendCanceled":
    case "sendRequested":
    case "send":
      return false;
    case "claimed":
      return true;
  }

  return false;
};

export const canRequestSend = (
  principal: Principal,
  gift: Gift,
  sendStatus: SendStatusEntry[],
): boolean => {
  if (principal.toString() !== gift.creator.toString()) return false;
  let key: SendStatusKey = statusKey(gift, sendStatus);

  switch (key) {
    case "init":
    case "sendCanceled":
      return true;
    case "revoked":
    case "revoking":
    case "sendRequested":
    case "send":
    case "claimed":
      return false;
  }

  return false;
};

export const canCancelSend = (
  principal: Principal,
  gift: Gift,
  sendStatus: SendStatusEntry[],
): boolean => {
  if (principal.toString() !== gift.creator.toString()) return false;
  let key: SendStatusKey = statusKey(gift, sendStatus);

  switch (key) {
    case "sendRequested":
      return true;
    case "revoked":
    case "revoking":
    case "init":
    case "sendCanceled":
    case "send":
    case "claimed":
      return false;
  }

  return false;
};

export const isRefundable = (gift: Gift, refundable: string[]): boolean => {
  return refundable.indexOf(gift.id) >= 0;
};
