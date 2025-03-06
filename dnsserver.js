const dns = require("dns");
const dns2 = require("dns2");
const { config } = require("./dnsconfig");
const { hosts } = require("./extrahosts");

const { Packet, TCPClient } = dns2;

const resolve = TCPClient({
  dns: "8.8.8.8", // google dnsserver
});

const server = dns2.createServer({
  udp: true,
  handle: async (request, send, rinfo) => {
    let response = Packet.createResponseFromRequest(request);
    const [question] = request.questions;

    if (hosts.get(question.name)) {
      const h = hosts.get(question.name);
      response.answers.push({
        name: question.name,
        type: Packet.TYPE.A,
        class: Packet.CLASS.IN,
        ttl: 300,
        address: h.address,
      });
      send(response);
    } else {
      const r = await resolve(question.name);

      r.header = response.header;

      send(r);
    }
  },
});

server.on("request", (request, response, rinfo) => {
  console.log(request.header.id, request.questions[0]);
});

server.on("requestError", (error) => {
  console.log("Client sent an invalid request", error);
});

server.on("listening", () => {
  console.log(server.addresses());
});

server.on("close", () => {
  console.log("server closed");
});

(async () => {
  await server.listen({
    // Optionally specify port, address and/or the family of socket() for udp server:
    udp: {
      port: config.port,
      address: config.address,
      type: "udp4", // IPv4 or IPv6 (Must be either "udp4" or "udp6")
    },

    // Optionally specify port and/or address for tcp server:
    tcp: {
      port: config.port,
      address: config.address,
    },
  });
})();

// eventually
// server.close();
