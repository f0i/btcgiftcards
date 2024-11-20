type Project = {
  name: string;
  description: string;
  link: string;
};

const projects: Project[] = [
  {
    name: "ICSwap",
    description:
      "A decentralized exchange to trade ckBTC and other tokens or participate in liquidity pools.",
    link: "https://icswap.io/",
  },
  {
    name: "InfinitySwap",
    description:
      "A DeFi platform for swapping, staking, and providing liquidity.",
    link: "https://infinityswap.one/",
  },
  {
    name: "Sonic",
    description:
      "A DeFi hub for yield farming and trading ckBTC with low fees.",
    link: "https://sonic.ooo/",
  },
  {
    name: "Entrepot",
    description:
      "A leading NFT marketplace to buy and sell digital art and collectibles.",
    link: "https://entrepot.app/",
  },
  {
    name: "Yumi",
    description: "An NFT platform offering art, gaming assets, and more.",
    link: "https://yumi.io/",
  },
  {
    name: "Cubetopia",
    description:
      "A creative sandbox game where you can trade and build using ckBTC.",
    link: "https://cubetopia.xyz/",
  },
  {
    name: "OpenChat",
    description:
      "A decentralized messaging app where you can send ckBTC directly.",
    link: "https://oc.app/",
  },
  {
    name: "Plug Wallet",
    description:
      "A browser wallet for managing ckBTC and connecting to IC dApps.",
    link: "https://plugwallet.ooo/",
  },
];

const Showcase: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Explore ckBTC Projects</h1>
      <div style={styles.grid}>
        {projects.map((project) => (
          <div key={project.name} style={styles.card}>
            <h2 style={styles.cardTitle}>{project.name}</h2>
            <p style={styles.cardDescription}>{project.description}</p>
            <a
              href={project.link}
              style={styles.cardLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {project.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  cardTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "1rem",
    marginBottom: "15px",
    color: "#555",
  },
  cardLink: {
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Showcase;
