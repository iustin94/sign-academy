// Setup Leap loop with frame callback function
var controllerOptions = {};
/*
Leap.loop(controllerOptions, frame => {
    // Body of callback function

    setInterval(()=>{console.log(frame)},50000);
});
*/
function checkLibrary() { }
;
var controller = new Leap.Controller();
controller.on('connect', function () {
    setInterval(function () {
        var frame = controller.frame();
        if (frame.hands.length > 0) {
            var hand = frame.hands[0];
            parseHand(hand);
        }
    }, 1000);
});
function parseHand(hand) {
    console.log(hand);
}
controller.connect();
//# sourceMappingURL=main.js.map