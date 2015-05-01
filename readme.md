requiro
=======
Advanced version of require for node.js.

INSTALL
-------
`npm install requiro` 

USAGE
-----
```js
var require = require("requiro");
// Now we can use something like that:
var conf = require(">/config.{%NODE_ENV%}.js");
```

SYNTAX
------
Symbols                  | Resolves to               | Example                              |
----------------------   | -----------------         | ----------------------               |
`>` or `>/`              | Current working directory |  `require(">/app/library/index.js`   |
`{%VAR}` or `{%VAR%}`    | Environment variable      |  `require("./config.{%NODE_ENV%}.js` |

TODO
----
1. Need put config somewhere
2. Multiple environment variables

INSPIRED BY
-----------
https://github.com/MattiSG/requirewith  
https://github.com/jaubourg/wires  

