# cmwn-front
ChangeMyWorldNow platform frontend (react)
## Getting running
### Environment
1) Install virtualbox (`brew install virtualbox` or https://www.virtualbox.org/wiki/Downloads) and vagrant (https://www.vagrantup.com/downloads.html)   
2) Clone this repo (git@github.com:ginasink/cmwn-front.git) somewhere and switch to this branch (max/vagrant-up)   
3) Add the following 2 entries to your hosts file:
   ```
      192.168.33.10 local.changemyworldnow.com
      192.168.33.10 api-local.changemyworldnow.com
   ```
4.a) If you want anything other than the homepage to work, setup a local API server by following https://github.com/ginasink/cmwn-platform/wiki/Local-API-Setup (Note: This setup assumes that the default Homestead static IP is used (192.168.10.10). If for some reason you need to change this, you will also need to update vhosts.conf to reflect this change)   
4.b) Alternatively, if you prefer to point your local api to api-dev, simply update the value in variables.conf   
5) Run `vagrant up`.   
6) Once this completes, navigate to https://api-loc.changemyworldnow.com and https://loc.changemyworldnow.com . You will see certificate security errors due to a self-signed cert. Allow the browser to proceed for *both* urls   
7) Your local frontend is now configured.   


 Note that this setup is not ideal for active development on the frontend itself, as commands must be issued to the build tools via vagrant, as`vagrant ssh -c (cd /vagrant && YOUR COMMAND)`. Common examples:   
- HRM Dev mode: `vagrant ssh -c (cd /vagrant && gulp)`
- Production build: `vagrant ssh -c (cd /vagrant && gulp build --production)`
- Add dependency: `vagrant ssh -c (cd /vagrant && npm install someDep --save)`   
   
Alternatively, local file changes will be refleccted in the vagrant, so if one desires to work entriely around the concept of a vagrant box, install npm and gulp locally and just run the commands locally as normal.   
Additionally, for environmental changes (e.g. changes to .conf files), run `vagrant reload --provision` to reload everything inside the vagrant.   
Until I work out a less annoying way to run commands from the host into the vagrant, just set up local aliases for the above three commands.   
