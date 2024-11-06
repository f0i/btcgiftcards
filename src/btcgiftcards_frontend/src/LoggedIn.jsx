import { useState } from "react";
import { useAuth } from "./use-auth-client";

function LoggedIn() {
  const [result, setResult] = useState("");
  const [giftcards, setGiftcards] = useState({
    created: [],
    email: [],
    received: [],
  });

  const { backendActor, logout } = useAuth();

  const listGiftcards = async () => {
    const res = await backendActor.listGiftcards();
    console.log(res);
    setGiftcards(res);
  };

  const handleClick = async () => {
    const email = "icidentify@gmail.com";
    const res = await backendActor.verifyEmail(email);
    console.log(res);
    setResult(JSON.stringify(res));
    if ("ok" in res) await listGiftcards();
  };

  function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const amount = 10000;
    const name = event.target.elements.name.value;
    const message = event.target.elements.message.value;
    backendActor
      .createGiftCard(email, amount, name, message)
      .then((greeting) => {
        console.log(greeting);
        if ("ok" in greeting) setResult(JSON.stringify(greeting.ok));
        else setResult("" + greeting.err);
      })
      .catch((err) => {
        console.log(err);
        setGreeting("" + err);
      });
    return false;
  }

  return (
    <div className="container">
      <button id="logout" onClick={logout}>
        log out
      </button>
      <button id="list" onClick={listGiftcards}>
        list
      </button>
      <button id="list" onClick={handleClick}>
        verify
      </button>
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <label htmlFor="email">Recipient Email: &nbsp;</label>
        <input id="email" alt="Name" type="text" />
        <label htmlFor="message">Enter a message: &nbsp;</label>
        <textarea id="message" rows="5" alt="Name" type="text" />
        <button type="submit">Create Giftcard!</button>
      </form>
      <section id="giftcard">{result}</section>
      <section id="giftcards">{JSON.stringify(giftcards)}</section>
    </div>
  );
}

export default LoggedIn;
