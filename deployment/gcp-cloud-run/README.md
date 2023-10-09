1. Create project; You need owner permission;
2. gcloud auth login
3. console : artifact registry -> create repository "application"
4. gcloud auth configure-docker `<region>-docker.pkg.dv`
5. deployment: yarn package && ENVIRONMENT=`<dev|prod> `bash ./deployment/gcp-cloud-run/build.sh
6. secret: console : secret manager -> create secret : application-dotenv and upload local .env
7. console : cloud run -> create service :
   1. Container:ContainerArgs : start
   2. Container:Health checks - startup and liveliness to /api/rest/healthy
   3. Networking:session-affinity
   4. Security:service-account (create a new one)
      1. secret manager secret accessor
      2. storage object user
      3. cloud datastore user (firestore)
      4. firebase cloudmessaging api admin
   5. Container:Secret mount (grant permission); mount as volume at mount path /user/handsomejang/app/secrets and specified path for for secret versions : .env  so that the file will get mounted in /user/handsomejang/app/secrets/.env (application path in docker)
