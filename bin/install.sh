#!/usr/bin/env bash

cat $PWD/bin/splash.txt


echo "[ui-installer] Installing hooks"
bash $PWD/bin/install-git-hooks.sh

echo "[ui-installer] Installing global packages"
npm install -g eslint eslint-plugin-react eslint-plugin-babel babel-eslint gulp

echo "[ui-installer] Installing node modules"
npm install

echo "[ui-installer] building production"
gulp build --production

echo "[api-installer] Building docker containers"
eval $(docker-machine env)

docker-compose build

DOCKER_IP=$(docker-machine ip)

cat <<EOF
[api-installer] Completed!

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!                                                    !!
!!  You're all set and ready to go.  In order to hit  !!
!!  api-local.changemyworldnow.com, you need to add   !!
!!  the following to your /etc/hosts file:            !!
!!                                                    !!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

$DOCKER_IP    local.changemyworldnow.com

You then run:
docker-compose up -d
and you will be able to access the site locally in the browser

Happy Coding!

EOF
