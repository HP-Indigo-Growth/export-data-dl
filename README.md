# export-data-dl

http://localhost:3000/getData/dls
This service runs over all the dls, both managed and not managed, and creates a csv file for each table, exporting it to a GCP bucket.
It also goes over all the products that are not deleted, takes the product name and product description, and gets its Beat from a GCP Bucket based on the product description name. Then it creates a new file with said Beat (the latest version) but with the Product name, and uplaods it to another GCP bucket.

To call the request that creates the DL tables amd uplaods them to GCP, run **"http://localhost:3000/getData/dls"**
To call the request that creates the Beats htmls amd uplaods them to GCP, run **"http://localhost:3000/getData/beats"**


Link to GCP DL Bucket: https://console.cloud.google.com/storage/browser/strive-dls-bucket;tab=objects?forceOnBucketsSortingFiltering=true&project=strive-dev-243310&supportedpurview=project

Link to GCP Beat Bucket: https://console.cloud.google.com/storage/browser/strive-beats-bucket;tab=objects?forceOnBucketsSortingFiltering=true&project=strive-dev-243310&supportedpurview=project&prefix=&forceOnObjectsSortingFiltering=false

Link to Retool Link that exports the data: https://strivesuperapp.retool.com/embedded/public/5e68c002-8205-4423-a0c0-33ffe1e99b9b

**Editor Link to Retool (DON'T SHARE!): https://strivesuperapp.retool.com/apps/88bc9d54-23ba-11ee-8fcb-8bef14e1da64/Strive%20Export/strive-export**

P.S. The commented code is the part of the code that downloads the DL tables as csv files locally to your computer.


