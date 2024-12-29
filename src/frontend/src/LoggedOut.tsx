import React from "react";
import { useAuth } from "./use-auth-client";
import Logo from "./components/Logo";
import TopNav from "./components/TopNav";
import {
  BsArrowDownCircle,
  BsChevronCompactDown,
  BsDiscord,
  BsInstagram,
  BsTicket,
  BsTiktok,
  BsTwitterX,
  BsX,
} from "react-icons/bs";

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
          Just in time for the new year!
          <br />
          Gift your friends and family the joy of Bitcoin with a simple,
          easy-to-use gift card.
          <br />
          Perfect for introducing loved ones to Bitcoin.
          <div className="flex flex-row gap-4">
            <button
              onClick={login}
              className="w-60 mt-20 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
            >
              Create a new Gift Card
            </button>
            <button
              onClick={login}
              className="w-60 mt-20 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
            >
              Redeem your Gift Card
            </button>
          </div>
          <a href="#more">
            <BsArrowDownCircle className="m-auto text-4xl text-gray-500 mt-8" />
          </a>
          <a id="more" />
        </p>
      </div>

      <div className="row bg-green-50">
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

      <div className="row bg-gray-100">
        <div className="w-max-center pb-8 flex flex-row gap-x-8 justify-between">
          <div className="flex-1 handwritten max-w-52">
            This Gift Card is the gateway to exploring Bitcoin firsthand.
          </div>
          <div className="flex-1 handwritten max-w-52">
            Now I have some Bitcoin. What can I do with it?
          </div>
          <div className="flex-1 handwritten max-w-52">
            The easiest way to begin your crypto journey - one gift at a time.
          </div>
          <div className="flex-1 handwritten max-w-52">
            Confusion is just the beginning. I’m ready to turn it into
            understanding!
          </div>
          <div className="flex-1 handwritten max-w-52">
            Turn a simple gift into your first step toward mastering Bitcoin.
          </div>
        </div>
        <p className="w-max-center text-center text-sm text-gray-600">
          Join one of the first customers who trust BTC Gift Cards
        </p>
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
        text="This Valentine’s Day, show your love with a gift that’s as timeless as Bitcoin! Personalize a BTC Gift Card with romantic designs and a heartfelt message for someone special."
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

      <div className="row footer bg-gray-700 text-gray-100">
        <div className="text-center text-lg">
          Connect With Us! &nbsp; &nbsp; &nbsp;
          <a href="https://x.com/f0i" target="_blank" className="px-2">
            <BsTwitterX className="inline-block" />
          </a>
          <a
            href="https://discordapp.com/users/f0i"
            target="_blank"
            className="px-2"
          >
            <BsDiscord className="inline-block" />
          </a>
        </div>
        <div className="w-max-center border-top border-bottom">
          <ul>
            <li>
              <a href="https://cubeworksgmbh.de/impressum">Imprint</a>
            </li>
            <li>
              <a href="https://cubeworksgmbh.de/impressum">Legal</a>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-200 text-center mt-6">
          I'd love to hear your feedback and suggestions via{" "}
          <a
            href="https://discordapp.com/users/f0i"
            target="_blank"
            className="link"
          >
            @f0i on Discord
          </a>
          . Thanks for checking it out!
        </p>
      </div>
    </>
  );
}

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
