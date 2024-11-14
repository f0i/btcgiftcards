import React, { useState } from "react";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
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

export default CopyButton;
