import { useState } from "react";
import { useAuth } from "./use-auth-client";

function LoggedIn() {
  const [result, setResult] = useState("");

  const { backendActor, logout } = useAuth();

  const handleClick = async () => {
    const res = await backendActor.listCards();
    setResult(res);
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
    </div>
  );
}

export default LoggedIn;
