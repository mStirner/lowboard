const minimist = require("minimist");

// parse cli args
const args = minimist(process.argv.slice(2), {
    string: ["options"]
});


const options = Object.assign({
    //color: [...]
}, args.options);


if (!args.leds) {
    console.log("LEDs not defiend!", args);
    process.exit(100);
}


// create buffer 
const buff = Buffer.alloc(args.leds * 3, 0);


console.log("FX = raindrop", buff.length);



// drops on strip
const drops = 7;


// led/drops in use
// animation in progress on led
const ledInUse = [];


/**
 * Pick random number between <min>/<max>
 * @param {Number} max 
 * @param {Number} min 
 */
function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}


/**
 * create raindrop animation
 */
function drop() {

    // pick random numbers
    let led = random(args.leds);
    let int = random(150, 50);


    // pick another led if picked one
    // is in ledInUse array
    while ((led in ledInUse)) {
        led = random(args.leds);
    }


    // add led to ledInUse/in use
    ledInUse.push(led);


    // fade led to color value
    // "fill the rain drop"
    let interval = setInterval(() => {

        // increase color(s)
        let val_G = buff[led * 3 + 2] += 2;
        let val_B = buff[led * 3 + 1] += 2;
        //let val_R = buff[led * 3 + 0] += 2;

        if (val_G >= 80 && val_B >= 100) {

            //buff[led * 3 + 2] = 0;
            //buff[led * 3 + 1] = 0;
            clearInterval(interval);


            // fade to 0
            // "make the rain drop *drop*"
            interval = setInterval(() => {

                // decrease color(s)
                val_G = buff[led * 3 + 2] -= 10;
                val_B = buff[led * 3 + 1] -= 10;
                //val_R = buff[led * 3 + 0] -= 10;

                // wait till we are on 0
                if (val_G <= 0 && val_B <= 0) {

                    buff[led * 3 + 2] = 0;
                    buff[led * 3 + 1] = 0;
                    //buff[led * 3 + 0] = 0;

                    clearInterval(interval);


                    // remove led from ledInUse array
                    ledInUse.splice(ledInUse.indexOf(led), 1);


                    // create new drop 
                    drop();

                }

            }, 10);



            //console.log("LED %d done", led);

        }

    }, int);

}


buff.fill(0);
process.stderr.write(buff);


for (let i = 0; drops > i; i++) {
    drop();
}

const interval = setInterval(() => {
    process.stderr.write(buff);
});


function cleanup() {

    clearInterval(interval);
    process.exit(0);

}

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("close", cleanup);