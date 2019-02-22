function initPerformanceTab() {
    const COLOR_PALETTE = [];
    for (let i = 8; i > 0; i--) {
        COLOR_PALETTE.push({
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255)
        });
    }

    function createEngineSpeedChart() {
        const ctx = document.getElementById('engine-speed-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Speed [rpm]',
                    borderColor: 'rgba(255, 196, 0, 1.0)',
                    backgroundColor: 'rgba(255, 196, 0, 0.5)',
                    data: []
                }]
            },
            options: { scales: { xAxes: [{ type: 'realtime', realtime: { delay: 2000 } }] } }
        });
        return chart;
    }

    function createEngineVibrationsChart() {
        const ctx = document.getElementById('engine-vibrations-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Min [mm/s]',
                    borderColor: 'rgba(255, 192, 0, 1.0)',
                    backgroundColor: 'rgba(255, 192, 0, 0.5)',
                    data: []
                },{
                    label: 'Avg [mm/s]',
                    borderColor: 'rgba(192, 128, 0, 1.0)',
                    backgroundColor: 'rgba(192, 128, 0, 0.5)',
                    data: []
                },{
                    label: 'Max [mm/s]',
                    borderColor: 'rgba(128, 64, 0, 1.0)',
                    backgroundColor: 'rgba(128, 64, 0, 0.5)',
                    data: []
                }]
            },
            options: { scales: { xAxes: [{ type: 'realtime', realtime: { delay: 2000 } }] } }
        });
        return chart;
    }

    function createPartTemperaturesChart() {
        const ctx = document.getElementById('part-temperatures-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: { datasets: [] },
            options: { scales: { xAxes: [{ type: 'realtime', realtime: { delay: 2000 } }] } }
        });
        return chart;
    }

    function refreshEngineSpeed(chart) {
        chart.data.datasets[0].data.push({
            x: Date.now(),
            y: 5000.0 + Math.random() * 5000.0
        });
    }

    function refreshEngineVibrations(chart) {
        const date = Date.now();
        const minVibration = Math.random() * 10.0;
        const maxVibration = minVibration + Math.random() * 10.0;
        chart.data.datasets[0].data.push({ x: date, y: minVibration });
        chart.data.datasets[1].data.push({ x: date, y: 0.5 * (minVibration + maxVibration) });
        chart.data.datasets[2].data.push({ x: date, y: maxVibration });
    }

    function refreshPartTemperatures(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: Math.random() * 100.0
            });
        });
    }

    const engineSpeedChart = createEngineSpeedChart();
    const engineVibrationsChart = createEngineVibrationsChart();
    const partTemperaturesChart = createPartTemperaturesChart();

    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        const ids = NOP_VIEWER.getSelection();
        partTemperaturesChart.data.datasets = [];
        let counter = 0;
        for (const id of ids) {
            const color = COLOR_PALETTE[counter % COLOR_PALETTE.length];
            partTemperaturesChart.data.datasets.push({
                label: `Part #${id} Temp [C]`,
                borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`,
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
                data: []
            });
            counter++;
        }
        partTemperaturesChart.update();
    });

    setInterval(function() {
        refreshEngineSpeed(engineSpeedChart);
        refreshEngineVibrations(engineVibrationsChart);
        refreshPartTemperatures(partTemperaturesChart);
    }, 1000);
}