rm -r coverage
rm -r lib
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR;
export BABEL_ENV="production"
export NODE_ENV="production"
../node_modules/babel-cli/bin/babel.js ../src --retain-lines --out-dir lib --copy-files
export NODE_PATH=${DIR}/lib
../node_modules/istanbul/lib/cli.js cover --verbose --print both -x 'lib/mocks/**/*.js' -x 'lib/**/*.test.js' ../node_modules/mocha/bin/_mocha -- 'lib/**/*.test.js' --require ignore-styles --require ./lib/testdom.js
