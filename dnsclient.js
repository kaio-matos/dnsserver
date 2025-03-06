const { UDPClient } = require("dns2");
const { config } = require("./dnsconfig");

const resolve = UDPClient({
  dns: config.address,
  port: config.port,
  socketType: "udp4", // IPv4 or IPv6 (Must be either "udp4" or "udp6")
});

(async () => {
  try {
    const result = await resolve(process.argv[2]);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
