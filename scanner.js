// or more concisely
const exec    = require('child_process').exec;
const request = require('request');

const regex = /([0-9a-f]{1,2}[\.:-]){5}([0-9a-f]{1,2})/;
const command = "arp -a";
const requestUrl = "https://github.com/request/request"

let active = [];

const STATUS = {
    CONNECTED: "CONNECTED",
    DISCONNECTED: "CONNECTED"
};

function findMacAddresses(output) {
    let macArray = output
        .split("\n")
        .map(l => l.match(regex))
        .filter(l => l != null)
        .map(l => l[0])
        .filter(l => l != "ff:ff:ff:ff:ff:ff");

    console.log(output);

    //add new devices
    macArray
        .filter(m => active.indexOf(m) == -1)
        .forEach(m => registerDevice(m));

    //remove missing devices
    active
        .filter(m => macArray.indexOf(m) == -1)
        .forEach(m => removeDevice(m));
}

function registerDevice(mac) {
    console.log("adding mac, ",mac);
    sendData(mac, STATUS.CONNECTED);
    active.push(mac);

}

function removeDevice(mac) {
    console.log("removing mac: ", mac);
    sendData(mac, STATUS.DISCONNECTED);
    active.splice(active.indexOf(mac), 1);
}

function sendData(mac, status) {
    let data = {
        mac: mac,
        status: status,
        timestamp: new Date(),

    };
    console.log(data);
    //request
    //    .post(
    //    {url:requestUrl, formData: data},
    //    (err, httpResponse, body) => {
    //        console.log(body)
    //    });
}

function scan() {
    exec(command,(error, output) => {
        console.log("Finding mac addresses");
        findMacAddresses(output);
        exec('sudo arp -d -i en0 -a', () => {
            setTimeout(
                () => {
                    console.log("timeouttt");
                    scan();
                }, 20000);
        });
    });
}

scan();



