///<reference path="models/hand.ts"/>
var controllerOptions = {};
var Finger = (function () {
    function Finger() {
        this.joints = [];
    }
    return Finger;
}());
;
var Hand = (function () {
    function Hand() {
        this.orientation = { below: null };
        this.palm = { facing: { front: null } };
    }
    return Hand;
}());
;
/*
Leap.loop(controllerOptions, frame => {
    // Body of callback function

    setInterval(()=>{console.log(frame)},50000);
});
*/
function checkLibrary() { }
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
    //console.log(hand);
    var parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.arm.basis[0][0] > 0.5;
    //console.log(parsedHand.palm.facing.front);
    parsedHand.orientation.below = hand.arm.basis[2][0] > 0;
    //console.log(parsedHand.orientation);
    parsedHand.fingers = [];
    hand.fingers.forEach(function (finger) {
        var tmp = new Finger();
        tmp.extended = finger.extended;
        for (var i = 0; i < 4; i++) {
            tmp.joints.push(finger.extended);
        }
        parsedHand.fingers.push(tmp);
    });
}
controller.connect();
//# sourceMappingURL=main.js.map