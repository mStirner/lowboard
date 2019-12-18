const minimist = require("minimist");

// parse cli args
const args = minimist(process.argv.slice(2), {
    // options
});


if (!args.leds) {
    console.log("args.leds not defiend!", args);
    process.exit(100);
}


// create buffer 
const buff = Buffer.alloc(args.leds * 3, 0);


console.log("FX = nightrider", buff.length);


let counter = 0;
let reverse = false;


function set(led = 0, color = [0, 0, 0,]) {
    buff[led * 3 + 0] = color[0];
    buff[led * 3 + 1] = color[1];
    buff[led * 3 + 2] = color[2];
}


setInterval(() => {

    // nur prüfenob reverse oder nicht
    if (args.leds > counter && !reverse) {

        // // buff.fill(0);
        for (let i = 0; args.leds > i; i++) {
            set(i, [0, 0, 0]);
        }

        set(counter, [0, 80, 100]);
        counter++

        if (args.leds === counter) {
            reverse = true;
        }

    } else if (reverse) {

        // buff.fill(0);
        for (let i = 0; args.leds > i; i++) {
            set(i, [0, 0, 0]);
        }

        set(counter, [0, 80, 100]);
        counter--;

        if (counter === 0) {
            reverse = false;
        }

    }

    //ws.send(buff);

}, 20); // 20

setInterval(() => {
    process.stderr.write(buff);
});



function cleanup() {
    process.exit(0);
}



process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("close", cleanup);