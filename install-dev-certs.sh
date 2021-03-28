#!/usr/bin/env bash
set -x

brew install mkcert

mkcert -install

mkcert localhost

mv localhost.pem ./certs/cert.pem
mv localhost-key.pem ./certs/key.pem
