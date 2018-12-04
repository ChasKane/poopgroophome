// {material_name: "", initial_amount: NaN, date_purchased: "", num_semesters: NaN}
//var url = "http://104.248.113.22/gavin/";
var url = "http://104.248.113.22/";
 function getmaterials() {
 	$.ajax({
 		url : url + "api/web/material/read.php",
 		type : "POST",
 		success : function(response, tStatus, responseCode) {
 			loadmaterials(response);
      printmaterials(response);
 		},
 		error : function(response, tStatus, responseCode) {
 			return responseCode.status;
 		}
 	});
 }

 function addmaterial() {
 	var payload = {
 		"material_name" : document.getElementById("material_name").value,
 		"initial_amount" : parseFloat(document.getElementById("initial_amount").value),
 		"date_purchased" : String(document.getElementById("date_purchased").value),
 		"num_semesters" : parseInt(document.getElementById("num_semesters").value)
	}
 	console.log(payload);
 	
   $.ajax({
 		url : url + "api/web/material/create.php",
 		type : "POST",
 		data : JSON.stringify(payload),
 		success : function(response, tStatus, responseCode) {
 			printmaterials(response);
 		},
 		error : function(response, tStatus, responseCode) {
 			return responseCode.status;
 		}
 	});
 }

 function printmaterials(object) {
 	console.log(object);
 	var element = document.getElementsByTagName("p")[0];
 	element.innerHTML = JSON.stringify(object);
 }
 
 function loadmaterials(object)
 {
   var stuff = JSON.stringify(object);
   var data = object.threedmaterials;
   var dropdown = document.getElementById('selectmaterial');
   for (var i in data){
          option = document.createElement('option');
      	  option.text = data[i].material_name;  
          option.id= data[i].material_name;  
          option.value = data[i].material_name;
      	  dropdown.add(option);
    	}    
 }

 function showtable()
 {
    $.ajax({
    url : url + "api/web/material/read.php",
    type : "POST",
    success : function(response, tStatus, responseCode) {
      
    },
    error : function(response, tStatus, responseCode) {
      
    }
    });

    var stuff = JSON.stringify(response);
    var data = object.threedmaterials;
    var selected = document.getElementById('selectmaterial');
    for (var i in data)
    {
      if(selected.value == data[i].material_name)  
      {
          var material = data[i].material_name;
          var datedadded = data[i].date_added;
      }
    }
                                    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                    var config = {
                                      type: 'line',
                                      data: {
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [{
                                          label: material,
                                          backgroundColor: window.chartColors.red,
                                          borderColor: window.chartColors.red,
                                          data: [
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor()
                                          ],
                                          fill: false,
                                        }, {
                                          label: 'My Second dataset',
                                          fill: false,
                                          backgroundColor: window.chartColors.blue,
                                          borderColor: window.chartColors.blue,
                                          data: [
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor(),
                                            randomScalingFactor()
                                          ],
                                        }]
                                      },
                                      options: {
                                        responsive: true,
                                        title: {
                                          display: true,
                                          text: 'Chart.js Line Chart'
                                        },
                                        tooltips: {
                                          mode: 'index',
                                          intersect: false,
                                        },
                                        hover: {
                                          mode: 'nearest',
                                          intersect: true
                                        },
                                        scales: {
                                          xAxes: [{
                                            display: true,
                                            scaleLabel: {
                                              display: true,
                                              labelString: 'Month'
                                            }
                                          }],
                                          yAxes: [{
                                            display: true,
                                            scaleLabel: {
                                              display: true,
                                              labelString: 'Value'
                                            }
                                          }]
                                        }
                                      }
                                    };

                                    window.onload = function() {
                                      var ctx = document.getElementById('canvas').getContext('2d');
                                      window.myLine = new Chart(ctx, config);
                                    };

                                    document.getElementById('randomizeData').addEventListener('click', function() {
                                      config.data.datasets.forEach(function(dataset) {
                                        dataset.data = dataset.data.map(function() {
                                          return randomScalingFactor();
                                        });

                                      });

                                      window.myLine.update();
                                    });

                                    var colorNames = Object.keys(window.chartColors);
                                    document.getElementById('addDataset').addEventListener('click', function() {
                                      var colorName = colorNames[config.data.datasets.length % colorNames.length];
                                      var newColor = window.chartColors[colorName];
                                      var newDataset = {
                                        label: 'Dataset ' + config.data.datasets.length,
                                        backgroundColor: newColor,
                                        borderColor: newColor,
                                        data: [],
                                        fill: false
                                      };

                                      for (var index = 0; index < config.data.labels.length; ++index) {
                                        newDataset.data.push(randomScalingFactor());
                                      }

                                      config.data.datasets.push(newDataset);
                                      window.myLine.update();
                                    });

                                    document.getElementById('addData').addEventListener('click', function() {
                                      if (config.data.datasets.length > 0) {
                                        var month = MONTHS[config.data.labels.length % MONTHS.length];
                                        config.data.labels.push(month);

                                        config.data.datasets.forEach(function(dataset) {
                                          dataset.data.push(randomScalingFactor());
                                        });

                                        window.myLine.update();
                                      }
                                    });

                                    document.getElementById('removeDataset').addEventListener('click', function() {
                                      config.data.datasets.splice(0, 1);
                                      window.myLine.update();
                                    });

                                    document.getElementById('removeData').addEventListener('click', function() {
                                      config.data.labels.splice(-1, 1); // remove the label first

                                      config.data.datasets.forEach(function(dataset) {
                                        dataset.data.pop();
                                      });

                                      window.myLine.update();
                                    });
                                    
                                    
 }