#!/usr/bin/env bash

cat $PWD/bin/splash.txt

docker-machine active
if [ $? != 0 ]
then
    echo "[installer] no default docker-machine running"
    echo "[installer] you should check for updates in composer.json yourself"
    exit 1
fi

echo "[installer] Installing hooks"
bash $PWD/bin/install-git-hooks.sh

echo "[api-installer] Building docker containers"
eval $(docker-machine env)

docker-compose build

echo "[installer] Installing node modules"
docker-compose run node npm install

echo "[installer] building production"
docker-compose run node gulp build --production

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
