const udp = require('dgram');

/**
 * EchoServer factory
 */
const createEchoServer = (serverName) => {
  // creating a udp server
  const server = udp.createSocket('udp4');

  // emits when any error occurs
  server.on('error', function (error) {
    console.error(`[${serverName}][ERROR]: ${error}`);
    server.close();
  });

  // emits on new datagram msg
  server.on('message', function (msg, info) {
    console.log(
      `[${serverName}][MESSAGE]: L=${msg.length}, S=${info.address}, P=${
        info.port
      }, D='${msg.toString()}'`,
    );

    // replying to the client
    server.send(msg, info.port, info.address, function (error) {
      if (error) {
        console.error(
          `[${serverName}][MESSAGE]: Reply failed D=${info.address}, P=${info.port}, E='${error.message}'`,
        );
        client.close();
      } else {
        console.info(
          `[${serverName}][MESSAGE]: Reply sent L=${msg.length}, D=${info.address}, P=${info.port}`,
        );
      }
    });
  });

  // emits when socket is ready and listening for datagram msgs
  server.on('listening', function () {
    const address = server.address();
    const port = address.port;
    const family = address.family;
    const ipaddr = address.address;

    console.log(`[${serverName}]: listening at: ${ipaddr}:${port}/${family}`);
  });

  //emits after the socket is closed using socket.close();
  server.on('close', function () {
    console.log(`[${serverName}]: Socket is closed`);
  });

  return server;
};

const server1 = createEchoServer('S1');
const server2 = createEchoServer('S2');
const server3 = createEchoServer('S3');
const server4 = createEchoServer('S4');

server1.bind(5050);
server2.bind(5051);
server3.bind(5052);
server4.bind(5055);
