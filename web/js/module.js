//module named fluo
var fluoApp = angular.module('fluo', []);
//adding progress bar controller
fluoApp.controller('progressBarCtrl', function($scope){
	//associating progress bar elements
	$scope.progA = document.getElementById('indicChannelA');
	$scope.progC = document.getElementById('indicChannelC');
	$scope.progAC = document.getElementById('indicChannelAC');

	$scope.progA.style.width=1+"%";
	$scope.progC.style.width=6+"%";
	actualizeAC();
	getValues();
	/**
	 * set new value for a progress bar (A or C), and call actualizeAC
	 * @param {string} toSet progress bar to set
	 * @param {int} value value to set to progress bar
	 */
	$scope.setProg = function(toSet, value){
		//we set A or C if correct call to function
		if (toSet=="A")
			$scope.progA.style.width=value+"%";
		else if (toSet=="C")
			$scope.progC.style.width=value+"%";
		actualizeAC();
		getValues();

	}

	function getValues(){
		document.getElementById('chA').innerHTML = "Channel A : "+$scope.progA.style.width;
		document.getElementById('chC').innerHTML = "Channel C : "+$scope.progC.style.width;
		document.getElementById('chAC').innerHTML = "Channel A/C : "+$scope.progAC.style.width;
	}

	/**
	 * Calculate the ration between A and C and set the A/C progress bar value
	 */
	function actualizeAC(){
		$scope.progAC.style.width=Math.round(($scope.progA.style.width.substring(0, $scope.progA.style.width.length-1)/$scope.progC.style.width.substring(0, $scope.progC.style.width.length-1))*100)/100+"%";
	}
});
fluoApp.controller('buttonsCtrl', function($scope){
	$scope.saveButton = document.getElementById('saveButton');
	$scope.save = function(){
		//formatted string (csv datas)
		var data = getDataCSV();
		//add a new element with a balise 'a' in webpage, to download this string
		var download = document.createElement('a');
		//set attributes of element
		download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
		download.setAttribute('download', "results.csv");
		//don't let this element visible
		download.style.display = 'none';
		//add at the end of document
		document.body.appendChild(download);
		//auto click
		download.click();
		//remove from document
		document.body.removeChild(download);
		// angular.element(document.getElementById('progress')).scope().setProg("A",100);
		// addPoint("T", 150, 1);
	}
});
