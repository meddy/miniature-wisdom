// import db from "./db";
//
// const selectAdmin = db.prepare("SELECT * FROM users WHERE is_admin = 1");
//
// const admin = selectAdmin.get();
// if (admin) {
//   throw new Error("Admin already exists.");
// }
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("username: ", function (username) {
    console.log(username);
    process.stdin.on("keypress", function () {
        // get the number of characters entered so far:
        var len = rl.line.length;
        // move cursor back to the beginning of the input:
        readline.moveCursor(process.stdout, -len, 0);
        // clear everything to the right of the cursor:
        readline.clearLine(process.stdout, 1);
        // replace the original input with asterisks:
        for (var i = 0; i < len; i++) {
            process.stdout.write("*");
        }
    });
    rl.question("Enter your password: ", function (pw) {
        // pw == the user's input:
        console.log(pw);
        rl.close();
    });
});
// rl.history = rl.history.slice(1);
