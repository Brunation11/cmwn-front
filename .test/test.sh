FILENAME="./src"
TESTFILE="src/**/*.test.js"
PARTB=
while getopts f: opt
do
    case "$opt" in
        f) FILENAME="$OPTARG";;
        \?) #unknown flag
            echo >&2 \
            "usage: $0 [-f filename]"
            exit 1;;
    esac
done
if [[ "$FILENAME" =~ "test" ]]
    then
        TESTFILE=$FILENAME
        FILENAME=${FILENAME%.*}.js
    else
        if [ "$FILENAME" != "./src" ]
            then
                TESTFILE=${FILENAME%.*}.test.js
        fi
fi
if [ $FILENAME != './src' ] && [ ! -f $TESTFILE ]; then
    echo "No test file ($TESTFILE) exists for the modified file ($FILENAME). Perhaps you should make one!"
    exit 0;
fi
export BABEL_ENV="production"
export NODE_ENV="production"
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR;
rm -r coverage
../node_modules/babel-cli/bin/babel.js ../$FILENAME ../src/testdom.js --retain-lines --out-dir src --copy-files
if [ "$FILENAME" = "./src" ]
    then
        echo 'testing all files'
    else
        PARTB=$(find src -name \*.js | grep -v "$FILENAME" | sed -e 's/^/-x /')
        echo "testing $FILENAME via $TESTFILE"
fi
PARTA="../node_modules/istanbul/lib/cli.js cover --verbose --print both -x 'src/mocks/**/*.js' -x 'src/**/*.test.js' "
PARTC=" ../node_modules/mocha/bin/_mocha -- $TESTFILE --require ignore-styles --require ./src/testdom.js"
RUNTEST=$PARTA$PARTB$PARTC

export NODE_PATH=${DIR}/src
eval $RUNTEST
#../node_modules/istanbul/src/cli.js cover --verbose --print both -x 'src/mocks/**/*.js' -x 'src/**/*.test.js' ../node_modules/mocha/bin/_mocha -- 'src/**/*.test.js' --require ignore-styles --require ./src/testdom.js
