// This rule checks if lines exceed 110 characters (width of the GitHub code viewer)

module.exports = function(context) {
    return {
        Program: function(node) {
            // Returns the source code split into an array of string lines
            var sourceCode = context.getSourceLines();

            // Checks if any lines exceed 110 characters
            for (var i = 0; i < sourceCode.length; i++){
                if (sourceCode[i].length > 110) {
                    context.report(
                        node,
                        {
                            line: i + 1, 
                            column: 1
                        },
                        "The line is greater than 110 characters"
                    );
                }
            }
        }
    };
};