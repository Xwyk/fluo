//save chart a global variable
var myChart;
/**
 * get canvas from document and insert graph into
 */
function insertGraph(){
    var ctx = document.getElementById('graphe').getContext('2d');
    //creation of Chart
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            //labels: ['10', '20', '30', '40', '50', '60', '70'],
            datasets: [{
                label: "Emission",
                backgroundColor: "rgba(153,255,51,0.4)"
            },
            {
                label: "Excitation",
                backgroundColor: "rgba(153,255,236,0.4)"
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontSize: 20,
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display:false,
                        beginAtZero:true
                    }
                }]
            },           
        }
    });
    //set size of graph, default size is override when creating the tab
    document.getElementById('graphe').style.width="100%";
    document.getElementById('graphe').style.height="90%";

}

function test(){
    addPoint("25",70, 0);
    addPoint("25",260, 0);
    addPoint("31",69, 0);
    addPoint("2000",69, 0);
    addPoint("51",56, 0);
    angular.element(document.getElementById('progress')).scope().setProg("A",5);
    angular.element(document.getElementById('progress')).scope().setProg("C",50);
    angular.element(document.getElementById('progress')).scope().setProg("A",70);
    angular.element(document.getElementById('progress')).scope().setProg("C",54);
    angular.element(document.getElementById('progress')).scope().setProg("A",52);

}

/**
 * return a string in .CSV syntax, which contains coordinates of each point on the graph
 * @return {string} formatted string 
 */
function getDataCSV(){
    //first column is the wavelength, lambda
    var ret = "Lambda";
    //for each set of datas, set label as first case of columns
    myChart.data.datasets.forEach(function(element){
        ret += ";"+element.label;
    });
    //indentation
    ret += "\n";
    //for each label on X axis, add data of each dataset at this X coordinate
    for (var i = 0; i < myChart.data.labels.length; i++) {
        //first column, wavelength
        ret += myChart.data.labels[i];
        //for each set of data, add value in wright column
        myChart.data.datasets.forEach(function(element){
            //if value isn't define, we return a blank, for the syntax
            ret += (element.data[i] === undefined)? "; ":";"+element.data[i].y;
        });
        //indentationtion
        ret+="\n";
    }

    return ret;
}
/**
 * return a string formatted to JCAMP-DX format
 * @return {string} formatted string
 */
function getDataJDX(){
    var d=new Date();
    var ret = "##TITLE= spectrofluorescence\n"+
              "##JCAMP-DX= 5.00\n"+
              "##DATA TYPE= FLORESCENCE SPECTRUM\n"+
              "##DATA CLASS= PEAK TABLE\n"+
              "##DATE="+d.getDay()+"."+d.getMonth()+"."+(d.getFullYear()-2000)+"\n"+
              "##TIME="+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"\n"+
              "##ORIGIN= Université Bretagne Sud, salle F091\n"+
              "##XUNITS=Nanometers\n"+
              "##YUNITS=Relative Luminescence\n"+
              "##XYDATA= (XY..XY)\n";

}
/**
 * check if dataset exists, and add new point, or, if x coordinate already exists, update y value
 * @param {int} xAxis X coordinate
 * @param {int} yAxis Y coordinate
 * @param {int} data  index of dataset
 */
function addPoint(xAxis, yAxis, data){
    datasetToModify = myChart.data.datasets[data];
    //if selected dataset doesn't exsist, quit method
    var exist = false;
    if (datasetToModify === undefined)
        return;
    datasetToModify.data.forEach(function(element){
        if (element.x == xAxis){
            exist = true;
            element.y = yAxis;
        }
    });
    if(!exist){
        myChart.data.labels.push(xAxis);
        //we sort array
        myChart.data.labels.sort(function(a, b) {
            return a-b;
        });
        datasetToModify.data.push({x: xAxis, y: yAxis});
    }
    //update
    updateChart();
    
}
/**
 * Clear all points on the graph
 */
function clearGraph(){
    myChart.clear();
    //update
    updateChart();
}
/**
 * update chart after modify values
 */
function updateChart(){
    myChart.update();

}    


// var data = {
//     datasets: [
//         {
//             label: 'First Dataset',
//             data: [
//                 {
//                     x: 20,
//                     y: 30,
//                     r: 15
//                 },
//                 {
//                     x: 40,
//                     y: 10,
//                     r: 10
//                 }
//             ],
//             backgroundColor:"#FF6384",
//             hoverBackgroundColor: "#FF6384",
//         }]
// };