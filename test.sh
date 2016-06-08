export NODE_PATH=$(pwd)/src
export BABEL_ENV="production"
export NODE_ENV="production"
istanbul cover node_modules/.bin/_mocha -- src/app.test.js --compilers js:babel-core/register --require ignore-styles --require ./src/testdom.js

