const { networkInterfaces } = require("os");

function getCurrentIp() {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  return Object.values(results).flat()[0]; // assume the user's IP is the first one on the list
}

const hosts = new Map();

hosts.set("hello.local.world.com", {
  address: getCurrentIp(),
});

hosts.set("hello.testing.world.com", {
  address: getCurrentIp(),
});

exports.hosts = hosts;
