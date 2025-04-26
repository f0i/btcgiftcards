import { BsDiscord, BsTwitterX } from "react-icons/bs";

const Footer = () => {
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
      <div className="w-max-center border-top border-y border-gray-500 py-4 grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 mx-8 gap-8">
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
            ["Mothers Day", "/create#mothersday"],
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
            ["Legal notice", "https://cubeworksgmbh.de/impressum.html"],
            ["Contact", "https://cubeworksgmbh.de/kontakt.html"],
          ]}
        />
      </div>
      <p className="text-sm text-gray-200 text-center mt-6 px-8">
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

export const TinyFooter = () => {
  return (
    <div className="py-2 footer bg-gray-700 text-gray-300">
      <div className="justify-center flex flex-row gap-4">
        <a href="https://x.com/f0i" target="_blank">
          <BsTwitterX className="inline-block" />
        </a>
        <a href="https://discordapp.com/users/f0i" target="_blank">
          <BsDiscord className="inline-block" />
        </a>
        <a
          href="https://cubeworksgmbh.de/impressum.html"
          target="_blank"
          className=""
        >
          Leagal Notice
        </a>
      </div>
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
    <li key={index + link} className={index > 2 ? "hidden sm:block" : ""}>
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

export default Footer;
