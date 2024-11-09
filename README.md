# `btcgiftcards`

Welcome to your new `btcgiftcards` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `btcgiftcards`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd btcgiftcards/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.



```text
Sending the following argument:
(
  variant {
    Init = record {
      kyt_principal = opt principal "iknsv-cwr5u-zgupo-2cjpq-v7ptz-i34dv-z67wp-a4cka-geckm-4akgc-3ae";
      ecdsa_key_name = "dummy";
      mode = variant { ReadOnly };
      retrieve_btc_min_amount = 1_000_000 : nat64;
      ledger_id = principal "iknsv-cwr5u-zgupo-2cjpq-v7ptz-i34dv-z67wp-a4cka-geckm-4akgc-3ae";
      max_time_in_queue_nanos = 1_000_000 : nat64;
      btc_network = variant { Testnet };
      min_confirmations = opt (1 : nat32);
      kyt_fee = opt (1_000 : nat64);
    }
  },
)
```
