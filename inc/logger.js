// --------------------------------------------------------------------------------
printError = function(str) {
	str = "<span class='fail'>" + str + "</span>";
	print(str);
}
// --------------------------------------------------------------------------------
print = function(str) {
	str = "<div>" + str + "</div>";
	$("#output").append(str);	
}
