
(function () {
	$.get('/besthourtopost', (data) => {
		$('.recoInsert').text(data.bestHourMessage);
	});

	$.get('/likestoday', (data) => {
		$('#likesToday').text(data.likesTdy);
	});

	$.get('/followerstoday', (data) => {
		$('#followersToday').text(data.folToday);
	});

	$.get('/engagementtoday', (data) => {
		$('#engagementToday').text(data.engtoday);
	});

	$.get('/totallikes', (data) => {
		$('#likes').text(data.totallikes);
	});

	$.get('/totalfollowers', (data) => {
		$('#followers').text(data.totfol);
	});

	$.get('/totalengagement', (data) => {
		$('#engagement').text(data.toteng);
	});

	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
    	type: 'line',
    	data: {
        	labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
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
