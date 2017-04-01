// Setup Leap loop with frame callback function
const controllerOptions = {};

/*
Leap.loop(controllerOptions, frame => {
    // Body of callback function

    setInterval(()=>{console.log(frame)},50000);
});
*/

function checkLibrary() { };

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
    console.log(hand);




}
controller.connect();
