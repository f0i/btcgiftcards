import TopNav, { Tab } from "./components/TopNav";
import Footer from "./Footer";
import { ImageTextCTA } from "./Landing";

function LoggedOut({ tab }: { tab: Tab }) {
  return (
    <>
      <TopNav tab={tab} />

      <ImageTextCTA
        title="Sign in"
        text="Log in to create secure, personalized Bitcoin gift cards powered by ckBTC and the Internet Computer. It's fast, easy, and the perfect way to share Bitcoin with loved ones."
        img="/visuals/door-welcome.jpeg"
        cta="Sign In with Google"
        imageRight={false}
        className="grow content-center"
      />

      <Footer />
    </>
  );
}

export default LoggedOut;
