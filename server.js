'use strict';

const app = require('./lib/routes');

const defaultPort = process.env.PORT || 4000;

app.listen(defaultPort, () => {
  process.stdout.write(`Listening at port ${defaultPort}`);
});
