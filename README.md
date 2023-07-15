# serverless-fullstack-starter

### Goal

- Lets you develop a fullstack service mvp at the speed of light!
- Single serverless deployment
- Shared lint + type system between frontend and backend
- Prerender with bot detection

### Features

* typescript + eslint + stylelint (scss) + prettier
* nextjs + express + apollo(graphql)

### Structure

- frontend resources located at src/* public/*, compiled to .next/
- backend resources located at server/*, compiled to dist/
- frontend & backend share root directory + tsconfig, eslintrc.json, etc.
- frontend is served from the backend using nextjs' custom server.

### Why do I need to use this?

- Full typescript setup + graphql => super less work to get your client satisfied
- All architecture stays inside the repo! Any developer can jump in to collaborate to your project!

### TODO

- react component testing

### Additional features TODO

- Media serve
- HTTP Cache headers
- Media upload
- Authentication (uid hook & token management)
- Error Boundary, onPopState (back button)
- Capacitor setup for hybrid app deployment
- Safe area

### Recommended setup

- vscode
- nvm
- yarn (corepack enable)

### How to use HTTPS

1. create a key pair
   ```bash
   set -e

   if [ -z "$1" ]; then
   hostname="$HOSTNAME"
   else
   hostname="$1"
   fi

   local_openssl_config="
   [ req ]
   prompt = no
   distinguished_name = req_distinguished_name
   x509_extensions = san_self_signed
   [ req_distinguished_name ]
   CN=$hostname
   [ san_self_signed ]
   subjectAltName = DNS:$hostname, DNS:localhost, IP:192.168.0.9
   subjectKeyIdentifier = hash
   authorityKeyIdentifier = keyid:always,issuer
   basicConstraints = CA:true
   keyUsage = nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment, keyCertSign, cRLSign
   extendedKeyUsage = serverAuth, clientAuth, timeStamping
   "

   openssl req \
   -newkey rsa:2048 -nodes \
   -keyout "$hostname.key.pem" \
   -x509 -sha256 -days 3650 \
   -config <(echo "$local_openssl_config") \
   -out "$hostname.cert.pem"
   openssl x509 -noout -text -in "$hostname.cert.pem"


   ```
2. set process.env.CERT, process.env.CERT_KEY when running the node process.
3. Use this method only for development environment! in production, you'd better have a proxy that handles ssl.

### How to log

```typescript
import { logInfo, logDebug, logError } from '@/src/util/log'

/*
	This prints request id inside the entire promise stack of the request.
*/
logInfo(`hello world!`);

```
