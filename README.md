# homebridge-phicomm-n1-temperature
[![npm version](https://badge.fury.io/js/homebridge-phicomm-n1-temperature.svg)](https://badge.fury.io/js/homebridge-phicomm-n1-temperature)

a homebridge plugin that get Phicomm N1 CPU temperature.

![](https://raw.githubusercontent.com/cnmb11/homebridge-phicomm-n1-temperature/master/phicommn1.jpg)

## Configuration
```
"accessories": [{
    "accessory": "PhicommN1Temperature",
    "name": "Phicomm N1 CPU Temperature"
}]
```
If you want temperature value timing update, you can set 'updateInterval' attribute(unit: milliseconds).   
```
"accessories": [{
    "accessory": "PhicommN1Temperature",
    "name": "Phicomm N1 CPU Temperature",
    "updateInterval": 1000
}]
```  
