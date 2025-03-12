import React, { useRef, useState } from "react";
import { Gift } from "../../declarations/backend/backend.did";
import { getTheme, ThemeKey } from "./cardThemes";
import toast, { Toast } from "react-hot-toast";
import { formatCurrency, shortenErr } from "./utils";
import { Button } from "./components/ui/button";
import EmailTemplate from "./email/EmailTemplate";
import { Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = "Copy",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        console.log("Copied to clipboard:", textToCopy);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
    setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5 seconds
  };

  return (
    <Button onClick={handleCopy} variant="outline" size="sm" className="">
      {isCopied ? (
        "Copied!"
      ) : label === "copy" ? (
        <Copy className="h-4 w-4" />
      ) : (
        label
      )}
    </Button>
  );
};

export const CopyFormattedContent = ({
  gift,
  isPreview,
}: {
  gift: Gift;
  isPreview?: boolean;
}) => {
  const [emailHtml, setEmailHtml] = useState("");

  const handleCopy = async () => {
    if (isPreview) {
      toast.error("Link to redeem is not available in preview.");
      return;
    }
    try {
      const htmlContent = emailHtml;
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

  return (
    <div>
      <Button onClick={handleCopy} variant={isPreview ? "ghost" : "outline"}>
        Copy gift card
      </Button>
      {gift ? (
        // hidden div to generate html content for copy button
        <div ref={hiddenDivRef} style={{ display: "none" }} className="border">
          <EmailTemplate
            recipientName={gift.to}
            amount={formatCurrency(gift.amount, 10000000, 0)}
            value={formatCurrency(gift.amount, 1000, 2)}
            senderName={gift.sender}
            customMessage={gift.message}
            theme={gift.design as ThemeKey}
            redeemPath={"/show/" + gift.id}
            onChange={setEmailHtml}
          />
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
