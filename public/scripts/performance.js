function initPerformanceTab(mainViewer) {
    const COLOR_PALETTE = [];
    for (let i = 8; i > 0; i--) {
        COLOR_PALETTE.push({
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255)
        });
    }

    const temperatures = new Float32Array(1500);

    const ALERTS_STORAGE_KEY = 'alert-config';
    const alerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '{}');

    const needle = document.getElementById('gauge-needle');
    var dbid = 10;  // random number to start with
    /*
    alerts = {
        <partId>: {
            temperature: {
                max: <number>
            }
        }
    };
    */

    function updateTemperatures(chart) {
        //update part bar chart
        // chart.data.datasets[0].data = [12, 19, 3, 5, 2, 3].map(i => Math.floor(Math.random() * 100))
        /*
        // Generate new temperatures for each partId from 1 to 1500
        for (let i = 0, len = temperatures.length; i < len; i++) {
            temperatures[i] = 90.0 + Math.random() * 20.0;
        }
        // Trigger alerts if any part temperature exceed preconfigured limit
        Object.keys(alerts).forEach(function(partId) {
            const alert = alerts[partId];
            const temp = temperatures[partId];
            if (alert && alert.temperature && temp > alert.temperature.max) {
                // console.log(`Part ${partId} temperature ${temp} exceeded limit ${alert.temperature.max}!`);
                mainViewer.setThemingColor(partId, new THREE.Vector4(1.0, 0.0, 0.0, 0.99));
                setTimeout(function() {
                    // TODO: revert to original theming color if there was one
                    mainViewer.setThemingColor(partId, new THREE.Vector4(1.0, 0.0, 0.0, 0.0));
                }, 500);
            }
        });
        */
        // update temperature gauge        
        needle.setAttribute('transform', `rotate(${dbid+Math.floor(Math.random() * 10)}, 100, 100)`);
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
            options: {
                scales: {
                    xAxes: [{ type: 'realtime', realtime: { delay: 2000 } }],
                    yAxes: [{ ticks: { beginAtZero: true } }]
                }
            }
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
            options: {
                scales: {
                    xAxes: [{ type: 'realtime', realtime: { delay: 2000 } }],
                    yAxes: [{ ticks: { beginAtZero: true } }]
                }
            }
        });
        return chart;
    }

    function createPartTemperaturesChart() {
        const ctx = document.getElementById('part-temperatures-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                    label: 'Avg. Temp.',
                    data: [12, 19, 3, 5, 2, 3].map(i => Math.floor(Math.random() * 100)),
                    backgroundColor: [
                        'rgba(192, 128, 0, 0.5)',
                        'rgba(192, 128, 0, 0.5)',
                        'rgba(192, 128, 0, 0.5)',
                        'rgba(192, 128, 0, 0.5)',
                        'rgba(192, 128, 0, 0.5)',
                        'rgba(192, 128, 0, 0.5)'
                    ],
                    borderColor: [
                        'rgba(192, 128, 0, 1.0)',
                        'rgba(192, 128, 0, 1.0)',
                        'rgba(192, 128, 0, 1.0)',
                        'rgba(192, 128, 0, 1.0)',
                        'rgba(192, 128, 0, 1.0)',
                        'rgba(192, 128, 0, 1.0)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        return chart;
    }

    function refreshEngineSpeed(chart) {
        chart.data.datasets[0].data.push({
            x: Date.now(),
            y: 9750.0 + Math.random() * 500.0
        });
    }

    function refreshEngineVibrations(chart) {
        const date = Date.now();
        const minVibration = 2.0 + Math.random();
        const maxVibration = minVibration + Math.random();
        chart.data.datasets[0].data.push({ x: date, y: minVibration });
        chart.data.datasets[1].data.push({ x: date, y: 0.5 * (minVibration + maxVibration) });
        chart.data.datasets[2].data.push({ x: date, y: maxVibration });
    }

    function updateTemperatureAlertForm(partIds) {
        $form = $('#temperature-alert-form');
        if (!partIds || partIds.length !== 1) {
            $form.fadeOut();
        } else {
            $('#temperature-alert-part').val(partIds[0]);
            const config = alerts[partIds[0]];
            if (config && config.temperature && config.temperature.max) {
                $('#temperature-alert-max').val(config.temperature.max);
            } else {
                $('#temperature-alert-max').val('');
            }
            $form.fadeIn();
        }
    }

    const engineSpeedChart = createEngineSpeedChart();
    const engineVibrationsChart = createEngineVibrationsChart();
    const partTemperaturesChart = createPartTemperaturesChart();

    const $partCurrentTemperature = $('#part-current-temperature');
    const $partTemperatureChart = $('#part-temperatures-chart');
    const $partSelectionAlert = $('#performance-part div.alert');
    mainViewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        const ids = mainViewer.getSelection();
        if (ids.length === 1) {
            dbid = ids[0];

            // Generate a set of random temperatures (between 95.0 and 105.0) with dbId as seed
            let rng = new RandomNumberGenerator(dbid);
            let temperatures = [];
            for (let i = 0; i < 6; i++) {
                temperatures.push(95.0 + rng.nextFloat() * 10.0);
            }
            partTemperaturesChart.data.datasets[0].data = temperatures;
            partTemperaturesChart.update();
            $partCurrentTemperature.show();
            $partTemperatureChart.show();
            $partSelectionAlert.hide();
        } else {
            $partCurrentTemperature.hide();
            $partTemperatureChart.hide();
            $partSelectionAlert.show();
        }
    });
    $partCurrentTemperature.hide();
    $partTemperatureChart.hide();
    $partSelectionAlert.show();

    $('#temperature-alert-form button.btn-primary').on('click', function(ev) {
        const partId = parseInt($('#temperature-alert-part').val());
        const tempMax = parseFloat($('#temperature-alert-max').val());
        alerts[partId] = alerts[partId] || {};
        alerts[partId].temperature = alerts[partId].temperature || {};
        alerts[partId].temperature.max = tempMax;
        window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
        updateTemperatureAlertForm([partId]);
        ev.preventDefault();
    });
    $('#temperature-alert-form button.btn-secondary').on('click', function(ev) {
        const partId = $('#temperature-alert-part').val();
        delete alerts[partId];
        window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
        updateTemperatureAlertForm([partId]);
        ev.preventDefault();
    });

    setInterval(function() {
        updateTemperatures();
        refreshEngineSpeed(engineSpeedChart);
        refreshEngineVibrations(engineVibrationsChart);
    }, 1000);
    updateTemperatureAlertForm();
}