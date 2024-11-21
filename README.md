# BTC Gift Cards

## Features

- Deposit or mint ckBTC
- Show account balances
- Create gift cards
  - Assign an amount of ckBTC to be send with it
  - Specify recipient
  - Add custom message
  - Select gift card design
- Verify email ownership
  - Show instructions how to log in with an email that is not associated with a google account
- Show tips on what to do with the ckBTC
- Custom domain
- Preload images


## local setup

1. create canisters
2. deploy ledger (./external/setup_ledger.sh)
3. dfx deploy


## Roadmap

- Auto verify email address
- Sending emails
- Progress indicator for ckBTC minter
- Add redeem by code (without email verification)
- Use react query mutations for update calls
- Lock submit buttons if requests are pending
