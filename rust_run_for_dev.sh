#!/bin/bash

# Shared lib
cd shared-lib &&
cargo watch -x build &
 
# auth_api
cd authorization_api &&
cargo watch -x run &

# chat_api
cd chat_api &&
cargo watch -x run &

# site
cd site &&
cargo watch -x run &

# wait
wait