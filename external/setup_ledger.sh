#!/usr/bin/env bash

# based on instructions from 
# https://internetcomputer.org/docs/current/developer-docs/defi/icrc-1/icrc1-ledger-setup

set -eu -o pipefail

# deployment identity
dfx identity use default
export DEFAULT=$(dfx identity get-principal)


# minter identity
# Uncomment if you want a separate identity for the minter
#echo -n "Create minter identity and deploy ledger canister?"
#read
#dfx identity use minter || dfx identity new --storage-mode=plaintext minter
#dfx identity use minter
export MINTER=$(dfx identity get-principal)

export TOKEN_NAME="notCkBTC"
export TOKEN_SYMBOL="notCkBTC"

# premint
export PRE_MINTED_TOKENS=10_000_000_000
export TRANSFER_FEE=10

# Uncomment if you want a separate identity for the minter
#dfx identity use minter
export ARCHIVE_CONTROLLER=$(dfx identity get-principal)
export TRIGGER_THRESHOLD=2000
export NUM_OF_BLOCK_TO_ARCHIVE=1000
export CYCLE_FOR_ARCHIVE_CREATION=10000000000000

export FEATURE_FLAGS=true

dfx identity use default

dfx deploy ckbtc_ledger --argument "(variant {Init =
record {
     token_symbol = \"${TOKEN_SYMBOL}\";
     token_name = \"${TOKEN_NAME}\";
     minting_account = record { owner = principal \"${MINTER}\" };
     transfer_fee = ${TRANSFER_FEE};
     metadata = vec {
        record { \"icrc1:decimals\"; variant { Nat = 6 : nat } };
     };
     feature_flags = opt record{icrc2 = ${FEATURE_FLAGS}};
     initial_balances = vec { record { record { owner = principal \"${DEFAULT}\"; }; ${PRE_MINTED_TOKENS}; }; };
     archive_options = record {
         num_blocks_to_archive = ${NUM_OF_BLOCK_TO_ARCHIVE};
         trigger_threshold = ${TRIGGER_THRESHOLD};
         controller_id = principal \"${ARCHIVE_CONTROLLER}\";
         cycles_for_archive_creation = opt ${CYCLE_FOR_ARCHIVE_CREATION};
     };
 }
})"

export LEDGER_ID=$(dfx canister id ckbtc_ledger)
dfx deploy ckbtc_index --argument "(opt variant {\"Init\" = (record {ledger_id = principal \"${LEDGER_ID}\"})})"

dfx deploy ckbtc_minter --argument "(
  variant {
    Init = record {
      kyt_principal = opt (principal \"${MINTER}\");
      ecdsa_key_name = \"ecdsa_key_name\";
      mode = variant { GeneralAvailability };
      retrieve_btc_min_amount = 100 : nat64;
      ledger_id = principal \"${LEDGER_ID}\";
      max_time_in_queue_nanos = 10_000_000_000_000 : nat64;
      btc_network = variant { Testnet };
      min_confirmations = opt (1 : nat32);
      kyt_fee = opt (0 : nat64);
    }
  },
)"
