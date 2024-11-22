import React from "react";
import { useAuth } from "./use-auth-client";

function LoggedOut() {
  const { login } = useAuth();

  return (
    <div className="main">
      <div className="content max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          🎄 BTC Gift Cards
        </h1>

        <p className="text-lg text-gray-700 text-center mb-6">
          Just in time for the holidays! Gift your friends and family the joy of
          Bitcoin with a simple, easy-to-use BTC gift card. Perfect for
          introducing loved ones to crypto and the Internet Computer ecosystem.
        </p>

        <div className="warning">
          ⚠️ <strong>Warning:</strong> The project is still under active
          development. Please avoid loading large amounts onto the gift cards at
          this stage, as there is a risk of funds being lost.
        </div>

        <button
          onClick={login}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 mb-4"
        >
          Sign In with Google
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
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
    </div>
  );
}

export default LoggedOut;
