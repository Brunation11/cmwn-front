// This rule checks if the file name is lowercase and snake case

module.exports = function(context) {
    return {
        Program: function(node) {
            // Returns the filename associated with the source
            var fileName = context.getFilename();
            
            // Extracts just the fileName.js
            while (fileName.indexOf("/") !== -1) {
                fileName = fileName.substring(fileName.indexOf("/") + 1);
            }
            
            for (var i = 0; i < fileName.length; i++) {
                var charVal = fileName.charCodeAt(i);
                // 65 = `A` and 90 = `Z` and 32 = ` ` for ASCII Code
                if (charVal >= 65 && charVal <= 90 || charVal == 32) {
                    context.report(
                        node,
                        {
                            line: 1, 
                            column: 1
                        },
                        "The filename is not lowercase"
                    );
                    break;
                }
            }
        }
    };
};