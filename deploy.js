if (process.env.NODE_ENV === 'production') {
  const childProcess = require('child_process');
  childProcess.exec(
    'webpack -p --config webpack.production.config.js',
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }
  );
}
