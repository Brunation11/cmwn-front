rm -r coverage
rm -r lib
export BABEL_ENV="production"
export NODE_ENV="production"
node_modules/.bin/babel src --retain-lines --out-dir lib --copy-files
export NODE_PATH=$(pwd)/lib
node_modules/.bin/istanbul cover --verbose --print both -x 'lib/mocks/**/*.js' -x 'lib/**/*.test.js' node_modules/.bin/_mocha -- lib/**/*.test.js --require ignore-styles --require ./lib/testdom.js