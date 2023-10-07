# run this script in the root directory
# See ./README.md
# set DEPLOY=false on inital build

case $ENVIRONMENT in
  dev)
    PROJECTID="yoohuu-dev"
    ;;
  prod)
    PROJECTID="PLACE_YOUR_PRODUCTION_PROJECT_ID_HERE"
    ;;
esac

gcloud config set project $PROJECTID # set project

REGION=asia-northeast3
REPOSITORY=application
IMAGE_NAME=application
TAG=$(git rev-parse --short HEAD)

# might have to set firestore config json
IMAGE_TAG=$REGION-docker.pkg.dev/$PROJECTID/$REPOSITORY/$IMAGE_NAME:$TAG
docker buildx build -t $IMAGE_TAG --platform=linux/amd64 .
echo $IMAGE_TAG build complete
docker push $IMAGE_TAG

if [ "$DEPLOY" != "false" ];
then
gcloud run deploy application --image=$IMAGE_TAG --region=$REGION
fi