### Simple DNS server

Copy the example configuration file and edit it to your needs.

```
cp extrahosts.example.js extrahosts.js
```

Run the server
```
node dnsserver.js
```

Run the client if you want to test the server
```
node dnsclient.js hello.testing.world.com
```

