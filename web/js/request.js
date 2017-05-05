/**
 * make a HTTP request to Arduino webserver, and return result
 * @return {string} JSON formatted string
 */
function getFromArduino(){
	var ret;
	//make GET HTTP request to Arduino at port 80, and set response to JSON type
	$.ajax({
		url: 'http://192.168.1.203/',
		type: 'GET',
		async:false,
		dataType: 'json',
		success: function(data, status){
			//if success, put result in return variable
			ret=validateJSON(data);
		},
		error: function(res, status, error){
			//if error, alert user
			alert("Erreur de connexion");
		}
	});
	return ret;
}
/**
 * validate json string, to prevent from mistakes
 * @param  {string} json json formatted string
 * @return {[type]}      [description]
 */
function validateJSON(json){
	return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(jsonText.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + jsonText + ')');
}