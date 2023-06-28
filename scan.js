const udp = require('dgram');
const { Buffer } = require('buffer');

const createUdpScanner = (clientName, host, port, timeout) => {
  return new Promise((resolve, reject) => {
    // timeout handler
    const timeoutHandler = setTimeout(
      () => failedCallback(new Error('TimeOutError')),
      timeout,
    );

    const failedCallback = (err) => {
      client.close();
      clearTimeout(timeoutHandler);
      return reject(err);
    };

    const successCallback = () => {
      client.close();
      clearTimeout(timeoutHandler);
      return resolve();
    };

    // creating a client socket
    var client = udp.createSocket('udp4');

    const TEST_DATA = 'THIS_IS_THE_VERIFICATION_MESSAGE';

    client.on('message', function (msg, info) {
      const receivedMessageContent = msg.toString();
      const validDataReceived = receivedMessageContent === TEST_DATA;

      console.log(
        `[${clientName}][MESSAGE]: L=${msg.length}, S=${info.address}, P=${info.port}, V=${validDataReceived}, D='${receivedMessageContent}'`,
      );

      clearTimeout(timeoutHandler);

      validDataReceived === false
        ? failedCallback(new Error('InvalidDataError'))
        : successCallback();
    });

    // sending msg
    client.send(Buffer.from(TEST_DATA), port, host, function (error) {
      if (error) {
        console.error(
          `[${clientName}][MESSAGE]: Message failed D=${host}, P=${port}, E='${error.message}'`,
        );

        failedCallback();
      } else {
        console.info(
          `[${clientName}][MESSAGE]: Message sent D=${host}, P=${port}`,
        );
      }
    });
  });
};

createUdpScanner('C1', 'localhost', 5050, 5 * 1000)
  .then(() => console.info(`[C1]: OK`))
  .catch((err) => console.error(`[C1]: Failed (${err.message})`));

// always fails since the timeout is 1ms only
createUdpScanner('C2', 'localhost', 5051, 1)
  .then(() => console.info(`[C2]: OK`))
  .catch((err) => console.error(`[C2]: Failed (${err.message})`));

createUdpScanner('C3', 'localhost', 5051, 2 * 1000)
  .then(() => console.info(`[C3]: OK`))
  .catch((err) => console.error(`[C3]: Failed (${err.message})`));

createUdpScanner('C4', 'localhost', 5052, 10 * 1000)
  .then(() => console.info(`[C4]: OK`))
  .catch((err) => console.error(`[C4]: Failed (${err.message})`));

// Port is closed
createUdpScanner('C5', 'localhost', 5053, 5 * 1000)
  .then(() => console.info(`[C5]: OK`))
  .catch((err) => console.error(`[C5]: Failed (${err.message})`));

createUdpScanner('C6', 'localhost', 5055, 3 * 1000)
  .then(() => console.info(`[C6]: OK`))
  .catch((err) => console.error(`[C6]: Failed (${err.message})`));
