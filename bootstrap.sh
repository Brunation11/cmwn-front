#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
apt-get install -y php5-common libapache2-mod-php5 php5-cli
apt-get install -y nodejs
apt-get install -y npm
apt-get install -y build-essential
npm install -g gulp babel webpack
(cd /vagrant && npm install && gulp build --development)
if ! [ -L /var/www ]; then
  rm -rf /var/www
  mkdir -p /vagrant/build
  ln -fs /vagrant/build /var/www
fi
sudo cp /etc/apache2/mods-available/socache_shmcb.load /etc/apache2/mods-enabled/
sudo cp /etc/apache2/mods-available/ssl.* /etc/apache2/mods-enabled/
sudo cp /etc/apache2/mods-available/proxy_http.load /etc/apache2/mods-enabled/
sudo cp /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/
sudo rm /etc/apache2/sites-enabled/000-default.conf
sudo a2enmod headers
sudo a2enmod proxy
cp /vagrant/vhosts.conf /etc/apache2/sites-enabled/
cp /vagrant/variables.conf /etc/apache2/conf-enabled/
sudo apache2ctl start
sudo apache2ctl graceful
