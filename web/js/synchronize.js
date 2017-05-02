/**
 * synchronise actual values and displayed values from JSON object
 */
function synchronize(){
	//get JSON object
	var json = getFromArduino();
	//set progress bars
    angular.element(document.getElementById('progress')).scope().setProg("A",5);
    angular.element(document.getElementById('progress')).scope().setProg("C",5);
    //set displayed values of actual wavelengths
    document.getElementById('exci').innerHTML = json.exci;
    document.getElementById('emi').innerHTML = json.emi;
    //add points in the graph, wavelength as Xaxis and photodiode value as Yaxis
    addPoint(json.exci, json.a, 1);
    addPoint(json.emi, json.c, 0);
}