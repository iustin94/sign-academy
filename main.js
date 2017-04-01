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
        this.fingers = [new Finger(), new Finger(), new Finger()];
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
        // console.log((this.condition as any).name);
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
function simon(hand, pointables) {
    console.log(pointables[0].touchDistance);
    if (hand.fingers[2].dipPosition[0] == pointables[0].touchZone || hand.fingers[2].carpPosition == pointables[0].touchZone ||
        hand.fingers[2].mcpPosition == pointables[0].touchZone || hand.fingers[2].pipPosition == pointables[0].touchZone)
        return true;
    return false;
}
function conditionA(hand) {
    return hand.palm.facing.front;
}
function conditionB(hand) {
    return !hand.orientation.below;
}
function conditionC(hand) {
    for (var i_1 = 0; i_1 < 5; i_1++) {
        if (!hand.fingers[i_1].extended)
            return true;
    }
    return false;
}
function conditionD(hand) {
    for (var i_2 = 1; i_2 <= 4; i_2++) {
        if (!hand.fingers[i_2].extended)
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
    // for (let i = 0; i <= 4; i++) {
    //     for (let j = 1; j <= 2; j++) {
    //         if (!hand.fingers[i].joints[j]) return false;
    //     }
    // }
    // return true;
    return hand.semipinched;
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
    return hand.thumbTouchedMiddleFinger;
}
function conditionN(hand) {
    return hand.indexOverMiddle;
}
function conditionO(hand) {
    return hand.indexMiddleFingerSeparated;
}
function conditionP(hand) {
    return !hand.thumbAndIndexPinched;
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
    return g.handle(hand);
}
function checkLibrary() {
}
var controller = new Leap.Controller();
controller.on('connect', function () {
    setInterval(function () {
        var frame = controller.frame();
        if (frame.hands.length > 0) {
            var hand = frame.hands[0];
            var parsed = parseHand(hand, frame.pointables);
            // console.log(hand);
            console.log(analyze(parsed));
            //console.log(parsed.palm.facing);
        }
    }, 1000);
});
function angle(dir1, dir2) {
    var mag1 = Math.sqrt(dir1[0] * dir1[0] + dir1[1] * dir1[1] + dir1[2] * dir1[2]);
    var mag2 = Math.sqrt(dir2[0] * dir2[0] + dir2[1] * dir2[1] + dir2[2] * dir2[2]);
    return Math.acos((dir1[0] * dir2[0] + dir1[1] * dir2[1] + dir1[2] * dir2[2]) / (mag1 * mag2));
}
function distance(pos1, pos2) {
    var result = 0;
    for (var i_3 = 0; i_3 < 3; i_3++) {
        var delta = pos1[i_3] - pos2[i_3];
        result += delta * delta;
    }
    return Math.sqrt(result);
}
function hack(hand, parsedHand) {
    // console.log(hand.direction[0],parsedHand.palm.facing.front, hand.fingers[1].extended,hand.fingers[2].extended);
    // return hand.direction[0] < - 0.2 && !parsedHand.palm.facing.front && (hand.fingers[1].extended || hand.fingers[2].extended);
    console.log(hand.direction);
    // if (hand.direction[2] < -0.3) {
    //     console.log('going up');
    //     return false;
    // }
    if (hand.direction[0] <= -0.1) {
        console.log('going left');
        parsedHand.fingers[1].extended = true;
        parsedHand.fingers[2].extended = true;
        parsedHand.indexMiddleFingerSeparated = false;
        return true;
    }
}
function touching(finger1, finger2) {
    function close(pos1, pos2) {
        return distance(pos1, pos2) < 50;
    }
    for (var b_1 = 0; b_1 < finger1.bones.length; b_1++) {
        for (var t = 0; t < 10; t++) {
            var pos = [];
            finger1.bones[b_1].lerp(pos, t / 10);
            if (close(pos, finger2.distal.center())) {
                return true;
            }
        }
    }
    return false;
}
function touchingComplete(finger1, finger2) {
    return touching(finger1, finger2) || touching(finger2, finger1);
}
function parseHand(hand, pointables) {
    //console.log(hand);
    var parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.palmNormal[1] < 0;
    //console.log(parsedHand.palm.facing.front);
    parsedHand.orientation.below = hand.arm.basis[2][0] < 0;
    //console.log(parsedHand.orientation);
    // console.log(hand.fingers);
    // if(hand.fingers[1].extended && hand.fingers[2].extended) {
    var indexFingerDirection = hand.fingers[1].direction;
    var middleFingerDirection = hand.fingers[2].direction;
    parsedHand.indexMiddleFingerSeparated = angle(indexFingerDirection, middleFingerDirection) > 0.2;
    hack(hand, parsedHand);
    parsedHand.fingers = [];
    hand.fingers.forEach(function (finger) {
        var tmp = new Finger();
        tmp.extended = finger.extended;
        for (var i_4 = 0; i_4 < 4; i_4++) {
            tmp.joints.push(finger.extended);
        }
        parsedHand.fingers.push(tmp);
    });
    // console.log(hand.fingers[1]);
    parsedHand.thumbTouchedMiddleFinger = touchingComplete(hand.fingers[0], hand.fingers[2]);
    // console.log(parsedHand.thumbTouchedMiddleFinger);
    console.log(parsedHand.indexMiddleFingerSeparated);
    parsedHand.thumbAndIndexPinched = hand.pinchStrength > 0.95;
    // console.log(angle(indexFingerDirection, middleFingerDirection), hand.fingers[1].extended, hand.fingers[2].extended);
    parsedHand.semipinched = hand.pinchStrength > 0.5 && hand.pinchStrength < 1 && hand.grabStrength < 1;
    console.log(hand.pinchStrength, hand.grabStrength, parsedHand.semipinched);
    /*
     if (pointables != null && pointables.length > 0) {
     parsedHand.indexOverMiddle = simon(hand, pointables);
     } else {
     parsedHand.indexOverMiddle = false;
     }*/
    parsedHand.indexOverMiddle = false;
    return parsedHand;
}
controller.connect();
//# sourceMappingURL=main.js.map