#!/usr/bin/node

// http://tibbo.com/linux/nodejs/service-file.html
// https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service

const SPI = require("pi-spi");
const WebSocket = require("ws");
const minimist = require("minimist");



const argv = minimist(process.argv.slice(2), {
    boolean: ['remoteBuffer']
});


console.log("SPI DEVICE STARTED...");

// /dev/spidev0.0
const bus = SPI.initialize("/sys/class/spi_master/spi2");


bus.clockSpeed(50000); // 50000 & 100000 & 80000
//bus.dataMode(SPI.mode.CPOL);
//bus.bitOrder(SPI.order.LSB_FIRST);


const LEDs = 10;
const buff = Buffer.alloc(LEDs * 3, 0);


// fx process handler
const handler = require("./fx-handler.js")(buff);
var fx = null;


/*
{
	"color-warmwhite": [180, 220, 5, 0.1],
	"color-blue": [0, 80, 120, 0.3],
	"color-green": [0, 50, 0],
	"color-yellow": [100, 90, 0],
	"color-orange": [100, 50, 0],
	"color-lila": [100, 0, 120],
	"color-blank": [0,0,0]
}
*/


function loop() {
    bus.write(buff, function (err) {
        if (err) {

            // error logging
            console.log("ERROR", err);

            bus.close(() => {

                // exit node process
                process.exit();

            });

        } else {

            // set flag
            //started = true;

            // write permanent to 
            // the spi bus/device
            //setTimeout(loop, 1000);
            loop();

        }
    });
}



loop();


(function () {

    const wss = new WebSocket.Server({
        port: 8081
    });

    wss.on("connection", (ws) => {

        // feedback
        console.log("WebSocket connected");


        // listen for messages/data
        ws.on("message", (data) => {

            if (fx) {
                fx.kill();
            }

            //Buffer.concat([buff, data], buff.length);

            process.nextTick(() => {
                for (let i = 0; buff.length > i; i++) {
                    buff[i] = data[i];
                }
            });



        });


        ws.on("close", () => {
            console.log("WebSocket disconnected");
        });


    });

})();



(function () {

    const wss = new WebSocket.Server({
        port: 8080
    });

    wss.on("connection", (ws) => {

        // feedback
        console.log("WebSocket connected");


        // listen for messages/data
        ws.on("message", (data) => {

            data = JSON.parse(data);

            if (data.fx) {

                if (fx) {
                    fx.kill();
                }

                console.log("Spawn fx = %s", data.fx)

                // create/spawn fx process
                fx = handler(data.fx, data.options || {});

            } else if (data.options) {

                if (fx) {
                    fx.send(data.options);
                }

            } else {

                ws.send(JSON.stringify({
                    error: "INVALID_OPERATION"
                }));

            }


        });


        ws.on("close", () => {
            console.log("WebSocket disconnected");
        });


    });

})();