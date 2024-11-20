# BTC Gift Cards

## Features

- Deposit or mint ckBTC
- Create gift cards
  - Assign an amount of ckBTC to be send with it
  - Specify recipient
  - Add custom message
  - Select gift card design


## local setup

1. create canisters
2. deploy ledger (./external/setup_ledger.sh)
3. dfx deploy


## Roadmap

- Show account balance
- Show info box to explain verify gmail address
- Remove limit to @gmail.com
  - Add instructions how to log in with an email that is not associated with a google account
- Sending emails
- Progress indicator for ckBTC minter
- Show tips on what to do with the ckBTC
- Add redeem by code (without email verification)
- Custom domain
- Lock submit buttons if requests are pending
- Use react query mutations for update calls

