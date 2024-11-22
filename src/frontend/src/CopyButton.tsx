import React, { useRef, useState } from "react";
import { Gift } from "../../declarations/backend/backend.did";
import { getTheme } from "./cardThemes";
import toast, { Toast } from "react-hot-toast";
import { shortenErr } from "./utils";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = "Copy",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const oldHandleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleCopy = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        console.log("Copied to clipboard:", textToCopy);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <button onClick={handleCopy} className="button-sm">
      {isCopied ? "Copied!" : label}
    </button>
  );
};

export const CopyFormattedContent = ({ gift }: { gift: Gift }) => {
  const handleCopy = async () => {
    try {
      const htmlContent = hiddenDivRef.current?.innerHTML;
      const textContent = hiddenDivRef.current?.innerText;

      if (!htmlContent || !textContent) {
        throw new Error("No content to copy");
      }

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([textContent], { type: "text/plain" }),
        }),
      ]);

      toast.success("Content copied to clipboard!");
    } catch (err: any) {
      console.error("Failed to copy content: ", err);
      toast.error("Failed to copy content: \n" + shortenErr(err));
    }
  };

  const hiddenDivRef = useRef<HTMLDivElement>(null);
  const theme = getTheme(gift?.design || "");
  const imageUrl = "https://btc-gift-cards.com" + theme.cover;
  const linkUrl = "https://btc-gift-cards.com/show/" + gift?.id;

  return (
    <div>
      <button onClick={handleCopy} className="button">
        Copy gift card
      </button>
      {gift ? (
        // hidden div to generate html content for copy button
        <div ref={hiddenDivRef} style={{ display: "none" }} className="border">
          You received a gift from {gift.sender}:
          <p>
            <img src={imageUrl} alt="Card" style={{ maxWidth: "500px" }} />
          </p>
          <p>
            Value: <strong>{gift.amount.toString()} ckSat</strong> (={" "}
            {Number(gift.amount) / 100000000.0} Bitcoin)
          </p>
          <br />
          <p>
            Visit the following link to redeem it:
            <br />
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
          </p>
          <br />
          <p>
            <strong>Message from {gift.sender}:</strong>
          </p>
          {gift.message.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const confirmDialog = ({
  msg,
  sub,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: {
  msg: string;
  sub?: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<void> => {
  return toast.promise(
    new Promise<void>((resolve, reject) => {
      toast(
        (t: Toast) => (
          <div>
            <p>{msg}</p>
            {sub && <p>{sub}</p>}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  reject("Cancel");
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  resolve();
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {confirmText}
              </button>
            </div>
          </div>
        ),
        { duration: Infinity },
      );
    }),
    {
      loading: "Please confirm...",
      success: "Confirmed",
      error: "Canceled",
    },
  );
};
