# sign-academy
Sign language alphabet intepreter.

This is a TypeScript framework that uses the Leap motion camera to interpret hand signs into sign language alphabet.The project was developed as our team's entry for the [#AUHack2017](https://auhack.org/) event. The framework uses the raw data provided by the camera and interprets the vector data into specific conditions that need to be fulfilled to obtain a specific letter.

For determining the letter symbol we have used the publication of Makiko Funasaka, Yu Ishikawa, Masami Takata, and Kazuki Joe [Sign Language Recognition using Leap Motion Controller](http://worldcomp-proceedings.com/proc/p2015/PDP7080.pdf). Our prliminary KPI mesurments are positive, with accuracy around 67% far away from the 82% discribed in the publication. 

To demonstrate the functionality the project has a simple Web UI that tests your ability to spell sign alphabet.

Devpost: link(https://devpost.com/software/sign-academy)

Correct:
![alt text](https://github.com/sbozhilov/sign-academy/blob/master/info/Correct.jpg "Correct")

Uncorrect:
![alt text](https://github.com/sbozhilov/sign-academy/blob/master/info/Uncorrect.jpg "Uncorrect")
