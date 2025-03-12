import { useAuth } from "./use-auth-client";
import TopNav from "./components/TopNav";
import { BsArrowDownCircle, BsQuote } from "react-icons/bs";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";

function Landing() {
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/create");
  }

  return (
    <>
      <TopNav tab="new" />
      <div className="banner py-16">
        <h1 className="text-[4rem] lg:text-[9rem] font-thin text-center mb-4 lg:mb-32 mt-0 lg:px-8 lg:mt-16 text-gray-800">
          Bitcoin Gift&nbsp;Cards
        </h1>

        <p className="text-xl text-gray-700 w-max-center text-center m-auto">
          <span className="hidden lg:block">
            Send your friends and family the gift of Bitcoin with a simple,
            easy-to-use gift card.
          </span>
          <br />
          The perfect way to introduce loved ones to the world of digital
          currency.
        </p>
        <div className="m-auto flex flex-col md:flex-row gap-2 mt-16 justify-center items-center">
          <div className="text-center w-64 mt-8 md:mt-0">
            Get started by creating
            <br />
            your first gift card.
            <br />
            <Button
              onClick={login}
              size="lg"
              variant="cta"
              className="w-64 mt-8 lg:mt-16"
            >
              Create a New Gift Card
            </Button>
          </div>
          <div className="hidden md:flex w-12 flex-col items-center text-gray-400 text-nowrap">
            <div className="border w-0 h-10 grow" />
            or
            <div className="border w-0 h-10 grow" />
          </div>
          <div className="text-center w-64 mt-8 md:mt-0">
            Already have a gift card?
            <br />
            Redeem it here!
            <Button
              onClick={login}
              size="lg"
              variant="cta"
              className="w-64 mt-8 lg:mt-16"
            >
              Redeem Your Gift Card
            </Button>
          </div>
        </div>
        <a href="#more">
          <BsArrowDownCircle className="m-auto text-4xl text-gray-500 mt-8" />
        </a>
        <a id="more" />
      </div>

      <div className="row">
        <div className="w-max-center text-xl py-8 text-center">
          <h2 className="text-center w-full pt-4">How it works</h2>
        </div>
        <div className="w-max-center py-8 text-center">
          <div className="w-max-center grid grid-cols-1 lg:grid-cols-4 gap-4">
            <p>
              <img
                src="/external/bitcoin.svg"
                className="object-fit py-4 w-24 h-24"
              />
              <h3>Gift Bitcoin Easily</h3>
              Send Bitcoin as a gift with just a few clicks. Personalize your
              gift card and share the power of digital currency with anyone.
            </p>
            <p>
              <img
                src="/external/ckbtc.svg"
                className="object-fit py-4 w-24 h-24"
              />
              <h3> Powered by ckBTC</h3>
              Enjoy low transaction fees and fast transfers using ckBTC, a token
              fully on-chain and backed by real Bitcoin.
            </p>
            <p>
              <img
                src="/external/google.svg"
                className="object-fit py-4 w-24 h-24"
              />
              <h3>Email Verification with&nbsp;Google</h3>
              Protect your gift cards with Google Sign-In. Only the recipient
              can access and redeem the Bitcoin securely.
            </p>
            <p>
              <img
                src="/external/icp.svg"
                className="object-fit py-4 w-24 h-24"
              />
              <h3>Built on the Internet&nbsp;Computer</h3>
              Experience the speed, security, and scalability of the Internet
              Computer blockchain, enabling seamless Bitcoin transactions.
            </p>
          </div>
          <br />

          <a className="button" href="/learn">
            Learn More About How It Works
          </a>
        </div>
      </div>

      <div className="row bg-gray-100">
        <div className="w-max-center py-8 text-center">
          <h2 className="text-center w-full pt-4">What our users are saying</h2>
        </div>
        <div className="w-max-center pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-between">
          <div className="flex-1 handwritten max-w-52 text-lg">
            <BsQuote />
            This Gift Card is the gateway to exploring Bitcoin firsthand.
          </div>
          <div className="flex-1 handwritten max-w-52 text-lg hidden lg:block">
            <BsQuote />
            Now I have some Bitcoin. What can I do with it?
          </div>
          <div className="flex-1 handwritten max-w-52 text-lg">
            <BsQuote />
            The easiest way to begin your crypto journey - one gift at a time.
          </div>
          <div className="flex-1 handwritten max-w-52 text-lg hidden sm:block">
            <BsQuote />
            Confusion is just the beginning. I’m ready to turn it into
            understanding!
          </div>
          <div className="flex-1 handwritten max-w-52 text-lg">
            <BsQuote />
            Turn a simple gift into your first step toward mastering Bitcoin.
          </div>
        </div>
        <p className="w-max-center text-center text-sm text-gray-600">
          Join the first customers who trust BTC Gift Cards
        </p>
      </div>

      <div className="w-max-center text-xl py-8 text-center">
        <h2 className="text-center w-full pt-4">Upcoming occations</h2>
      </div>
      {/*
      <ImageTextCTA
        title="New Year Bitcoin Gift Card"
        text="Start the New Year with a unique and valuable gift! Send a personalized BTC Gift Card with festive designs and a custom message."
        img="/visuals/fireworks-paper-orange-green.jpeg"
        cta="Create a New Year Gift Card"
        imageRight={false}
      />
      */}

      <ImageTextCTA
        title="Easter Bitcoin Gift Card"
        text="Celebrate Easter with a gift that lasts! Send a personalized Bitcoin Gift Card with festive designs and a heartfelt message—perfect for friends and family."
        img="/visuals/easter-paper-orange-green.jpeg"
        cta="Create an Easter Gift Card"
        imageRight={false}
      />

      <ImageTextCTA
        title="Wedding Bitcoin Gift Card"
        text="Celebrate love with a gift that lasts forever! Send a BTC Gift Card as a meaningful and timeless wedding present."
        img="/visuals/wedding-paper-orange-green.jpeg"
        cta="Create a Wedding Gift Card"
        imageRight={true}
        className="bg-gray-100"
      />

      <ImageTextCTA
        title="A Gift Card for Someone Special"
        text="Show your love and appreciation with a heartfelt Bitcoin Gift Card. Add a personal message and make it a meaningful gift for someone special."
        img="/visuals/valentine-paper-orange.jpeg"
        cta="Create a Special Gift"
        imageRight={false}
      />

      <div className="row bg-gray-100">
        <div className="w-max-center py-8">
          <h2 className="text-center text-2xl pb-8">
            The perfect gift for any occation
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <img
              src="/visuals/easter-paper-orange-green.jpeg"
              className="w-full rounded"
            />
            <img
              src="/visuals/birthday-paper-orange.jpeg"
              className="w-full rounded"
            />
            <img
              src="/visuals/graduation-paper-orange.jpeg"
              className="w-full rounded"
            />
            <img
              src="/visuals/party-paper-orange-green.jpeg"
              className="w-full rounded"
            />
          </div>
        </div>
        <div className="w-max-center text-center">
          <Button
            variant="cta"
            size="lg"
            onClick={login}
            className="w-full lg:w-2/3 max-w-md m-auto lg:m-0"
          >
            Create Your Gift Card
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const ImageTextCTA = ({
  title,
  text,
  cta,
  img,
  imageRight,
  className,
}: {
  title: string;
  text: string;
  cta: string;
  img: string;
  imageRight: boolean;
  className?: string;
}) => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={"pt-8" + (className ? " " + className : "")}>
      <div
        className={
          "w-max-center pb-8 flex flex-col lg:flex-row gap-4" +
          (imageRight ? " lg:flex-row-reverse" : "")
        }
      >
        <img
          src={img}
          className="w-full max-w-full lg:w-1/2 rounded object-cover"
        />
        <div className="w-full lg:w-1/2 px-4 sm:px-8 py-4 flex flex-col text-lg">
          <div className="grow" />
          <h2>{title}</h2>
          <p className="w-2/3 py-8">{text}</p>
          <Button
            variant="cta"
            size="lg"
            onClick={isAuthenticated ? () => navigate("/account") : login}
            className="w-full lg:w-2/3 max-w-md m-auto lg:m-0"
          >
            {cta}
          </Button>
          <div className="grow" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
