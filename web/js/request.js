/**
 * make a HTTP request to Arduino webserver, and return result
 * @return {string} JSON formatted string
 */
function getFromArduino(){
	var ret;
	//make GET HTTP request to Arduino at port 80, and set response to JSON type
	$.ajax({
		url: '192.168.0.16:80',
		type: 'GET',
		dataType: 'JSON',
		success: function(data, status){
			//if success, put result in return variable
			alert(data);
			ret=data;
		},
		error: function(res, status, error){
			//if error, alert user
			alert("Erreur de connection : "+status);
		}
	});
	return ret;
}