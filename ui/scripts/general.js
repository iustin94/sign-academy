function updateUI(result) {
	console.log("FROM PRETTY UI: " + result);
	window.setValue(result);
}

$( document ).ready(function() {

	var shownLetters = [];

	var questionNumber = 0;
	var currentLetter = '';

	var letterBorder = document.querySelector('svg #letter-border');
	var letterBorderQ = $('#letter-border');
	var letterText = $('#letter-text');
	var questionText = $('.question');
	var length = letterBorder.getTotalLength();

	resetRectangle();

	$('#how-button').click(function() {
		swal({
		  title: "That's how you show " + currentLetter,
		  confirmButtonText: "Thanks!",
			imageUrl: "ui/images/" + currentLetter + ".png",
			imageSize: "180x180"
		});
	});

	$('.owl-carousel').owlCarousel({
	    loop:false,
	    margin:5,
	    nav:false,
			bullets: false,
			dots: true,
	    responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:3
	        },
	        1000:{
	            items: 14
	        }
	    }
	});

	function resetRectangle() {
		length = letterBorder.getTotalLength();
		letterBorder.style.transition = letterBorder.style.WebkitTransition =
			'none';
		// Set up the starting positions
		letterBorder.style.strokeDasharray = length + ' ' + length;
		letterBorder.style.strokeDashoffset = length;
		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		letterBorder.getBoundingClientRect();
		// Define our transition
		//path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out, stroke 2s ease-in-out, opacity 1s ease-in-out';

		letterBorder.style.stroke = "#BDBDBD";
		TweenMax.to('question', 0.5, {opacity: 1});
	  letterText.css("fill", "#000");
		letterBorderQ.css({fill: "transparent"});
		TweenMax.to([letterText, letterBorder], 2, {opacity: 1});
	}

	nextQuestion();

	function showQuestion(question, letter) {
		currentLetter = letter;
		$('.question').html(question);
		resetRectangle();
		letterText.text(letter);
	}

	function nextQuestion() {

		var characters = [];
		for(var i=65; i<90; i++){
			characters.push(String.fromCharCode(i));
		}
		console.log(characters[questionNumber],questionNumber);
		showQuestion('Please show letter ' + characters[questionNumber], characters[questionNumber]);
		questionNumber++;

	}

	$('.letter-box').click(function() {
		setTimeout(function(){ moveTo40(); }, 1000);
		setTimeout(function(){ moveTo60(); }, 2000);
		setTimeout(function(){ moveTo80(); }, 3000);
		setTimeout(function(){ moveTo100(); }, 4000);
	});

	function moveTo40() {
		TweenMax.to(letterBorder, 0.5, {strokeDashoffset: length * (100 - 40) * 0.01, stroke: "#FF7043", ease:Linear.easeNone, onComplete: function() {
		}});
	}

	function moveTo60() {
		TweenMax.to(letterBorder, 0.5, {strokeDashoffset: length * (100 - 60) * 0.01, stroke: "#FFA726", ease:Linear.easeNone, onComplete: function() {

		}});
	}

	function moveTo80() {
		TweenMax.to(letterBorder, 0.5, {strokeDashoffset: length * (100 - 80) * 0.01, stroke: "#9CCC65", ease:Linear.easeNone, onComplete: function() {

		}});
	}

	function moveTo100() {
		TweenMax.to(letterBorder, 0.5, {strokeDashoffset: 0, stroke: "#66BB6A", ease:Linear.easeNone, onComplete: function() {
			TweenMax.to(letterBorder, 0.5, {fill: "#66BB6A"});
			TweenMax.to(letterText, 0.5, {fill: "#fff"});
			$('.question').html('Awesome, you showed letter ' + currentLetter + '!');

			TweenMax.to([letterText, letterBorder], 2, {opacity: 0, onComplete: function() {

				if($.inArray(currentLetter, shownLetters) <= -1) {
						console.log(shownLetters);
						$('.nav-letters')
					  .owlCarousel('add', '<div class="nav-item" data-number="' + questionNumber + '"><div class="nav-letter"><span>' + currentLetter + '</span></div></div>')
					  .owlCarousel('update');
						shownLetters.push(currentLetter);
				}

				$('.nav-item').click(function() {
					questionNumber = parseInt($(this).data('number')) - 1;
					nextQuestion();
				});

				nextQuestion();
			}});
		}});
	}

	function setValue(value){
		value = currentLetter===value;
		value *= 100;
		if(value < 30){
			moveTo40();
		}else if(value < 60){
			moveTo60();
		}else if(value < 80){
			moveTo80();
		}else{
			moveTo100();
		}
	}

	window.setValue = setValue;

});
