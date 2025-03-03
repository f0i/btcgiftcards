import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ClipboardList, Send, Eye } from "lucide-react";

export default function CreateGiftCardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <Card className="p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Create a Bitcoin Gift Card</h1>
          <p className="text-gray-600 max-w-2xl">
            Bitcoin Gift Cards allow you to send Bitcoin or ckBTC as a gift.
            Follow these steps to create your own Bitcoin Gift Card.
          </p>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Info className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 1: Ensure You Have ckBTC
              </h3>
              <p className="text-gray-600">
                Before creating a gift card, make sure you have ckBTC deposited
                in your account. If not, follow the steps to deposit ckBTC
                first.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <ClipboardList className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 2: Enter Gift Card Details
              </h3>
              <p className="text-gray-600">
                Navigate to the "Create" page, fill in the recipient's email
                address, select the Bitcoin or ckBTC amount, and add a personal
                message.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Eye className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Step 3: Preview Your Gift Card
              </h3>
              <p className="text-gray-600">
                Before finalizing, check the preview to ensure all details are
                correct.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex gap-4 items-start">
            <Send className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Step 4: Create and Send</h3>
              <p className="text-gray-600">
                Click the "Create" button to generate your Bitcoin Gift Card.
                Once created, it will appear in your list of gift cards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button className="px-6 py-3 text-lg">Create a Gift Card</Button>
      </div>
    </div>
  );
}
