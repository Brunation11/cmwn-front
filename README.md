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
gulp
```
### Viewing the site
The site is now up on http://localhost You'll need to set up a changemyworldnow.com subdomain, as our security policies will deny any other urls.
To do so, add the following entries to your hosts file in order to hit the api (only the first is required at this stage, but may as well add them all now):
```
#local dev server
127.0.0.1       loc.changemyworldnow.com
#local api server (setup instructions below
127.0.0.1       lapi.changemyworldnow.com
192.168.10.10       proxy.changemyworldnow.com
```
You may replace the loc and lapi subdomains with whatever you wish. proxy is used by the express dev server to forward any localhost requests on port 3001 to the local API server, which makes virtualized cross-browser testing easier. The process of setting up a local API server is described below.

### Local api 
If you want to use the local API, add the  hosts entries for the api: 
```
127.0.0.1       lapi.changemyworldnow.com
192.168.10.10 proxy.changemyworldnow.com
```
Then, follow these instructions to set it up: https://github.com/ginasink/cmwn-platform/wiki/Local-API-Setup   
You can control what api URL the frontend looks for with an environment variable. Use 
`export APP_API_URL=lapi.changemyworldnow.com:3001/` to set this. Add this to your `.bash_profile` if you want it to always be set, but make sure you change it to api.changemyworldnow before a production build and deploy. Also note the trailing slash on the variable, which should be present regardless of what the URL is set to.

## Environment Variables
Any local environment variable you have beginning with `APP_` will be available via the `components/globals` module 
in javascript. To access them, import the module and access them by name:    
```
import GLOBALS from 'components/globals'; //note all caps. All globals are constant and cannot be modified
GLOBALS.API_URL; // === your local $APP_API_URL. Note that the APP_ prefix is dropped
```
