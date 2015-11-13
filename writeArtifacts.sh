#!/usr/bin/env bash
#forgive us our hacks as we forgive those who hack against us

rm -rf ../artifact
CURRENT_VERSION=$(echo "(function () {return require('./package.json').version;})()" | node -p)
CURRENT_HEAD="$(git rev-parse HEAD)"
(cd .. && git clone git@github.com:ginasink/cmwn-front-artifact.git artifact)
cp ./build/* ../artifact
cp ./.htaccess ../artifact/.htaccess
git remote add pagoda git@git.pagodabox.io:apps/cmwn-front.git
(cd ../artifact && git add . && git commit -m $CURRENT_HEAD && git tag -a $CURRENT_VERSION -m $CURRENT_VERSION && git push origin master && git push origin --tags && git push pagoda master)

