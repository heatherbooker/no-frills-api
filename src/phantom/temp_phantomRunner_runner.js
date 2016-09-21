const spawn = require('child_process').spawn;
const phantom = spawn('./phantomRunner.sh');

phantom.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

phantom.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

phantom.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
