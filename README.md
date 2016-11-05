# Time Series Analysis Server
## Setup:

  1. Download influxDB:

    **MacOS:**
    ```
    brew update
    brew install influxdb
    ```

    **Windows/Other**
    https://docs.influxdata.com/influxdb/v1.0/introduction/installation

  2. Start influxDB:
    ```
    influxd
    ```

  3. Install dependancies & start server:
    ```
    npm install
    npm start
    ```

## Access influxDB
  * Go to http://localhost:8083
