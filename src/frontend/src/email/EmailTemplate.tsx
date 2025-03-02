import React from "react";

interface EmailTemplateProps {
  recipientName: string;
  senderName: string;
  amount: string;
  customMessage: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  recipientName,
  senderName,
  amount,
  customMessage,
}) => {
  return (
    <div style={{ backgroundColor: "#ededed", margin: 0, padding: 0 }}>
      <link
        href="https://fonts.googleapis.com/css?family=Lato"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Cormorant+Garamond"
        rel="stylesheet"
        type="text/css"
      />
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: "#ffffff", width: "100%" }}
      >
        <tbody>
          {/* Row 1: Header with Logo and Menu */}
          <tr>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                style={{
                  backgroundColor: "#ffffff",
                  width: "680px",
                  margin: "0 auto",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "5px 0", textAlign: "center" }}>
                      <img
                        src="/email/origami.png"
                        alt="Logo"
                        width={136}
                        style={{
                          display: "block",
                          width: "136px",
                          height: "auto",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "14px",
                        letterSpacing: "1px",
                        padding: "15px",
                      }}
                    >
                      {/* Simple Menu */}
                      <a
                        href="https://btc-gift-cards.com/"
                        style={{
                          margin: "0 10px",
                          color: "#000",
                          textDecoration: "none",
                        }}
                      >
                        Home
                      </a>
                      <a
                        href="https://btc-gift-cards.com/learn"
                        style={{
                          margin: "0 10px",
                          color: "#000",
                          textDecoration: "none",
                        }}
                      >
                        How It Works
                      </a>
                      <a
                        href="https://btc-gift-cards.com/faq"
                        style={{
                          margin: "0 10px",
                          color: "#000",
                          textDecoration: "none",
                        }}
                      >
                        FAQ
                      </a>
                      <a
                        href="https://btc-gift-cards/about"
                        style={{
                          margin: "0 10px",
                          color: "#000",
                          textDecoration: "none",
                        }}
                      >
                        Support
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 2: Spacer */}
          <tr>
            <td>
              <table
                align="center"
                width="680"
                style={{ margin: "0 auto", backgroundColor: "#ffffff" }}
              >
                <tbody>
                  <tr>
                    <td style={{ height: "30px", lineHeight: "30px" }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 3: Main Gift Section */}
          <tr style={{ margin: "0 auto", backgroundColor: "#ededed" }}>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width="680"
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "top",
                        fontFamily: "Lato, sans-serif",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "17px",
                          letterSpacing: "6px",
                          lineHeight: "150%",
                          textAlign: "center",
                          marginBottom: "20px",
                        }}
                      >
                        Your personal
                      </div>
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "50px",
                          lineHeight: "120%",
                          textAlign: "center",
                        }}
                      >
                        Bitcoin Gift Card
                        <br />
                        arrived!
                      </h1>
                      <div style={{ textAlign: "center", margin: "20px 0" }}>
                        <img
                          src="/email/valentine.jpeg"
                          alt="Gift"
                          width="680"
                          style={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            maxHeight: "initial",
                            maxWidth: "initial",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 4: Additional Spacer */}
          <tr>
            <td>
              <table
                align="center"
                width="680"
                style={{ margin: "0 auto", backgroundColor: "#ffffff" }}
              >
                <tbody>
                  <tr>
                    <td style={{ height: "45px", lineHeight: "45px" }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 5: Gift Details and Message */}
          <tr>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width="680"
                style={{
                  margin: "0 auto",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "15px",
                        letterSpacing: "6px",
                      }}
                    >
                      {senderName} sent you
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", padding: "15px" }}>
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "41px",
                          lineHeight: "120%",
                          textAlign: "center",
                        }}
                      >
                        {amount} Bitcoin
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "15px",
                        letterSpacing: "2px",
                      }}
                    >
                      Valued at about $10
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "15px",
                        fontWeight: 700,
                        letterSpacing: "2px",
                      }}
                    >
                      {customMessage.split("\n").map((line) => (
                        <p>{line}&nbsp;</p>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        fontFamily: "Lato, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      Claim your Bitcoin Gift Card in just a few clicks.
                      <br />
                      Click the button below to redeem your Bitcoin securely.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", padding: "25px" }}>
                      <a
                        href="https://btc-gift-cards.com/redeem"
                        target="_blank"
                        style={{
                          backgroundColor: "#faa332",
                          color: "#000",
                          textDecoration: "none",
                          padding: "10px 30px",
                          border: "1px solid #171719",
                          borderRadius: "4px",
                          fontFamily: "Lato, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        CLAIM YOUR BITCOIN
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 6: Footer Spacer */}
          <tr style={{ margin: "0 auto", backgroundColor: "#ededed" }}>
            <td>
              <table align="center" width="680">
                <tbody>
                  <tr>
                    <td style={{ height: "45px", lineHeight: "45px" }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 7: Footer Icons and Contact */}
          <tr style={{ margin: "0 auto", backgroundColor: "#ededed" }}>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width="680"
                style={{
                  margin: "0 auto",
                  color: "#000",
                  fontFamily: "Lato, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        width: "33.33%",
                        padding: "10px",
                      }}
                    >
                      <img
                        src="/email/bitcoin.svg"
                        alt="Bitcoin"
                        width={64}
                        style={{ display: "block", margin: "0 auto" }}
                      />
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "25px",
                          lineHeight: "120%",
                          textAlign: "center",
                        }}
                      >
                        Real Bitcoin
                      </h1>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        width: "33.33%",
                        padding: "10px",
                      }}
                    >
                      <img
                        src="/email/ckbtc.svg"
                        alt="Low Fees"
                        width={64}
                        style={{ display: "block", margin: "0 auto" }}
                      />
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "25px",
                          lineHeight: "120%",
                          textAlign: "center",
                        }}
                      >
                        Low Fees
                      </h1>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        width: "33.33%",
                        padding: "10px",
                      }}
                    >
                      <img
                        src="/email/icp.svg"
                        alt="On Chain"
                        width={128}
                        style={{ display: "block", margin: "0 auto" }}
                      />
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "25px",
                          lineHeight: "120%",
                          textAlign: "center",
                        }}
                      >
                        100% on chain
                      </h1>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 6: Footer Spacer */}
          <tr style={{ margin: "0 auto", backgroundColor: "#ededed" }}>
            <td>
              <table align="center" width="680">
                <tbody>
                  <tr>
                    <td style={{ height: "45px", lineHeight: "45px" }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 8: How It Works Section */}
          <tr style={{ margin: "0 auto", backgroundColor: "#ededed" }}>
            <td>
              <table
                align="center"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width="680"
                style={{ margin: "0 auto" }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "50%",
                        verticalAlign: "top",
                        padding: "5px",
                      }}
                    >
                      <img
                        src="/email/gears.png"
                        alt="Illustration"
                        width={340}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          maxHeight: "initial",
                          maxWidth: "initial",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        width: "50%",
                        verticalAlign: "top",
                        padding: "5px",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        About Bitcoin Gift Cards
                      </h2>
                      <h1
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "41px",
                          lineHeight: "120%",
                          textAlign: "left",
                        }}
                      >
                        How it works
                      </h1>
                      <p
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontSize: "14px",
                          lineHeight: "150%",
                        }}
                      >
                        Bitcoin Gift Cards let you send Bitcoin easily and
                        securely. The recipient redeems the card to claim
                        Bitcoin on the Internet Computer blockchain with minimal
                        fees.
                      </p>
                      <br />
                      <br />
                      <a
                        href="https://btc-gift-cards.com/learn"
                        target="_blank"
                        style={{
                          display: "inline-block",
                          padding: "10px 30px",
                          border: "1px solid #171719",
                          borderRadius: "4px",
                          textDecoration: "none",
                          color: "#000",
                          fontFamily: "Lato, sans-serif",
                          fontSize: "16px",
                        }}
                      >
                        LEARN MORE
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Row 9: Bottom Footer */}
          <tr style={{ margin: "0 auto", backgroundColor: "#b7cac0" }}>
            <td>
              <table
                align="center"
                width="680"
                style={{ margin: "0 auto", backgroundColor: "#b7cac0" }}
              >
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", padding: "10px" }}>
                      <img
                        src="/email/origami.png"
                        alt="company logo"
                        width={134}
                        style={{
                          display: "block",
                          margin: "0 auto",
                          height: "auto",
                        }}
                      />
                      <p
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontSize: "14px",
                          lineHeight: "200%",
                        }}
                      >
                        Bitcoin Gift Cards
                      </p>
                      <div
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontSize: "14px",
                          textAlign: "left",
                        }}
                      >
                        <strong>Resources</strong>
                        <br />
                        <a
                          href="https://btc-gift-cards.com"
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "block",
                            padding: "5px 0",
                          }}
                        >
                          Create
                        </a>
                        <a
                          href="https://btc-gift-cards.com/learn"
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "block",
                            padding: "5px 0",
                          }}
                        >
                          How It Works
                        </a>
                        <a
                          href="https://btc-gift-cards.com/"
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "block",
                            padding: "5px 0",
                          }}
                        >
                          About Bitcoin
                        </a>
                        <a
                          href="https://btc-gift-cards.com"
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "block",
                            padding: "5px 0",
                          }}
                        >
                          Redeem
                        </a>
                        <a
                          href="https://btc-gift-cards.com/faq"
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "block",
                            padding: "5px 0",
                          }}
                        >
                          FAQ
                        </a>
                      </div>
                      <div
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontSize: "14px",
                          textAlign: "left",
                          marginTop: "10px",
                        }}
                      >
                        <strong>Contact</strong>
                        <br />
                        <p style={{ margin: 0 }}>Info@btc-gift-cards.com</p>
                        <p style={{ margin: 0 }}>
                          <a
                            href="https://btc-gift-cards.com/about"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            Help Center
                          </a>
                        </p>
                        <p style={{ margin: 0 }}>
                          <a
                            href="https://btc-gift-cards.com/unsubscribe?email=icidentify@gmail.com"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            Unsubscribe
                          </a>
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", padding: "35px 0" }}>
                      <a
                        href="http://designedwithbeefree.com/"
                        style={{
                          textDecoration: "none",
                          color: "#1e0e4b",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                        }}
                      >
                        <img
                          src="/email/Beefree-logo.png"
                          alt="Beefree Logo"
                          width={34}
                          style={{
                            verticalAlign: "middle",
                            marginRight: "6px",
                          }}
                        />
                        Designed with Beefree
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmailTemplate;
