import { App } from './app';

/**
 * Start express server
 */

const app = new App().express;

const server = app.listen(app.get('port'), () => {
    console.log(
      'App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });

  export default server;