// This rule checks if the file exceeds 500 lines

module.exports = function(context) {
    return {
        Program: function(node) {
            // Returns the source code split into an array of string lines
            var sourceCode = context.getSourceLines();
            
            // Checks if the file has more than 500 lines
            if (sourceCode.length > 500) {
                context.report(
                    node,
                    {
                        line: 501, 
                        column: 1
                    },
                    "This file has more than 500 lines"
                );
            }
        }
    };
};