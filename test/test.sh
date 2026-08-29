#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ ${1:-} == "setup" ]]; then
  rm -rf notes
  mkdir -p notes
  cd notes
  note month
  exit 0
fi

python3 -m unittest
