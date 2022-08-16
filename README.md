# GMSA Genomics FHIR web app

Prototype for FHIR genomics reports.


## Running a development version 

### Dependencies 

The project is built using React and requires an up-to-date version of node and npm to be installed.
These can be checked on the command line on unix systems:

```shell
node -v
```
| v17.4.0

```shell
npm -v
```
| 8.3.1



To setup a local version clone the repository and install the npm dependencies
```shell
git clone git@github.com:gosh-dre/gmsa_genomic_fhir_webapp.git
cd gmsa_genomic_fhir_webapp
npm install
```

## Configuration

From the root of the project, copy the test env file to the root directory so that the application can use the correct environmental variables. 
The `.env` file is ignored by git so won't be accidentally committed.  

```shell
cp env/dev.env .env 
```

This file will need to be edited to allow automated testing to determine if the LOINC api is returning different value sets.
You may also want to edit other variables 

## Development services

Start the FHIR server and nginx in docker, running in the background

```shell
docker compose -f docker-compose.dev.yml up -d
```

    [+] Running 3/3
    ⠿ Network fhir-report_default      Created                                                                                                                                                                                           0.1s
    ⠿ Container fhir-report-fhir-db-1  Started                                                                                                                                                                                           0.7s
    ⠿ Container fhir-report-fhir-1     Started                                                                                                                                                                                           0.8s


The status of the services using `ps`

```shell
docker compose -f docker-compose.dev.yml ps
```

            Name                       Command               State               Ports             
    -----------------------------------------------------------------------------------------------
    fhir-report_fhir-db_1   docker-entrypoint.sh postgres    Up      5432/tcp                      
    fhir-report_fhir_1      catalina.sh run                  Up      0.0.0.0:8090->8080/tcp        

## Building and running

- From the repository directory, you can build and run development version using `npm start`
- Tests can be run by: `npm test`
- A production build can be created using `npm run build`
