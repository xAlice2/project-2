$('document').ready(function() {
	console.log(" executing ");
	//Set default timer lengths (in seconds)
	var breakTime = 300;
	var sessionTime = 1500;

	//Set the countdown timer for the first Session 
	var clockTime = sessionTime;
	var clockType = 'session';
	
	//Tell the app that the clock isn't running
	var clockRunning = false;

	//Set an ID to use with setInterval and clearInterval
	var countdownID;

	//Functions to convert seconds to friendly formats
	var inMinSec = function(time) {
		var m = Math.floor(time/60);
		var s = time % 60;

		if (s < 10) {
			s = '0' + s.toString();
		}
		return m + ':' + s;
	};

	var inMinOnly = function(time) {
		return (time / 60).toFixed();
	}

	//Functions for pushing timer values to the UI in friendly formats
	var updateBreakIndicator = function() {
		$('#break-indicator').text(inMinOnly(breakTime));
	}

	var updateSessionIndicator = function() {
		$('#session-indicator').text(inMinOnly(sessionTime));
		if (clockType === 'session') {
			$('#clock-counter').text(inMinSec(sessionTime));
		}
	}

	var updateClockCounter = function() {
		$('#clock-counter').text(inMinSec(clockTime));
	}

	//Update the progress bar. 'Progress' should be an int from 0-100.
	var updateProgress = function(progress){
		progress = Math.abs(progress - 100).toFixed(2).toString() + '%';
	    $('#inner').height(progress);
	};

	//Initialize the UI
	var resetApp = function() {
		clockTime = sessionTime;
		clockType = 'session';
		updateBreakIndicator();
		updateSessionIndicator();
		updateClockCounter();
		updateProgress(100);
		$('#clock-label').text('Session');
		$('#clock-button').text('Start');
		$('#reset-button').attr('disabled', true);
	}

	resetApp();

	//Click Handlers for changing the break and session lengths.
	//If the clock is running, don't allow the times to be changed.
	$('#break-minus').click(function () {
		//If the clock is running, don't allow the times to be changed.
		if (clockRunning) {return;}

		//Don't allow negative time values
		if (breakTime > 0 && clockType === 'break') {
			breakTime -= 60;
			clockTime = breakTime;
			updateBreakIndicator();
			updateClockCounter();
		} else if (breakTime > 0) {
			//Increment the time by one minute
			breakTime -= 60;
			updateBreakIndicator();
		}
	});

	$('#break-plus').click(function () {
		if (clockRunning) {return;}

		if (clockType === 'break') {
			breakTime += 60;
			clockTime = breakTime;
			updateBreakIndicator();
			updateClockCounter();
		} else {
			breakTime += 60;
			updateBreakIndicator();
		}
	});

	$('#session-minus').click(function () {
		if (clockRunning) {return;}

		if (sessionTime > 0) {
			sessionTime -= 60;
			resetApp();
		}
	});

	$('#session-plus').click(function () {
		if (clockRunning) {return;}
		sessionTime += 60;
		resetApp();
	});


	//Timer function. When the session time runs out, switch to break time,
	//and vice-versa.
	var countdown = function() {
		if (clockTime > 0 && clockRunning) {
			clockTime -= 1;
			updateClockCounter();
			if (clockType === 'session') {
				updateProgress(clockTime / sessionTime * 100);		
			} else {
				updateProgress(clockTime / breakTime * 100);
			}
		} else if (clockTime === 0 && clockRunning) {
			if (clockType === 'session') {
				$('#clock-label').text('Break');
				clockType = 'break';
				clockTime = breakTime;
			} else if (clockType === 'break') {
				$('#clock-label').text('Session');
				clockType = 'session';
				clockTime = sessionTime;
			}
		}
	};

	//Start-Stop Click Handler
	$('#clock-button').click(function() {
		if (clockRunning) {
			clockRunning = false;
			window.clearInterval(countdownID);
			$('#clock-button').text('Resume');
			$('#reset-button').attr('disabled', false);
		} else {
			clockRunning = true;
			countdownID = window.setInterval(countdown, 1000);
			$('#clock-button').text('Pause');
			$('#reset-button').attr('disabled', true);
		}
	});

	//Reset Click Handler
	$('#reset-button').click(function() {
		resetApp();
	});

});