rm -rf coverage
rm -rf ./testsrc
export BABEL_ENV="production"
export NODE_ENV="production"
node_modules/babel-cli/bin/babel.js src --retain-lines --out-dir ./testsrc --copy-files
export NODE_PATH=$(pwd)/testsrc
node_modules/istanbul/lib/cli.js cover --verbose --print both -x './testsrc/mocks/**/*.js' -x './testsrc/**/*.test.js' node_modules/mocha/bin/_mocha -- './testsrc/**/*.test.js' --require ignore-styles --require ./testsrc/testdom.js
rm -rf ./testsrc
