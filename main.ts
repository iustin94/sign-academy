const controllerOptions = {};

class Finger{
        extended: boolean;
        joints: boolean[]=[];
}

class Hand {
    orientation: { below: boolean }={below:null};
    palm: { facing: { front: boolean} }={facing:{front:null}};
    fingers: Finger[];
    fingersSeparated: { index: boolean, middle: boolean }
}

class ConditionNode
{
    constructor(public yes:ConditionNode|string,
                public no: ConditionNode|string,
                public condition:(Hand)=>boolean){}

    handle(hand:Hand):string{
        //console.log((this.condition as any).name);
        if(this.condition(hand)){
            if(this.yes instanceof ConditionNode){
                return this.yes.handle(hand);
            }else{
                return this.yes as string;
            }
        }else{
            if(this.no instanceof ConditionNode){
                return this.no.handle(hand);
            }else{
                return this.no as string;
            }
        }
    }
}


function conditionA(hand: Hand): boolean{
    return hand.palm.facing.front;
}

function conditionB(hand: Hand): boolean{
    return !hand.orientation.below;
}

function conditionC(hand: Hand): boolean{
    // TODO
    return false;
}

function conditionD(hand: Hand): boolean{
    for(let i = 1 ; i<= 4; i++){
        if(!hand.fingers[i].extended) return false;
    }

    if(hand.fingers[0].extended) return false;
    return true;
}

function  conditionE(hand: Hand): boolean{
    return !hand.palm.facing.front;
}

function conditionF(hand: Hand): boolean{
    return hand.orientation.below;
}

function conditionG(hand: Hand): boolean{
    for(let i = 0; i <=4; i++){
        for(let j=1; j<=2; j++){
            if(!hand.fingers[i].joints[j]) return false;
        }
    }
    return true;
}

function  conditionH(hand:Hand): boolean{
    return hand.fingers[0].extended;
}

function conditionI(hand: Hand): boolean{
    return hand.fingers[1].extended;
}

function conditionJ(hand: Hand): boolean{
    return hand.fingers[2].extended;
}

function conditionK(hand: Hand): boolean{
    return hand.fingers[3].extended;
}

function conditionL(hand: Hand): boolean{
    return hand.fingers[4].extended;
}

function conditionM(hand: Hand): boolean{
    return hand.fingersSeparated.middle && hand.fingersSeparated.index;
}

function conditionN(hand: Hand): boolean{
    // TODO
    // return hand.
    return false;
}

function conditionO(hand: Hand): boolean{
    return hand.fingers[1].extended && hand.fingers[2].extended;
}

function conditionP(hand: Hand): boolean{
    return hand.fingers[0].extended && hand.fingers[1].extended;
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

function analyze(hand:Hand) {
    let result = g.handle(hand);
    (window as any).updateUI(result);
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

let controller = new Leap.Controller();

controller.on('connect', () => {
    setInterval(() => {
        let frame = controller.frame();
        if(frame.hands.length > 0){
            let hand = frame.hands[0];
            let parsed = parseHand(hand);
            // console.log(parsed,analyze(parsed));
            let result = analyze(parsed);
            (window as any).updateUI(result);
        }
    }, 1000);

});


function parseHand(hand){
    //console.log(hand);
    let parsedHand = new Hand();
    parsedHand.palm.facing.front = hand.arm.basis[0][0] > 0.5;
    //console.log(parsedHand.palm.facing.front);

    parsedHand.orientation.below = hand.arm.basis[2][0] < 0;
    //console.log(parsedHand.orientation);

    parsedHand.fingers = [];
    hand.fingers.forEach( (finger) => {
        let tmp = new Finger();
        tmp.extended = finger.extended;

        for(let i=0;i<4;i++){
            tmp.joints.push(finger.extended);
        }

        parsedHand.fingers.push(tmp);
    });

    // parsedHand.fingersSeparated

    return parsedHand;
}
controller.connect();
console.log('PLEB init');