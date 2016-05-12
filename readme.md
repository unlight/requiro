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
var car = require("~/app/models/car");
```

SYNTAX
------
Symbols                  | Resolves to               | Example                              |
----------------------   | -----------------         | ----------------------               |
`>` or `>/`              | Current working directory |  `require(">/app/library/index.js")`  |
`{%VAR}` or `{%VAR%}`    | Environment variable      |  `require("./config.{%NODE_ENV%}.js")` |
`~/`                     | Closest directory with package.json      |  `require("~/app/library")` |
`//`                     | Project root              |  `require("//app/models/car")` |


RELATED STUFF
-------------
* Better local require() paths for Node.js - https://gist.github.com/branneman/8048520
* https://github.com/MattiSG/requirewith
* https://github.com/jaubourg/wires

TODO
----
1. Need put config somewhere
2. Multiple environment variables

CHANGELOG
---------
### May 1, 2015
- first release  

### Dec 13, 2015
- added project root token `//`
- added closest directory with package.json `/~`
