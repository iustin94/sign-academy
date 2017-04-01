///<reference path="models/hand.ts"/>
const controllerOptions = {};

class Finger{
        extended: boolean;
        joints: { name:string, bend: boolean}[]=[];
};

class Hand {
    orientation: { below: boolean }={below:null};
    palm: { facing: { front: boolean} }={facing:{front:null}};
    fingers: Finger[];
    fingersSeparated: { index: boolean, middle: boolean }
};

/*
Leap.loop(controllerOptions, frame => {
    // Body of callback function

    setInterval(()=>{console.log(frame)},50000);
});
*/

function checkLibrary() { }

let controller = new Leap.Controller();

controller.on('connect', () => {
    setInterval(() => {
        let frame = controller.frame();
        if(frame.hands.length > 0){
            let hand = frame.hands[0];
            parseHand(hand);
        }
    }, 1000);

});


function parseHand(hand){
    //console.log(hand);
    let parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.arm.basis[0][0] > 0.5;
    //console.log(parsedHand.palm.facing.front);

    parsedHand.orientation.below = hand.arm.basis[2][0] > 0;
    //console.log(parsedHand.orientation);

    parsedHand.fingers = [];
    hand.fingers.forEach( (finger) => {
        let tmp = new Finger();
        tmp.extended = finger.extended;

        for(var i=0;i<4;i++){
            tmp.joints.push(finger.extended);
        }

        parsedHand.fingers.push(tmp);
    });

}
controller.connect();
