
(function () {
	$.get('/besthourtopost', (data) => {
		$('.container h1').text(data.bestHourMessage);
	});
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
    	type: 'line',
    	data: {
        	labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],
        	datasets: [{
            	data: [120,130,100,60,40,80,60,20,10,0,0,10,15,30,60,10,40,10,5,3,0,3,10,8],
            	backgroundColor: 'rgba(255, 160, 71, 0.2)',
            	borderColor: '#FD8A1D',
            	borderWidth: 1
        	}]
    	},
    	options: {
    		legend: {
        		display: false
			},
        	scales: {
            	yAxes: [{
                	ticks: {
                    	beginAtZero:true
                	},
                	gridLines: {
                		display: false
                	},
            	}],
            	xAxes: [{
            		ticks: {
                		callback: function(tick, index, array) {
                    		return (index % 2) ? "" : tick;
                		}
                	},
                	gridLines: {
                		display: false
                	}
            	}],
        	},
        	cubicInterpolationMode: 'monotone',
    	}
	});
})();