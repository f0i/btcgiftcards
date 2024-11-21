import React, { useRef, useState } from "react";
import { Gift } from "../../declarations/backend/backend.did";
import { getTheme } from "./cardThemes";

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

      alert("Content copied to clipboard!!!");
    } catch (err) {
      console.error("Failed to copy content: ", err);
      alert("Failed to copy content.");
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
          <br />
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
          <strong>Message from {gift.sender}:</strong>
          <p>
            {gift.message.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </p>
        </div>
      ) : null}
    </div>
  );
};
