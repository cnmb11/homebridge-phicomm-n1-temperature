var Accessory, Service, Characteristic, UUIDGen;

const fs = require('fs');
const packageFile = require("./package.json");

module.exports = function(homebridge) {
    if(!isConfig(homebridge.user.configPath(), "accessories", "PhicommN1Temperature")) {
        return;
    }

    Accessory = homebridge.platformAccessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerAccessory('homebridge-phicomm-n1-temperature', 'PhicommN1Temperature', PhicommN1Temperature);
}

function isConfig(configFile, type, name) {
    var config = JSON.parse(fs.readFileSync(configFile));
    if("accessories" === type) {
        var accessories = config.accessories;
        for(var i in accessories) {
            if(accessories[i]['accessory'] === name) {
                return true;
            }
        }
    } else if("platforms" === type) {
        var platforms = config.platforms;
        for(var i in platforms) {
            if(platforms[i]['platform'] === name) {
                return true;
            }
        }
    } else {
    }

    return false;
}

function PhicommN1Temperature(log, config) {
    if(null == config) {
        return;
    }

    this.log = log;
    this.name = config["name"];
    if(config["file"]) {
        this.readFile = config["file"];
    } else {
        this.readFile = "/sys/class/thermal/thermal_zone0/temp";
    }
    if(config["updateInterval"] && config["updateInterval"] > 0) {
        this.updateInterval = config["updateInterval"];
    } else {
        this.updateInterval = null;
    }
    this.multiplier = config["multiplier"] || 1000;
}

PhicommN1Temperature.prototype = {
    getServices: function() {
        var that = this;

        var infoService = new Service.AccessoryInformation();
        infoService
            .setCharacteristic(Characteristic.Manufacturer, "Phicomm")
            .setCharacteristic(Characteristic.Model, "N1")
            .setCharacteristic(Characteristic.SerialNumber, "Undefined")
            .setCharacteristic(Characteristic.FirmwareRevision, packageFile.version);

        var phicommn1Service = new Service.TemperatureSensor(that.name);
        var currentTemperatureCharacteristic = phicommn1Service.getCharacteristic(Characteristic.CurrentTemperature);
        function getCurrentTemperature() {
            var data = fs.readFileSync(that.readFile, "utf-8");
            var temperatureVal = parseFloat(data) / that.multiplier;
            that.log.debug("update currentTemperatureCharacteristic value: " + temperatureVal);
            return temperatureVal;
        }
        currentTemperatureCharacteristic.updateValue(getCurrentTemperature());
        if(that.updateInterval) {
            setInterval(() => {
                currentTemperatureCharacteristic.updateValue(getCurrentTemperature());
            }, that.updateInterval);
        }
        currentTemperatureCharacteristic.on('get', (callback) => {
            callback(null, getCurrentTemperature());
        });

        return [infoService, phicommn1Service];
    }
}