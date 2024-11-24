# BTC Gift Cards

Create gift cards on [btc-gift-cards.com](https://btc-gift-cards.com)!

# BTC Gift Cards

### 🎁 A Simple Way to Gift Bitcoin

BTC Gift Cards is a project designed to make gifting Bitcoin easy and accessible, serving as an introduction to **ckBTC on the Internet Computer** and the broader ICP ecosystem. Whether it’s for Christmas, a birthday, or any special occasion, this project provides a seamless way to share Bitcoin with others.

### 🚀 Key Features
- **No Wallet Required**: Recipients can claim their gift cards using Google Sign-In, simplifying the process for newcomers.  
- **Powered by ckBTC**: Leverages the Internet Computer's ckBTC for secure and efficient transactions.  
- **Easy Onboarding**: Perfect for introducing new users to Bitcoin and the ICP ecosystem.  

⚠️ **Disclaimer**: This project is under active development. Please avoid loading large amounts onto the gift cards at this stage, as there is a risk of funds being lost.

### 🌐 Demo Link

- Frontend canister: [y4leg-vyaaa-aaaah-aq3ra-cai](https://y4leg-vyaaa-aaaah-aq3ra-cai.icp0.io/)
- Backend canister: [yvip2-dqaaa-aaaah-aq3qq-cai](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=yvip2-dqaaa-aaaah-aq3qq-cai)
- Presentation video: [BTC Gift Cards - ICP Chain Fusion Hackathon BITCOIN EDITION](https://youtu.be/IGbjgP9lHCA)
u

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
- Auto verify email address
- Toast messages for success and error notifications
- Lock submit buttons if requests are pending
- Copy button to copy both html and text content of gift cards, to paste it to email or messanging apps

## Local setup

1. create canisters
2. deploy ledger (./external/setup_ledger.sh)
3. dfx deploy

## Roadmap

- Sending emails
- Progress indicator for ckBTC minter
- Add redeem by code (without email verification)
- Shortcut to transfer gift card balance to main account
