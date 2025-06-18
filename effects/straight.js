const minimist = require("minimist");

// parse cli args
const args = minimist(process.argv.slice(2), {
    string: ["options"]
});


const options = Object.assign({
    color: [0, 0, 0],
    brightness: 1,
    interval: 20
}, JSON.parse(args.options));


process.on("message", (data) => {

    // override options
    Object.keys(data).forEach((k) => {
        options[k] = data[k]
    });

});


if (!args.leds) {
    console.log("LEDs not defiend!", args);
    process.exit(100);
}


// create buffer 
const buff = Buffer.alloc(args.leds * 3, 0);

console.log("FX = straight", buff.length);

const interval = setInterval(() => {

    for (let i = 0; buff.length > i; i++) {

        // RGB settings
        buff[i * 3 + 0] = options.color[0] || 0;
        buff[i * 3 + 2] = options.color[1] || 0;
        buff[i * 3 + 1] = options.color[2] || 0;

    }

    process.stderr.write(buff);

}, options.interval);

function cleanup() {
    clearInterval(interval);
    process.exit(0);
}



process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("close", cleanup);
