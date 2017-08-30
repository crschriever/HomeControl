let lastLocation = 'clock';

let deviceManager = {
    devices: [],
    addDevice(deviceName) {
        deviceName = sanitizeName(deviceName);
        let device = findDeviceByName(deviceName);
        if (device) {
            return device;
        } else {
            let newDevice = {
                name: deviceName,
                location: lastLocation
            }
            this.devices.push(newDevice);
            return newDevice;
        }
    },

    getDeviceLocation(deviceName) {
        deviceName = sanitizeName(deviceName);
        return findDeviceByName(deviceName).location;
    },

    setDeviceLocation(location, deviceNames) {
        if (deviceNames) {
            stringsToFind = [];
            if (typeof deviceNames === 'string') {
                stringsToFind[0] = deviceNames;
            } else if (typeof deviceNames == 'object' && deviceNames.isArray()) {
                deviceNames.forEach(function(element) {
                    stringsToFind.push(element);
                });
            } else {
                throw {
                    message: 'deviceNames must be a string or array',
                    name: 'InvalidArgumentException'
                }
            }

            for (var i = 0; i < stringsToFind.length; i++) {
                var device = findDeviceByName(sanitizeName(stringsToFind[i]));
                if (device) { // if device was found and is not undefined
                    device.location = location;
                }
            }
        } else {
            this.devices.forEach(function(element) {
                element.location = location;
            });
        }
    }
}

deviceManager.addDevice('Laptop');

function findDeviceByName(deviceName) {
    let device =  deviceManager.devices.find(function(element) {
        return element.name === deviceName;
    });

    return device;
}

function sanitizeName(deviceName) {
    return deviceName.toLowerCase();    
}

module.exports = deviceManager;