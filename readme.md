requiro
-------
Advanced version of require for node.js.  

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

