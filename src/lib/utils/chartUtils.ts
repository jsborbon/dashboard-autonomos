export const chartCommonOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'top' as const,
			labels: {
				usePointStyle: true,
				padding: 20
			}
		},
		tooltip: {
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			titleFont: {
				size: 14
			},
			bodyFont: {
				size: 13
			},
			padding: 15,
			cornerRadius: 5,
			displayColors: true
		}
	}
};

// Define chart theme colors for consistency
export const chartColors = {
	income: {
		border: 'rgba(75, 192, 192, 1)',
		background: 'rgba(75, 192, 192, 0.2)'
	},
	expense: {
		border: 'rgba(255, 99, 132, 1)',
		background: 'rgba(255, 99, 132, 0.2)'
	},
	emitted: {
		background: 'rgba(54, 162, 235, 0.6)'
	},
	received: {
		background: 'rgba(75, 192, 192, 0.6)'
	},
	emitter: {
		background: 'rgba(255, 159, 64, 0.6)'
	},
	tax: {
		base: 'rgba(75, 192, 192, 0.6)',
		iva: 'rgba(255, 99, 132, 0.6)'
	},
	progress: {
		border: 'rgba(54, 162, 235, 1)',
		background: 'rgba(54, 162, 235, 0.2)'
	},
	receiver: {
		background: 'rgba(153, 102, 255, 0.6)'
	}
};
