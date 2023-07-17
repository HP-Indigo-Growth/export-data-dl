const express = require('express');
const { join } = require("path");
const pg = require('pg');
const fs = require('fs');
const Json2csvParser = require("json2csv").Parser;
const { Storage } = require('@google-cloud/storage');

const router = express.Router();

const pgConfig = {
  max: 1,
  user: process.env.SQL_USER || "postgres",
  password: process.env.SQL_PASSWORD || "@gunr2312",
  database: process.env.SQL_NAME || "postgres",
  host: `127.0.0.1`,
  port: 5433
};

const gc = new Storage({
  keyFilename: join(__dirname, "/strive-dev-243310-592d082f93c1.json"),
  projectId: 'strive-dev-243310'
});

const bucketName = 'strive-dls-bucket';
const striveDLsBucket = gc.bucket(bucketName);

router.get("/getData/dls", async (req, res) => {
  let pgPool;
  if (!pgPool) pgPool = new pg.Pool(pgConfig);
  exportDLsToCSV(pgPool);
});

router.get("/getData/beats", async (req, res) => {
    let pgPool;
    if (!pgPool) pgPool = new pg.Pool(pgConfig);
    exportBeatsToCSV(pgPool);
  });

const exportDLsToCSV = async (pgPool)=>{
    if(!pgPool) return;
    var managedTablesQuery = `SELECT concat(schema, '.', "table") as table_name, "table" as dl_name
                                FROM db_ninja.managed_user_tables`;

    try {
        client = await pgPool.connect();

        var managedTablesResult = await client.query(managedTablesQuery);
        const managedTablesJsonData = JSON.parse(JSON.stringify(managedTablesResult.rows));

        for (i in managedTablesJsonData)
              try {
                var dataFromTableQuery = `select * from ${managedTablesJsonData[i].table_name}`;
                var dlDataResult = await client.query(dataFromTableQuery);
                const jsonData = JSON.parse(JSON.stringify(dlDataResult.rows));

                var json2csvParser = new Json2csvParser({ header: true});
                var csv = json2csvParser.parse(jsonData);

                const filename = `${managedTablesJsonData[i].dl_name}.csv`;

                // await new Promise((resolve, reject) => {
                //     fs.writeFile(filename, csv, function (error) {
                //       if (error) reject(error);
                //       else {
                //         console.log(`Exporting to table '${filename}' successfully!`);
                //         resolve();
                //       }
                //     });
                //   });
                
                
                const file = striveDLsBucket.file(filename);
                await file.save(csv, { contentType: 'text/csv' });
                console.log(`Uploading ${filename} to GCS bucket '${bucketName}' successfully!`);
              } catch (e) {
                 console.error(e)
              }

        var regularTablesIDsQuery = `select name as dl_name, dl_id
                                    from db_ninja.ninja_dl nd
                                    join db_ninja.ninja_product_template_dl nptd on nptd.dl_id = nd.id
                                    where type = 0`;
        var regularTablesIDsResult = await client.query(regularTablesIDsQuery);
        const regularTablesIDsJsonData = JSON.parse(JSON.stringify(regularTablesIDsResult.rows));

        for (j in regularTablesIDsJsonData)
        try {

            var usersPerDLQuery = `select *
                                from  db_app.users
                                where id in (
                                            select user_id from
                                            db_ninja.ninja_dl_users ndu 
                                            where dl_id = ${regularTablesIDsJsonData[j].dl_id})`;

            var userPerDLsResult = await client.query(usersPerDLQuery);
            const userPerDLsJsonData = JSON.parse(JSON.stringify(userPerDLsResult.rows));
            
            var json2csvParser2 = new Json2csvParser({ header: true});
            var csv2 = json2csvParser2.parse(userPerDLsJsonData);

            const filename2 = `${regularTablesIDsJsonData[j].dl_name}.csv`;

            // await new Promise((resolve, reject) => {
            //     fs.writeFile(filename2, csv2, function (error) {
            //       if (error) reject(error);
            //       else {
            //         console.log(`Exporting to table '${filename2}' successfully!`);
            //         resolve();
            //       }
            //     });
            //   });

            const file2 = striveDLsBucket.file(filename2);
            await file2.save(csv2, { contentType: 'text/csv' });
            console.log(`Uploading ${filename2} to GCS bucket '${bucketName}' successfully!`);

        } catch (e) {
            console.error(e);
        }
        await client.release();
        console.log("Done uploading to GCP!")
    } catch (err) {
        console.log(err);
    }
}


  const exportBeatsToCSV = async (pgPool)=>{
    if(!pgPool) return;
    var productNamesQuery = `select mnpt.product_name, mnpt.product_description, pt.product_id,
                                      concat(product_description, '_template') as bucket_file_name
                              from db_ninja.mail_ninja_products_tbl mnpt
                              left join db_ninja.product_templates pt on mnpt.id = pt.product_id 
                              where deleted_at is null and mnpt.product_description != '';`;

    try {
        client = await pgPool.connect();

        var productNamesResult = await client.query(productNamesQuery);
        const productNamesResultJsonData = JSON.parse(JSON.stringify(productNamesResult.rows));

        for (i in productNamesResultJsonData)
              try {
                console.log(productNamesResultJsonData[i])
                // var dataFromTableQuery = `select * from ${managedTablesJsonData[i].table_name}`;
                // var dlDataResult = await client.query(dataFromTableQuery);
                // const jsonData = JSON.parse(JSON.stringify(dlDataResult.rows));

                // var json2csvParser = new Json2csvParser({ header: true});
                // var csv = json2csvParser.parse(jsonData);

                // const filename = `${managedTablesJsonData[i].dl_name}.csv`;

                // await new Promise((resolve, reject) => {
                //     fs.writeFile(filename, csv, function (error) {
                //       if (error) reject(error);
                //       else {
                //         console.log(`Exporting to table '${filename}' successfully!`);
                //         resolve();
                //       }
                //     });
                //   });
                
                
                // const file = striveDLsBucket.file(filename);
                // await file.save(csv, { contentType: 'text/csv' });
                console.log(`Uploading ${filename} to GCS bucket '${bucketName}' successfully!`);
              } catch (e) {
                 console.error(e)
              }

        var regularTablesIDsQuery = `select name as dl_name, dl_id
                                    from db_ninja.ninja_dl nd
                                    join db_ninja.ninja_product_template_dl nptd on nptd.dl_id = nd.id
                                    where type = 0`;
        var regularTablesIDsResult = await client.query(regularTablesIDsQuery);
        const regularTablesIDsJsonData = JSON.parse(JSON.stringify(regularTablesIDsResult.rows));

        await client.release();
        console.log("Done uploading to GCP!")
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;
