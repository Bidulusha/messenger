#!/bin/bash

######START RUST#######
# Shared lib
cd shared-lib &&
cargo build &
 
# auth_api
cd authorization_api &&
cargo run &

# chat_api
cd chat_api &&
cargo run &

# site
cd site &&
cargo run &

wait