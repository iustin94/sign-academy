var controllerOptions = {};
var Finger = (function () {
    function Finger() {
        this.joints = [];
    }
    return Finger;
}());
var Hand = (function () {
    function Hand() {
        this.orientation = { below: null };
        this.palm = { facing: { front: null } };
    }
    return Hand;
}());
var ConditionNode = (function () {
    function ConditionNode(yes, no, condition) {
        this.yes = yes;
        this.no = no;
        this.condition = condition;
    }
    ConditionNode.prototype.handle = function (hand) {
        //console.log((this.condition as any).name);
        if (this.condition(hand)) {
            if (this.yes instanceof ConditionNode) {
                return this.yes.handle(hand);
            }
            else {
                return this.yes;
            }
        }
        else {
            if (this.no instanceof ConditionNode) {
                return this.no.handle(hand);
            }
            else {
                return this.no;
            }
        }
    };
    return ConditionNode;
}());
function conditionA(hand) {
    return hand.palm.facing.front;
}
function conditionB(hand) {
    return !hand.orientation.below;
}
function conditionC(hand) {
    // TODO
    return false;
}
function conditionD(hand) {
    for (var i_1 = 1; i_1 <= 4; i_1++) {
        if (!hand.fingers[i_1].extended)
            return false;
    }
    if (hand.fingers[0].extended)
        return false;
    return true;
}
function conditionE(hand) {
    return !hand.palm.facing.front;
}
function conditionF(hand) {
    return hand.orientation.below;
}
function conditionG(hand) {
    for (var i_2 = 0; i_2 <= 4; i_2++) {
        for (var j_1 = 1; j_1 <= 2; j_1++) {
            if (!hand.fingers[i_2].joints[j_1])
                return false;
        }
    }
    return true;
}
function conditionH(hand) {
    return hand.fingers[0].extended;
}
function conditionI(hand) {
    return hand.fingers[1].extended;
}
function conditionJ(hand) {
    return hand.fingers[2].extended;
}
function conditionK(hand) {
    return hand.fingers[3].extended;
}
function conditionL(hand) {
    return hand.fingers[4].extended;
}
function conditionM(hand) {
    return hand.fingersSeparated.middle && hand.fingersSeparated.index;
}
function conditionN(hand) {
    // TODO
    // return hand.
    return false;
}
function conditionO(hand) {
    return hand.fingers[1].extended && hand.fingers[2].extended;
}
function conditionP(hand) {
    return hand.fingers[0].extended && hand.fingers[1].extended;
}
var m = new ConditionNode('K', 'U', conditionM);
var b = new ConditionNode(m, 'H', conditionB);
var n = new ConditionNode('R', b, conditionN);
var o = new ConditionNode('V', n, conditionO);
var m2 = new ConditionNode('P', 'N', conditionM);
var f = new ConditionNode(m2, o, conditionF);
var l = new ConditionNode('B', 'W', conditionL);
var f2 = new ConditionNode('M', l, conditionF);
var i = new ConditionNode(f2, 'F', conditionI);
var k = new ConditionNode(i, f, conditionK);
var h = new ConditionNode('Y', 'I', conditionH);
var e = new ConditionNode('G', 'A', conditionE);
var l2 = new ConditionNode(h, e, conditionL);
var h2 = new ConditionNode('L', 'D', conditionH);
var e2 = new ConditionNode('T', h2, conditionE);
var f3 = new ConditionNode('Q', e2, conditionF);
var i2 = new ConditionNode(f3, l2, conditionI);
var j = new ConditionNode(k, i2, conditionJ);
var p = new ConditionNode('C', 'S', conditionP);
var c = new ConditionNode('O', p, conditionC);
var a = new ConditionNode(c, 'X', conditionA);
var d = new ConditionNode('E', a, conditionD);
var g = new ConditionNode(d, j, conditionG);
function analyze(hand) {
    var result = g.handle(hand);
    window.updateUI(result);
    return result;
}
//
// console.log(analyze({
//     orientation:{below:false},
//     fingers:[
//         {extended:true,joints:[
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true}
//         ]},
//         {extended:true,joints:[
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true}
//         ]},
//         {extended:true,joints:[
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true}
//         ]},
//         {extended:true,joints:[
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true}
//         ]},
//         {extended:true,joints:[
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true},
//             {name:'', bend:true}
//         ]}
//     ],
//     fingersSeparated:{index:true, middle:true},
//     palm:{facing:{front:false}}
// }));
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
            var parsed = parseHand(hand);
            // console.log(parsed,analyze(parsed));
            var result = analyze(parsed);
            window.updateUI(result);
        }
    }, 1000);
});
function parseHand(hand) {
    //console.log(hand);
    var parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.arm.basis[0][0] > 0.5;
    //console.log(parsedHand.palm.facing.front);
    parsedHand.orientation.below = hand.arm.basis[2][0] < 0;
    //console.log(parsedHand.orientation);
    parsedHand.fingers = [];
    hand.fingers.forEach(function (finger) {
        var tmp = new Finger();
        tmp.extended = finger.extended;
        for (var i_3 = 0; i_3 < 4; i_3++) {
            tmp.joints.push(finger.extended);
        }
        parsedHand.fingers.push(tmp);
    });
    // parsedHand.fingersSeparated
    return parsedHand;
}
controller.connect();
console.log('PLEB init');
//# sourceMappingURL=main.js.map