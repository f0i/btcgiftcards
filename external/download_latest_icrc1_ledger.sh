#!/usr/bin/env bash

# Download script based on
# https://raw.githubusercontent.com/dfinity/ic/326df23607fc8280a047daba2d8462f1dfc57466/rs/rosetta-api/scripts/download_latest_icrc1_ledger.sh"
# but also downloading index.did and wasm as well as internet_identity.did and wasm

set -uo pipefail
#set -x

# get the last 100 commits
COMMITS=$(curl -sLf -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/dfinity/ic/commits?per_page=100" \
    | jq '.[].sha' | tr -d \")

if [ "$?" -ne "0" ]; then
    echo >&2 "Unable to fetch the commits from dfinity/ic. Please try again"
    exit 1
fi

# check each commit for artifacts
for COMMIT in $COMMITS; do

    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L --head "https://download.dfinity.systems/ic/$COMMIT/canisters/ic-icrc1-ledger.wasm.gz")
    if (($STATUS_CODE < 200)) && (($STATUS_CODE >= 300)); then
        continue
    fi

    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L --head "https://download.dfinity.systems/ic/$COMMIT/canisters/ic-icrc1-index-ng.wasm.gz")
    if (($STATUS_CODE < 200)) && (($STATUS_CODE >= 300)); then
        continue
    fi

    #wget https://raw.githubusercontent.com/dfinity/ic/refs/heads/master/rs/bitcoin/ckbtc/minter/ckbtc_minter.did -O ckbtc_minter.did
    #wget https://download.dfinity.systems/ic/ac04d772c23ff771eaf526bee9ca9e9b411e129d/canisters/ic-ckbtc-minter.wasm.gz -O ckbtc_minter.wasm.gz

    echo "Found artifacts for commit $COMMIT."
    echo "Downloading .did and .wasm.gz for icrc1 ledger, icrc1 index, and internet identity."

    curl -sLf "https://raw.githubusercontent.com/dfinity/ic/$COMMIT/rs/ledger_suite/icrc1/ledger/ledger.did" \
        -o icrc1_ledger.did
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 ledger did file. Please try again"
        exit 2
    fi
    curl -sLf "https://download.dfinity.systems/ic/$COMMIT/canisters/ic-icrc1-ledger.wasm.gz" \
        -o icrc1_ledger.wasm.gz
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 ledger wasm file. Please try again"
        exit 3
    fi

    curl -sLf "https://raw.githubusercontent.com/dfinity/ic/$COMMIT/rs/ledger_suite/icrc1/index-ng/index-ng.did" \
        -o icrc1_index.did
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 index did file. Please try again"
        exit 4
    fi
    curl -sLf "https://download.dfinity.systems/ic/$COMMIT/canisters/ic-icrc1-index-ng.wasm.gz" \
        -o icrc1_index.wasm.gz
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 index wasm file. Please try again"
        exit 5
    fi

    curl -sLf "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity.did" \
        -o internet_identity.did
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 index did file. Please try again"
        exit 6
    fi
    curl -sLf "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz" \
        -o internet_identity.wasm.gz
    if [ "$?" -ne "0" ]; then
        echo >&2 "Unable to download the icrc1 index wasm file. Please try again"
        exit 7
    fi

    exit 0
done

echo "No commits with artifacts found"
exit 4
