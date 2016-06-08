export NODE_PATH=$(pwd)/src
export BABEL_ENV="production"
export NODE_ENV="production"
istanbul cover --verbose --print both --x src/**/*.test.js node_modules/.bin/_mocha -- src/**/*.test.js --compilers js:babel-core/register --require ignore-styles --require ./src/testdom.js
