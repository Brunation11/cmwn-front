export NODE_PATH=$(pwd)/src
export BABEL_ENV="production"
export NODE_ENV="production"
mocha src/app.test.js --compilers js:babel-core/register --require ignore-styles --require ./src/testdom.js

