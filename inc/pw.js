/** --------------------------------------------------------------------------------
* AnalogPass
* 
* A password-less authentication prototype which allows users to validate
* their authenticity through input patterns vs. a traditional password.
*
* Ian Chan
* --------------------------------------------------------------------------------*/
// This is the pair the needed to store for an analog password
var pat1 = {
	// The target login
	value:"user@email.com",
	
	// The target input pattern stream
	pattern:[940,110,71,72,256,297,127,96,97,71,192,113,87,96,160]
}

function analogpass(formObj) {
	// Should we check the first character (focus to input)
	var ignoreFirst = true;
	// How close in ms should is the tolerence
	var threshold_abs = 70;
	// How close in % should the relative change be
	var threshold_rel = 70;
	// Store the recent input stream deltas
	var buffer;
	// Store the time of the last input
	var last = 0;
	// Create the new object to return
	var that = {};
	// --------------------------------------------------------------------------------
	that.reset = function() {
		last = 0;
		buffer = [];
		$("#output").html("");
		$("#pw").val("");
	}	
	// --------------------------------------------------------------------------------
	that.checkPassword = function(p1, p2) {		
		print(p1.pattern);
		print(p1.value + " : " + p2.value);
		print(p1.pattern.length + " : " + p2.pattern.length);
		
		if(p1.value !== p2.value) {
			printError("Passwords didn't match");
			return;
		}
		if(p1.pattern.length !== p2.pattern.length) {
			printError("Pattern stream length didn't match");
			return;
		}
		print("Ignore first key? " + ignoreFirst);
		// Setup the test variables
		var absTotal = 0;
		var relTotal = 0;
		var passes = 0;
		var fails = 0;
		var i = ignoreFirst ? 1 : 0;
		for(i; i < p1.pattern.length; i++) {
			var diff = Math.abs(p1.pattern[i] - p2.pattern[i]);
			var rel = that.testRel(p1.pattern[i], p2.pattern[i]);
			
			var str = p1.pattern[i] + " : " + p2.pattern[i] + " --> " + diff;		
			if(that.testAbs(p1.pattern[i], p2.pattern[i])) {
				str += " <span class='pass'>PASS</span>";
				passes++;
			} else {			
				if(rel > threshold_rel) {
					str += " <span class='pass'>PASS (" + rel + ")</span>";
					passes++;
				} else {
					fails++;
					str += " <span class='fail'>FAIL (" + rel + ")</span>";
				}
			}
			print(str);
			absTotal += diff;
			relTotal += rel;
		}
		print("Total Delta: " +absTotal);
		print("Avg Accuracy " + Math.floor((10000 * relTotal)/ p1.pattern.length)/100 + "%");
		print("PASSES: " + passes);
		print("FAILS: " + fails);	
	}
	// --------------------------------------------------------------------------------
	that.testAbs = function(a, b) {
		var diff = Math.abs(a - b);
		return diff < threshold_abs;
	} 
	// --------------------------------------------------------------------------------
	that.testRel = function(a, b) {
		var large, small;
		if(a > b) {
			large = a;
			small = b;
		} else {
			large = b;
			small = a;
		}
		return (small/large);	
	}	
	// --------------------------------------------------------------------------------
	that.init = function() {	
		var input = $("#" + formObj + " #pw");		
		var form = $("#" + formObj);
		
		// Keypress event for target input area
		$(input).bind("keypress", function() {
			if(last > 0) {
				var delta = new Date() - last;
				buffer.push(delta);
			}
			last = new Date();
		});
		// Submit action for submit button
		$(form).bind("submit", function() {
			// Create a pattern to match
			var pattern = {
				value:$("#pw").val(),
				pattern:buffer
			}
			that.checkPassword(pattern, pat1);
			return false;
		});
		buffer = [];
		if(last == 0) {
			last = new Date();
		}
	}(formObj);	
	return that;
}
// --------------------------------------------------------------------------------
$("document").ready(function() {
	var ap = analogpass("analogpass");
	$("#reset").bind("click", ap.reset);
});
