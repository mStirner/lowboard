const minimist = require("minimist");

// parse cli args
const args = minimist(process.argv.slice(2), {
    // options
});


if (!args.leds) {
    console.log("LEDs not defiend!", args);
    process.exit(100);
}


// create buffer 
const buff = Buffer.alloc(args.leds * 3, 0);


console.log("FX = stop/clear", buff.length);



buff.fill(0);

process.stderr.write(buff);

process.nextTick(() => {
    process.exit(0);
});