const controllerOptions = {};

class Finger {
    extended: boolean;
    joints: boolean[] = [];
}

class Hand {
    orientation: { below: boolean } = {below: null};
    palm: { facing: { front: boolean } } = {facing: {front: null}};
    fingers: Finger[] = [new Finger(), new Finger(), new Finger()];
    semipinched: boolean;
    indexMiddleFingerSeparated: boolean;
    thumbAndIndexPinched: boolean;
    thumbTouchedMiddleFinger: boolean;
    indexOverMiddle: boolean;
}

class ConditionNode {
    constructor(public yes: ConditionNode | string,
                public no: ConditionNode | string,
                public condition: (Hand) => boolean) {
    }

    handle(hand: Hand): string {
        // console.log((this.condition as any).name);
        if (this.condition(hand)) {
            if (this.yes instanceof ConditionNode) {
                return this.yes.handle(hand);
            } else {
                return this.yes as string;
            }
        } else {
            if (this.no instanceof ConditionNode) {
                return this.no.handle(hand);
            } else {
                return this.no as string;
            }
        }
    }
}

function simon(hand, pointables) {
    console.log(pointables[0].touchDistance);
    if (hand.fingers[2].dipPosition[0] == pointables[0].touchZone || hand.fingers[2].carpPosition == pointables[0].touchZone ||
        hand.fingers[2].mcpPosition == pointables[0].touchZone || hand.fingers[2].pipPosition == pointables[0].touchZone)
        return true;

    return false;
}

function conditionA(hand: Hand): boolean {
    return hand.palm.facing.front;
}

function conditionB(hand: Hand): boolean {
    return !hand.orientation.below;
}

function conditionC(hand: Hand): boolean {
    for (let i = 0; i < 5; i++) {
        if (!hand.fingers[i].extended) return true;
    }
    return false;
}

function conditionD(hand: Hand): boolean {
    for (let i = 1; i <= 4; i++) {
        if (!hand.fingers[i].extended) return false;
    }

    if (hand.fingers[0].extended) return false;
    return true;
}

function conditionE(hand: Hand): boolean {
    return !hand.palm.facing.front;
}

function conditionF(hand: Hand): boolean {
    return hand.orientation.below;
}

function conditionG(hand: Hand): boolean {
    // for (let i = 0; i <= 4; i++) {
    //     for (let j = 1; j <= 2; j++) {
    //         if (!hand.fingers[i].joints[j]) return false;
    //     }
    // }
    // return true;
    return hand.semipinched;
}

function conditionH(hand: Hand): boolean {
    return hand.fingers[0].extended;
}

function conditionI(hand: Hand): boolean {
    return hand.fingers[1].extended;
}

function conditionJ(hand: Hand): boolean {
    return hand.fingers[2].extended;
}

function conditionK(hand: Hand): boolean {
    return hand.fingers[3].extended;
}

function conditionL(hand: Hand): boolean {
    return hand.fingers[4].extended;
}

function conditionM(hand: Hand): boolean {
    return hand.thumbTouchedMiddleFinger;
}

function conditionN(hand: Hand): boolean {
    return hand.indexOverMiddle;
}

function conditionO(hand: Hand): boolean {
    return hand.indexMiddleFingerSeparated;
}

function conditionP(hand: Hand): boolean {
    return !hand.thumbAndIndexPinched;
}

const m = new ConditionNode('K', 'U', conditionM);
const b = new ConditionNode(m, 'H', conditionB);
const n = new ConditionNode('R', b, conditionN);
const o = new ConditionNode('V', n, conditionO);
const m2 = new ConditionNode('P', 'N', conditionM);
const f = new ConditionNode(m2, o, conditionF);
const l = new ConditionNode('B', 'W', conditionL);
const f2 = new ConditionNode('M', l, conditionF);
const i = new ConditionNode(f2, 'F', conditionI);
const k = new ConditionNode(i, f, conditionK);
const h = new ConditionNode('Y', 'I', conditionH);
const e = new ConditionNode('G', 'A', conditionE);
const l2 = new ConditionNode(h, e, conditionL);
const h2 = new ConditionNode('L', 'D', conditionH);
const e2 = new ConditionNode('T', h2, conditionE);
const f3 = new ConditionNode('Q', e2, conditionF);
const i2 = new ConditionNode(f3, l2, conditionI);
const j = new ConditionNode(k, i2, conditionJ);
const p = new ConditionNode('C', 'S', conditionP);
const c = new ConditionNode('O', p, conditionC);
const a = new ConditionNode(c, 'X', conditionA);
const d = new ConditionNode('E', a, conditionD);
const g = new ConditionNode(d, j, conditionG);

function analyze(hand: Hand) {
    return g.handle(hand);
}

function checkLibrary() {
}

let controller = new Leap.Controller();

controller.on('connect', () => {
    setInterval(() => {
        let frame = controller.frame();
        if (frame.hands.length > 0) {
            let hand = frame.hands[0];
            let parsed = parseHand(hand, frame.pointables);
            // console.log(hand);
            console.log(analyze(parsed));
            //console.log(parsed.palm.facing);
        }
    }, 1000);
});


function angle(dir1: number[], dir2: number[]) {
    let mag1 = Math.sqrt(dir1[0] * dir1[0] + dir1[1] * dir1[1] + dir1[2] * dir1[2]);
    let mag2 = Math.sqrt(dir2[0] * dir2[0] + dir2[1] * dir2[1] + dir2[2] * dir2[2]);
    return Math.acos((dir1[0] * dir2[0] + dir1[1] * dir2[1] + dir1[2] * dir2[2]) / (mag1 * mag2));
}

function distance(pos1: number[], pos2: number[]) {
    let result = 0;
    for (let i = 0; i < 3; i++) {
        let delta = pos1[i] - pos2[i];
        result += delta * delta;
    }

    return Math.sqrt(result);
}

function hack(hand, parsedHand) {
    // console.log(hand.direction[0],parsedHand.palm.facing.front, hand.fingers[1].extended,hand.fingers[2].extended);
    // return hand.direction[0] < - 0.2 && !parsedHand.palm.facing.front && (hand.fingers[1].extended || hand.fingers[2].extended);
    // console.log(hand.direction);
    // if (hand.direction[2] < -0.3) {
    //     console.log('going up');
    //     return false;
    // }

    if (hand.direction[0] <= -0.1) {
        // console.log('going left');
        // parsedHand.fingers[1].extended = true;
        // parsedHand.fingers[2].extended = true;
        parsedHand.indexMiddleFingerSeparated = false;
        return true;
    }

}

function touching(finger1, finger2): boolean {

    function close(pos1: number[], pos2: number[]) {
        return distance(pos1, pos2) < 50;
    }

    for (let b = 0; b < finger1.bones.length; b++) {
        for (let t = 0; t < 10; t++) {
            let pos = [];
            finger1.bones[b].lerp(pos, t / 10);
            if (close(pos, finger2.distal.center())) {
                return true;
            }
        }
    }
    return false;
}

function touchingComplete(finger1, finger2): boolean {
    return touching(finger1, finger2) || touching(finger2, finger1);
}

function parseHand(hand, pointables) {
    //console.log(hand);
    let parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.palmNormal[1] < 0;
    //console.log(parsedHand.palm.facing.front);

    parsedHand.orientation.below = hand.arm.basis[2][0] < 0;
    //console.log(parsedHand.orientation);

    // console.log(hand.fingers);
    // if(hand.fingers[1].extended && hand.fingers[2].extended) {
    const indexFingerDirection = hand.fingers[1].direction;
    const middleFingerDirection = hand.fingers[2].direction;

    parsedHand.indexMiddleFingerSeparated = angle(indexFingerDirection, middleFingerDirection) > 0.2;
    hack(hand, parsedHand);

    parsedHand.fingers = [];
    hand.fingers.forEach((finger) => {
        let tmp = new Finger();
        tmp.extended = finger.extended;

        for (let i = 0; i < 4; i++) {
            tmp.joints.push(finger.extended);
        }

        parsedHand.fingers.push(tmp);
    });


    // console.log(hand.fingers[1]);

    parsedHand.thumbTouchedMiddleFinger = touchingComplete(hand.fingers[0], hand.fingers[2]);
    // console.log(parsedHand.thumbTouchedMiddleFinger);


    // console.log(parsedHand.indexMiddleFingerSeparated);

    parsedHand.thumbAndIndexPinched = hand.pinchStrength > 0.95;
    // console.log(angle(indexFingerDirection, middleFingerDirection), hand.fingers[1].extended, hand.fingers[2].extended);

    parsedHand.semipinched = hand.pinchStrength > 0.5 && hand.pinchStrength < 1 && hand.grabStrength < 1;
    // console.log(hand.pinchStrength, hand.grabStrength, parsedHand.semipinched);

    /*
     if (pointables != null && pointables.length > 0) {
     parsedHand.indexOverMiddle = simon(hand, pointables);
     } else {
     parsedHand.indexOverMiddle = false;
     }*/

    parsedHand.indexOverMiddle = angle(hand.fingers[1],hand.fingers[2])<0.10;

    return parsedHand;
}

controller.connect();
