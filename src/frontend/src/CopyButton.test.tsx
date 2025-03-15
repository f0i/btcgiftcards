import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton, CopyFormattedContent, confirmDialog } from "./CopyButton";
import toast from "react-hot-toast";
import { Gift } from "../../declarations/backend/backend.did";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => {
  const mockToast = vi.fn();
  return {
    __esModule: true,
    default: Object.assign(mockToast, {
      promise: vi.fn((promise) => promise),
      success: vi.fn(),
      error: vi.fn(),
      dismiss: vi.fn(),
    }),
  };
});

beforeAll(() => {
  (global as any).ClipboardItem = class {
    constructor() {}
  };
});

describe("CopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
        write: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders with default label", () => {
    render(<CopyButton textToCopy="test content" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<CopyButton textToCopy="test content" label="Custom Label" />);
    expect(
      screen.getByRole("button", { name: /custom label/i }),
    ).toBeInTheDocument();
  });

  it("copies text to clipboard on click", async () => {
    render(<CopyButton textToCopy="test content" />);

    const button = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test content");
  });

  it('shows "Copied!" text temporarily after copying', async () => {
    render(<CopyButton textToCopy="test content" />);

    const button = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(button);
    });

    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});

describe("CopyFormattedContent", () => {
  const mockGift: Gift = {
    id: "test123",
    creator: { _arr: new Uint8Array([1]) } as any,
    to: "test@example.com",
    sender: "Test Sender",
    message: "Test message",
    amount: 1000n,
    created: 1234567890n,
    design: "default",
  };

  it("renders copy button with default label", () => {
    render(<CopyFormattedContent gift={mockGift} />);
    expect(
      screen.getByRole("button", { name: /copy gift card/i }),
    ).toBeInTheDocument();
  });

  it("shows error toast when copying in preview mode", async () => {
    render(<CopyFormattedContent gift={mockGift} isPreview={true} />);

    const button = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(button);
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("not available in preview"),
    );
  });

  it("copies formatted content to clipboard", async () => {
    render(<CopyFormattedContent gift={mockGift} />);

    const button = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(button);
    });

    expect(navigator.clipboard.write).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Content copied to clipboard!");
  });
});

describe("confirmDialog", () => {
  it("shows confirmation dialog with custom message", async () => {
    const message = "Are you sure?";
    const subMessage = "This action cannot be undone";

    // Mock toast.promise to resolve immediately
    const mockPromise = Promise.resolve();
    (toast.promise as any).mockReturnValue(mockPromise);

    const result = confirmDialog({ msg: message, sub: subMessage });
    expect(result).toBeInstanceOf(Promise);

    // Wait for promise to resolve
    await result;

    expect(toast.promise).toHaveBeenCalled();
  });
});
