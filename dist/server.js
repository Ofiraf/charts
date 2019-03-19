"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
/**
 * Start express server
 */
const app = new app_1.App().express;
const server = app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
exports.default = server;
//# sourceMappingURL=server.js.map