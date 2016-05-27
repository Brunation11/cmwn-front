# CMWN Javascript Style Guide

## Overview
As a general rule, all Javascript code being contributed to CMWN should follow the rules outlined in this document. For any rules not specified here, style rules should conform to the Standard Javascript Style. For arbitrary style choices (e.g. tabs vs spaces) we defer to PHP PSR1 for maximum overall consistency across all repositories whenever possible.
   
A breif summary of the Standard JS style rules followed by this repository:
 - Always use single quotes
 - No unused variables
 - Add a space after all keywords (`if (condition) {...}`)
 - Add a space before a function declaration's parenthesese (`function name (arg) { ... }`)
 - Always use `===` instead of `==` except to check for null and undefined simultaneously (`somevar == null`)
 - Infix operators must be spaced (`var message = 'hello, ' + name + '!'`)
 - Commas should always have a space after them
 - Else statements should be on the same line as their curly braces
 - Wrap any multiline block in curly braces
 - Keep single line if statements on the same line as the if statement. If the line is too long, wrap in curly braces
 - No Pokemon error handling (gotta catch em all!) - always handle the err function parameter
 - Always prefix globals with window (`window.alert('good')`)
 - Write each var declaration in its own statement
 - Wrap conditional assignments with additional parentheses to indicate they are intentional (`while ((m = text.match(expr))) {`)
 
 
We diverge from the standard JS style in the following ways:

 - End every line with a semicolon (Style should not increase number of considerations for avoiding bugs)
 - Indent with 4 spaces (to match PSR1 across the codebase)
 - Multiple blank lines are fine (format as you will)
 - Do not precede ternary conditions on multiple lines with the `?` and `:` operators
 
