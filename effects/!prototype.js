const minimist = require("minimist");

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


function set(led = 0, color = [0, 0, 0,]) {
    buff[led * 3 + 0] = color[0];
    buff[led * 3 + 1] = color[1];
    buff[led * 3 + 2] = color[2];
}


module.exports = (options) => {



    process.on("message", (data) => {
        Object.keys(data).forEach((k) => {
            options[k] = data[k]
        });
    });


    // export 
    return {
        set,
        args,
        buff,
        options
    };


};
