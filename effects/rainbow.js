const minimist = require("minimist");
const syslog = require("syslog-client").createClient("192.168.2.107");

// parse cli args
const args = minimist(process.argv.slice(2), {
    string: ["options", "leds"]
});



if (!args.leds) {
    console.log("LEDs not defiend!", args);
    process.exit(100);
}


// create buffer 
const buff = Buffer.alloc(args.leds * 3, 0);


console.log("FX = rainbow", buff.length);





const options = Object.assign({
    tick: 0.001,
    angle: 0,
    distance: 0.08, //0.3
    interval: 20
}, JSON.parse(args.options));



process.on("message", (data) => {

    // override options
    Object.keys(data).forEach((k) => {
        options[k] = data[k]
    });

});



function set(led = 0, color = [0, 0, 0,]) {
    buff[led * 3 + 0] = color[0];
    buff[led * 3 + 1] = color[1];
    buff[led * 3 + 2] = color[2];
}


const peak = 5;

const interval = setInterval(function () {

    options.angle = (options.angle < Math.PI * 2) ? options.angle : options.angle - Math.PI * 2;

    for (var i = 0; i < args.leds; i++) {

        //const r = parseInt(128 + Math.sin(options.angle + (i / 3) * options.distance) * 128);
        //const g = parseInt(128 + Math.sin(options.angle * -5 + (i / 3) * options.distance) * 128);
        //const b = parseInt(128 + Math.sin(options.angle * 7 + (i / 3) * options.distance) * 128);

        const r = parseInt(128 + Math.sin(options.angle + (i / 3) * options.distance) * 128);
        const g = parseInt(128 + Math.sin(options.angle * -5 + (i / 3) * options.distance) * 128);
        const b = parseInt(128 + Math.sin(options.angle * 7 + (i / 3) * options.distance) * 128);

        if (r <= peak && g <= peak && b <= peak) {

            let msg = `LED color < 30; \n R=${r}, G=${g}, B=${b}\n ${JSON.stringify(options)}`;

            //console.log(msg);
            syslog.log(msg);

        }

        set(i, [r, g, b]);

    }

    // count up
    options.angle += options.tick;

    // write to stderr/parent
    process.stderr.write(buff);

}, options.interval);




function cleanup() {

    clearInterval(interval);
    process.exit(0);

}



process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("close", cleanup);