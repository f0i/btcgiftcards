import { BsDiscord, BsTwitterX } from "react-icons/bs";

const Footer = ({}) => {
  return (
    <div className="row footer bg-gray-700 text-gray-100">
      <div className="text-center text-lg pb-4">
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
      <div className="w-max-center border-top border-y border-gray-500 py-4 flex flex-row gap-8 justify-around">
        <FooterLinkBlock
          title="Features"
          links={[
            ["Create", "/create"],
            ["Redeem", "/redeem"],
            ["Learn", "/learn"],
          ]}
        />
        <FooterLinkBlock
          title="Occations"
          links={[
            ["New Year", "/create#new-year"],
            ["Valentine's Day", "/create#valentine"],
            ["Easter", "/create#easter"],
            ["Birthday", "/create#birthday"],
            ["New Baby", "/create#baby"],
            ["Wedding", "/create#wedding"],
            ["More...", "/create#other"],
          ]}
        />
        <FooterLinkBlock
          title="Resources"
          links={[
            ["Bitcoin", "/learn/bitcoin"],
            ["Internet Computer", "/learn/icp"],
            ["ckBTC", "/learn/ckBTC"],
            ["Use Cases", "/learn/usecases"],
          ]}
        />
        <FooterLinkBlock
          title="Help"
          links={[
            ["Discord", "https://discordapp.com/users/f0i"],
            ["Email", "mailto:btc-gift-cards@f0i.de"],
          ]}
        />
        <FooterLinkBlock
          title="Legal"
          links={[
            ["About CubeWorks", "https://cubeworksgmbh.de/"],
            ["Impressum", "https://cubeworksgmbh.de/impressum.html"],
            ["Contact", "https://cubeworksgmbh.de/kontakt.html"],
          ]}
        />
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
  );
};

const FooterLinkBlock = ({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) => {
  const lis = links.map(([title, link], index) => (
    <li key={index + link}>
      <a href={link} target="_blank">
        {title}
      </a>
    </li>
  ));
  return (
    <div className="">
      <h3>{title}</h3>
      <ul>{lis}</ul>
    </div>
  );
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

export default Footer;
