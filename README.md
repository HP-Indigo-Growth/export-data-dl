# export-data-dl

This service runs over all the dls, both managed and not managed, and creates a csv file for each table, exporting it to a GCP bucket.

To call the request that creates the tables amd uplaods them to GCP, run **"http://localhost:3000/getData"**

Link to GCP Bucket: https://console.cloud.google.com/storage/browser/strive-dls-bucket;tab=objects?forceOnBucketsSortingFiltering=true&project=strive-dev-243310&supportedpurview=project

P.S. The commented code is the part of the code that downloads the tables as csv files locally to your computer.
