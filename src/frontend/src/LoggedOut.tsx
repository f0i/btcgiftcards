import React from "react";
import { useAuth } from "./use-auth-client";
import Logo from "./components/Logo";
import TopNav from "./components/TopNav";
import { BsArrowDownCircle, BsDiscord, BsTwitterX } from "react-icons/bs";
import Footer from "./Footer";

function LoggedOut() {
  const { login } = useAuth();

  return (
    <>
      <TopNav tab="new" />
      <div className="banner py-16">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          <Logo /> Bitcoin Gift Cards 🥂
        </h1>

        <p className="text-lg text-gray-700 text-center max-w-md m-auto">
          Start the year with Bitcoin!
          <br />
          Send your friends and family the gift of Bitcoin with a simple,
          easy-to-use gift card. The perfect way to introduce loved ones to the
          world of digital currency.
        </p>
        <div className="m-auto flex flex-row gap-2 mt-16 justify-center">
          <div className="text-center w-64">
            Get started by creating
            <br />
            your first gift card
            <br />
            <button
              onClick={login}
              className="w-60 mt-16 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
            >
              Create a New Gift Card
            </button>
          </div>
          <div className="w-12 flex flex-col items-center text-gray-400 text-nowrap">
            <div className="border w-0 h-10 grow" />
            or
            <div className="border w-0 h-10 grow" />
          </div>
          <div className="text-center w-64">
            Already have a gift card?
            <br />
            Redeem it here!
            <button
              onClick={login}
              className="w-60 mt-16 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
            >
              Redeem Your Gift Card
            </button>
          </div>
        </div>
        <a href="#more">
          <BsArrowDownCircle className="m-auto text-4xl text-gray-500 mt-8" />
        </a>
        <a id="more" />
      </div>

      <div className="row bg-gray-100">
        <div className="video-container aspect-video w-max-center">
          <iframe
            className="m-auto"
            src="https://www.youtube.com/embed/KhSwGzRhYc0?si=9bN7uvKF4UO9EiI-&amp;start=2733"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="w-max-center pb-8 flex flex-row gap-x-8 justify-between">
          <div className="flex-1 handwritten max-w-52">
            This Gift Card is the gateway to exploring Bitcoin firsthand.
          </div>
          <div className="flex-1 handwritten max-w-52 hidden lg:block">
            Now I have some Bitcoin. What can I do with it?
          </div>
          <div className="flex-1 handwritten max-w-52">
            The easiest way to begin your crypto journey - one gift at a time.
          </div>
          <div className="flex-1 handwritten max-w-52 hidden sm:block">
            Confusion is just the beginning. I’m ready to turn it into
            understanding!
          </div>
          <div className="flex-1 handwritten max-w-52">
            Turn a simple gift into your first step toward mastering Bitcoin.
          </div>
        </div>
        <p className="w-max-center text-center text-sm text-gray-600">
          Join the first customers who trust BTC Gift Cards
        </p>
      </div>

      <div className="row bg-gray-100">
        <div className="w-max-center text-xl py-8 text-center">
          <h2 className="text-center w-full pt-4">How it works</h2>
        </div>
        <div className="w-max-center py-8 text-center">
          <div className="w-max-center grid grid-cols-4 gap-4">
            <img
              src="/external/bitcoin.svg"
              className="object-cover py-4 w-full max-w-32"
            />
            <img
              src="/external/ckbtc.svg"
              className="object-cover py-4 w-full max-w-32"
            />
            <img
              src="/external/google.svg"
              className="object-cover py-4 w-full max-w-32"
            />
            <img
              src="/external/icp.svg"
              className="object-cover py-4 w-full max-w-32"
            />
            <p>
              <h3>Gift Bitcoin Easily</h3>
              Send Bitcoin as a gift with just a few clicks. Personalize your
              gift card and share the power of digital currency with anyone.
            </p>
            <p>
              <h3> Powered by ckBTC</h3>
              Enjoy low transaction fees and fast transfers using ckBTC, a token
              fully on-chain and backed by real Bitcoin.
            </p>
            <p>
              <h3>Email Verification with Google</h3>
              Protect your gift cards with Google Sign-In. Only the recipient
              can access and redeem the Bitcoin securely.
            </p>
            <p>
              <h3>Built on the Internet Computer</h3>
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

      <div className="w-max-center text-xl py-8 text-center">
        <h2 className="text-center w-full pt-4">Upcoming occations</h2>
      </div>

      <ImageTextCTA
        title="New Year Bitcoin Gift Card"
        text="Start the New Year with a unique and valuable gift! Send a personalized BTC Gift Card with festive designs and a custom message."
        img="/visuals/fireworks-paper-orange-green.jpeg"
        cta="Create a New Year Gift Card"
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
        title="Valentine’s Day BTC Gift Card"
        text="This Valentine’s Day, show your love with a special gift! Personalize a BTC Gift Card with romantic designs and a heartfelt message for someone special."
        img="/visuals/valentine-paper-orange.jpeg"
        cta="Create a Valentine’s Gift Card"
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
          <button
            onClick={login}
            className="w-full lg:w-2/3 max-w-md m-auto lg:m-0 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            Create Your Gift Card
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

const FeatureIconText = ({}: {}) => {
  return null;
};

const ImageTextCTA = ({
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
  const { login } = useAuth();

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
        <div className="w-full lg:w-1/2 px-8 py-4 flex flex-col text-lg">
          <div className="grow" />
          <h2>{title}</h2>
          <p className="w-2/3 py-8">{text}</p>
          <button
            onClick={login}
            className="w-full lg:w-2/3 max-w-md m-auto lg:m-0 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            {cta}
          </button>
          <div className="grow" />
        </div>
      </div>
    </div>
  );
};

export default LoggedOut;
