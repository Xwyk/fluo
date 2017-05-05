// function resize(){
// 	document.getElementById('graph').style.width = "70vw";
// 	document.getElementById('graph').style.height = "100%";
// 	document.getElementById('values').style.width = "30vw";
// 	document.getElementById('values').style.height = "100%";
// 	document.getElementById('buttons').style.width = "100%";
// 	document.getElementById('buttons').style.height = "10%";
// 	document.getElementById('graphe').style.width="100%";
//     document.getElementById('graphe').style.height="90%";
// }
/**
 * synchronise actual values and displayed values from JSON object
 */
function synchronize(){
	//get JSON object
	var json = getFromArduino();
	//set progress bars
    angular.element(document.getElementById('progress')).scope().setProg("A",json.a);
    angular.element(document.getElementById('progress')).scope().setProg("C",json.c);
    //set displayed values of actual wavelengths
    document.getElementById('exci').innerHTML = json.exci;
    document.getElementById('emi').innerHTML = json.emi;
    //add points in the graph, wavelength as Xaxis and photodiode value as Yaxis
    addPoint(json.exci, json.a, 1);
    addPoint(json.emi, json.a, 0);
}

