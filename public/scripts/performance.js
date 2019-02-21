function initPerformanceTab() {
    const COLOR_PALETTE = [];
    for (let i = 8; i > 0; i--) {
        COLOR_PALETTE.push({
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255)
        });
    }

    function createTemperatureChart(partIds) {
        const ctx = document.getElementById("temperature-chart").getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'realtime'
                    }]
                }
            }
        });
        return chart;
    }

    function createVibrationsChart(partIds) {
        const ctx = document.getElementById("vibrations-chart").getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'realtime'
                    }]
                }
            }
        });
        return chart;
    }

    function onTemperatureRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: Math.random()
            });
        });
    }

    function onVibrationsRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: Math.random()
            });
        });
    }

    const temp = createTemperatureChart();
    const vibr = createVibrationsChart();

    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        const ids = NOP_VIEWER.getSelection();
        temp.data.datasets = [];
        vibr.data.datasets = [];
        let counter = 0;
        for (const id of ids) {
            const color = COLOR_PALETTE[counter % COLOR_PALETTE.length];
            temp.data.datasets.push({
                label: 'Part #' + id,
                borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`,
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                data: []
            });
            vibr.data.datasets.push({
                label: 'Part #' + id,
                borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`,
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                data: []
            });
            counter++;
        }
        temp.update();
        vibr.update();
    });

    setInterval(function() {
        onTemperatureRefresh(temp);
        onVibrationsRefresh(vibr);
    }, 1000);
}