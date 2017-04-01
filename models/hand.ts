class Hand {
    orientation: { below: boolean };
    palm: { facing: { front: boolean; back: boolean; } };
    fingers: Finger[];
    fingersSeparated: { index: boolean; middle: boolean; };
}