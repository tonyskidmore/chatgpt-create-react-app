#!/bin/sh

# Inject environment variables into a React application on runtime
# https://jakobzanker.de/blog/inject-environment-variables-into-a-react-app-docker-on-runtime/
# https://github.com/githubjakob/react-inject-env-docker-runtime

set -o errexit
set -o nounset

## This script allows to inject env variables into react
## The script runs in the docker container just before react starts up
## The output of this is script is appended to /public/env_vars.js which is made accessible to typescript via index.html

cat <<EOF > /usr/share/nginx/html/env_vars.js
window.REACT_APP_API_URL="$REACT_APP_API_URL";
EOF

nginx -g "daemon off;"
