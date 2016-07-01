// This rule checks that all variables declared `const` must be in all uppercase with snake case (`const SOME_VAR = 'foo';`)

module.exports = function(context) {
    return {
        Program: function(node) {
            // Returns the source code split into an array of string lines
            var sourceCode = context.getSourceLines();
            
            var endIdx;
            for (var i = 0; i < sourceCode.length; i++) {
                // Checks if there is a constant in each line
                var startIdx = sourceCode[i].indexOf("const ");
                if (startIdx == -1) { continue; }
                var endIdx1 = sourceCode[i].indexOf("=");
                var endIdx2 = sourceCode[i].indexOf(";");
                if (endIdx1 == -1 && endIdx2 == -1) { continue; } // in case `const` is written in a comment and not used to declare a constant
                if (endIdx1 == -1) { endIdx = endIdx2; }
                if (endIdx2 == -1) { endIdx = endIdx1 - 1; }
                if (endIdx1 != -1 && endIdx2 != -1) {
                    if (endIdx1 < endIdx2) {
                        endIdx = endIdx1 - 1;
                    }
                    else {
                        endIdx = endIdx2;
                    }
                }    
                var str = sourceCode[i].substring(startIdx + 6, endIdx); // extracts the variable name
                
                // Checks if the variable name has any lowercase or spaces
                var strIdx;
                for (strIdx = 0; strIdx < str.length; strIdx++) {
                    var character = str.charAt(strIdx);
                    if (character === character.toLowerCase() && character !== "_" || character === " ") {
                        context.report(
                            node,
                            {
                                line: i + 1, 
                                column: strIdx + 6 
                            },
                            "The constant variable isn't uppercase or isn't snake case"
                        );
                        break;
                    }
                }
            }
        }
    };
};