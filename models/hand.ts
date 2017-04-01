import {Finger} from "./finger";
export class Hand {
    orientation: { below: boolean };
    palm: { facing: { front: boolean} };
    fingers: Finger[];
    fingersSeparated: { index: boolean; middle: boolean; };
}
