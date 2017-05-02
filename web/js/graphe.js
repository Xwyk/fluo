var myChart;
//When document is ready
function insertGraph(){
    var ctx = document.getElementById('graphe').getContext('2d');
    //creation of Chart
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10', '20', '30', '40', '50', '60', '70'],
            datasets: [{
                label: "Emission",
                data: [10, 20, 30, 40, 50, 60, 70],
                backgroundColor: "rgba(153,255,51,0.4)"
            },
            {
                label: "Excitation",
                data: [295],
                backgroundColor: "rgba(153,255,236,0.4)"
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            
        }
    });
    //set size of graph, default size is override when creating the tab
    document.getElementById('graphe').style.width="100%";
    document.getElementById('graphe').style.height="90%";
    // addPoint("25",70, 0);
    // addPoint("25",260, 0);
    addPoint("31",69, 0);
    // addPoint("2000",69, 0);
    addPoint("51",56, 0);
    // addPoint("320",239, 0);
    // addPoint("1120",98, 0);

    // myChart.data.labels.push("test")
    // myChart.data.datasets[0].data.push(70);
    //angular.element(document.getElementById('progress')).scope().setProg("A",5);

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
            ret += (element.data[i] === undefined)? "; ":";"+element.data[i];
        });
        //indentationtion
        ret+="\n";
    }
    return ret;
}
/**
 * add a point to an exsisting dataset, and does nothing if dataset doesn't exist
 * X array is sort in numeric order before insert value.
 * @param {int} xAxis X coordinate
 * @param {int} yAxis Y coordinate
 * @param {int} data  index of dataset
 */
function addPoint(xAxis, yAxis, data){
    datasetToModify = myChart.data.datasets[data];
    //if selected dataset doesn't exsist, quit method
    var exist = true;
    if (datasetToModify === undefined)
        return;
    if (myChart.data.labels.indexOf(xAxis) == -1) {
        exist=false;
        //we add value into labels array
        myChart.data.labels.push(xAxis);
        //we sort array
        myChart.data.labels.sort(function(a, b) {
            return a-b;
        });
    }
    var length = datasetToModify.data.length + 1;
    var index = myChart.data.labels.indexOf(xAxis);
    //if char to modify exist, we just have to set the new value
    if (exist) {
        datasetToModify.data[index] = yAxis;
    }
    //else, we have to add new X in Xaxis array, and associate Yaxis value
    else {
        //create a new array
        var newData = [length];
        //put old Yaxis with minus Xaxis than new to set
        for (var i = 0; i < index-1; i++) {
            newData.push(datasetToModify.data[i]);
        }
        //put yAxis associate with the new Xaxis
        newData.push(yAxis);
        //put rest of yAxis 
        for (var i = index+1; i <=  myChart.data.labels.length; i++) {
            newData.push(datasetToModify.data[i]);
        }
        //and finally we overwrite data in selected dataset
        myChart.data.datasets[0].data = newData;
    }
    //update
    updateChart();
    
}
/**
 * Clear all points on the graph
 */
function clearGraph(){
    //create a new array
    var data=[];
    //set each dataset's data to new array
    for (var i = 0; i <= myChart.data.datasets.length; i++) {
        myChart.data.datasets.data=data;
    }
    //set labels to new empty array
    myChart.data.labels=data;
    //update
    updateChart();
}
/**
 * update chart after modify values
 */
function updateChart(){
    myChart.update();

}    
