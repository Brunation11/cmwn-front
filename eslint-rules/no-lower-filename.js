// This rule checks if the file name is lowercase

module.exports = function(context) {
    return {
        Program: function(node) {
            // Returns the filename associated with the source
            var fileName = context.getFilename();
            
            var i = 0;
            var character = '';
            while (i <= fileName.length) {                
                // Tests if each character in the filename is not a number & is uppercase
                character = fileName.charAt(i);
                if (isNaN(character * 1) && character == character.toUpperCase()) {
                    context.report(
                        node,
                        {
                            line: 1, 
                            column: 1
                        },
                        "The filename is not lowercase"
                    );
                    i++;
                }
            }
        }
    };
};