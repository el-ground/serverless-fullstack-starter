# serverless-fullstack-starter

### Goal

- Lets you develop a fullstack service mvp at the speed of light!

### Features

* typescript + eslint + stylelint (scss) + prettier
* nextjs + express + apollo(graphql)
* Shared type system between frontend and backend
* Authenticated server component
* Websocket subscription
* Super powerful logging system (easy to debug / track in cloud logger with flooding logs)
* PWA + service worker
* Almost done app setup ;)

### Structure

- frontend resources located at src/* public/*, compiled to .next/
- backend resources located at server/*, compiled to dist/
- frontend & backend share root directory + tsconfig, eslintrc.json, etc.
- frontend is served from the backend using nextjs' custom server.

### Why do I need to use this?

- Full typescript setup + graphql => super less work to get your client satisfied
- All architecture stays inside the repo! Any developer can jump in to collaborate to your project!

### TODO

- Prerender with bot

### Additional features TODO

- Error Boundary (use next's implementation)
- onPopState (back button)

### Milestones (future)

- Implement ECommerce purchase patterns : approve, cancel

### Recommended setup

- vscode
- nvm
- yarn (corepack enable)

### Required environment variables

- AUTH_KEY_SYMMETRIC_256
- VAPID_KEY_PUBLIC, VAPID_KEY_PRIVATE
- FILE_KEY_SYMMETRIC_256

### Implement process

- Design pages / ux
- setup blueprints

  1. app/`<page>/page.tsx`
  2. containers/`<container>/index.tsx`
  3. schema/`<object>.gql`
  4. resolvers/`<resolver>.gql`
  5. connect resolvers to containers (query, mutation)

* implement blueprints
  1. resolvers
  2. container elements
  3. styles

### Setting up a new project

- copy contents & remove .git, replace .git of the target repo.
- Create secrets for the new project and put to secrets/.env & save it somewhere;
- Setup service (below)
- setup deployment & create yarn deploy commands : deploy:staging & deploy:prod
- create backend configuration for dev & prod, add yarn command for switching environment, switch environment before deploy scripts
- find MUST_IMPLEMENT comments, setup services and replace!
  - database
  - storage
  - pubsub
  - push
  - message-sender (verification-code, sms)
  - rate limiter
  - 3rd party auth (upgrade)

### Setting up service (using GCP cloud run)

- create gcp project
- follow deployment/gcp-cloud-run/README.md
- setup load balancer
- connect domain
- setup storage
- setup firestore, firebase messaging

### Setting up @google-cloud/storage

- Enable cloud storage, create bucket non-public (since we'll stream)
- make sure you set GOOGLE_APPLICATION_CREDENTIAL before running any environment; see Setting up firebase below;

### Setting up firebase (firestore, firebase messaging)

- Create firebase project
- download service acount key json from firebase console OR IAM -> application's service account (minimal permission) -> save to dev instance `~/<safe-place>/<service-account-key>.json`
- store the service account key file path as shell environment variable `<MY_GOOGLE_APPLICATION_CREDENTIAL_ENV_VAR_NAME>`
- add `GOOGLE_APPLICATON_CREDENTIAL=$<MY_GOOGLE_APPLICATION_CREDENTIAL_ENV_VAR_NAME>` in `yarn _dev:start` before `node dist/...`
- **IMPORTANT** DONT use @google-cloud/firestore! it infers database from GOOGLE_APPLICATION_CREDENTIAL and no safety, which might use a totally different project that was used in your dev machine.

### Setting up app (Checklist)

https://capacitorjs.com/docs/basics/workflow

- Icon, name, splash screen
- Permissions
- Push Notification
  - https://capacitorjs.com/docs/guides/push-notifications-firebase
  - Need to setup firebase & place GoogleServiceInfo
- Deep link
  - .well-known/apple-app-site-association / assetlinks.json
- Safe area (notch in android)

### Setups not in this stater

- SEO (meta, og / twitter tags, structured data (json-ld, microdata, RDFa)), OpenSearch.xml, Sitemap.xml, robots.txt
- Analytics : GA4, Facebook
- App analytics (attribution) : Google, Facebook // needs app id, etc setup.

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
