# cmwn-front
ChangeMyWorldNow platform frontend (react)
## Getting running
### Environment
First, you will need Node, NPM, and Gulp installed on your system and available in your system path. 
Here is my setup for mac, using brew:
```
# I also strongly encourage you to install homebrew, just to make your life easier
# If you dont feel like it, there are installers for node/npm at https://nodejs.org/en/download/
#install homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
#install node
brew install node
#install npm
brew install npm
#install gulp, start here if you didnt want to use brew
npm install -g gulp
```

### Local Setup
once you have all of those set up, clone this repo and navigate to whereever you cloned it
then run
```
npm install
sudo gulp
```
if you aren't on a mac, you can run gulp without sudo. We need to use sudo because osx forbids binding port 80. 
Expect this to change in the near future to allow any port.
### Viewing the site
The site is now up on http://localhost You'll want to set up a changemyworldnow.com subdomain. At the moment, 
only dev. is supported
To do so, add the following entry to your hosts file in order to hit the api:
`127.0.0.1       dev.changemyworldnow.com`
This will also change in the near future to allow you to use any subdomain you wish.
**keep in mind that making this hosts change makes it impossible to view the actual dev site while the entry is in your hosts file.**

### Local api 
If you want to use the local API, add another hosts entry for the api. subdomain: 
`192.168.10.10 api.changemyworldnow.com`. Again, this will also change in the near future to be allowed to be
anything. Also again remember **this will make acessing the live api impossible while the entry is in your hosts file.**   
Then, follow these instructions to set it up: https://github.com/ginasink/cmwn-platform/wiki/Local-API-Setup   
You can control what api URL the frontend looks for with an environment variable. Use 
`export APP_API_URL=http://someDifferentApiServer.com/` to set this.

## Environment Variables
Any local environment variable you have beginning with `APP_` will be available via the `components/globals` module 
in javascript. To access them, import the module and access them by name:    
```
import GLOBALS from 'components/globals'; //note all caps. All globals are constant and cannot be modified
GLOBALS.API_URL; // === your local $APP_API_URL. Note that the APP_ prefix is dropped
```
