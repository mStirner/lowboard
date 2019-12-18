const child = require("child_process");
//const buff = Buffer.alloc(60 * 3, 0);

module.exports = function (buff) {
    return function (name, options) {

        // span independent fx process

        const fx = child.fork(`./effects/${name}.js`, [
            `--leds=${60}`,
            `--options=${JSON.stringify(options)}`
        ], {
                //stdio: ["pipe", "pipe", "ignore"]
                stdio: "pipe"
            });


        /*
        const fx = child.spawn(`./effects/test.fx`, [], {
            stdio: "pipe"
        });*/

        fx.stdout.pipe(process.stdout);

        // @TODO use stdin ?!?!?!?
        fx.stderr.on("data", (data) => {
            //console.log(data);
            for (let i = 0; buff.length > i; i++) {
                buff[i] = data[i];
            }
        });


        fx.on("error", (err) => {
            console.log("Could not spawn/fork fx: %s", name);
            console.log(err);
        });


        fx.on("exit", (code) => {

            console.log("FX exited...", code);

            if (code !== 0) {
                console.log(buff.toString());
            }


            buff.fill(0);

        });


        return fx;


    }
};