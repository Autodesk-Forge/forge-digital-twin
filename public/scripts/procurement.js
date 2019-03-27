function initProcurementTab(mainViewer) {
    const $tbody = $('#purchases > tbody');
    const $pagination = $('#procurement .pagination');
    let purchases = {
        list: [],
        pageSize: 5,
        currPage: 0
    };

    async function updatePurchases(reload, partIds) {
        if (reload) {
            const query = (partIds && partIds.length > 0) ? '?parts=' + partIds.join(',') : '';
            const resp = await fetch('/api/procurement/purchases' + query);
            purchases.list = await resp.json();
            purchases.currPage = 0;
        }
        updatePurchasesTable();
        updatePurchasesPagination();
    }

    function updatePurchasesTable() {
        const { list, currPage, pageSize } = purchases;
        $tbody.empty();
        for (let i = currPage * pageSize; i < (currPage + 1) * pageSize && i < list.length; i++) {
            const purchase = list[i];
            const date = new Date(purchase.createdAt);
            const $row = $(`
                <tr>
                    <th scope="row">${date.toLocaleDateString()}</th>
                    <td><a href="#" class="part-link">${purchase.partId}</a></td>
                    <td>${purchase.supplier}</td>
                    <td>$${purchase.price}</td>
                </tr>
            `);
            $tbody.append($row);
        }
    }

    function updatePurchasesPagination() {
        const { list, currPage, pageSize } = purchases;
        const pageCount = Math.ceil(list.length / pageSize);
        $pagination.empty();
        for (let i = 0; i < pageCount; i++) {
            const $li = $(`<li class="page-item ${i == currPage ? 'active' : ''}"><a class="page-link" href="#">${i + 1}</a></li>`);
            $pagination.append($li);
        }
    }

    function updatePurchaseForm(partIds) {
        if (partIds && partIds.length === 1) {
            $('#purchase-part').val(partIds[0]);
            $('#purchase-price').val(`$${(Math.random() * 100).toFixed(2)}`);
            $('#purchase-form button').attr('disabled', false);
        } else {
            $('#purchase-part').val('(select part in 3D view)');
            $('#purchase-price').val('');
            $('#purchase-form button').attr('disabled', true);
        }
    }

    let priceChart = null;
    function updatePurchaseChart(partIds) {
        // Generate a set of random prices with dbId as seed
        let rng = new RandomNumberGenerator(partIds && partIds.length === 1 ? partIds[0] : undefined);
        let prices = [];
        for (let i = 0; i < 6; i++) {
            prices.push(950.0 + rng.nextFloat() * 100.0);
        }

        if (!priceChart) {
            const ctx = document.getElementById("purchase-stats").getContext('2d');
            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [{
                        label: 'Price ($)',
                        data: prices,
                        backgroundColor: [
                            'rgba(192, 128, 0, 0.5)'
                        ],
                        borderColor: [
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
        } else {
            priceChart.data.datasets[0].data = prices;
            priceChart.update();
        }
    }

    $('#purchases').on('click', function(ev) {
        if (ev.target.innerText.match(/^\d+$/)) {
            const partId = parseInt(ev.target.innerText);
            const selectedIds = mainViewer.getSelection();
            if (selectedIds.length == 0 || selectedIds[0] !== partId) {
                mainViewer.select(partId);
                mainViewer.fitToView([partId]);
            }
        }
    });

    $pagination.on('click', function(ev) {
        if (ev.target.innerText.match(/^\d+$/)) {
            const page = parseInt(ev.target.innerText);
            purchases.currPage = page - 1;
            updatePurchasesTable();
            updatePurchasesPagination();
        }
    });

    mainViewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        updatePurchases(true, mainViewer.getIsolatedNodes());
    });

    const $purchaseStats = $('#purchase-stats');
    const $procurementStatsAlert = $('#procurement-stats div.alert');
    mainViewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        const ids = mainViewer.getSelection();
        updatePurchaseForm(ids);
        updatePurchaseChart(ids);
        if (ids.length === 1) {
            $purchaseStats.show();
            $procurementStatsAlert.hide();
        } else {
            $purchaseStats.hide();
            $procurementStatsAlert.show();
        }
    });
    $purchaseStats.hide();
    $procurementStatsAlert.show();

    $('#purchase-form button').on('click', function(ev) {
        const partId = parseInt($('#purchase-part').val());
        const supplier = $('#purchase-supplier').val();
        const price = parseFloat($('#purchase-price').val().replace('$', ''));
        fetch('/api/procurement/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, supplier, price })
        }).then(resp => {
            const $modal = $('#purchase-modal');
            if (resp.status === 200) {
                $('#purchase-modal .modal-body > p').text(`Purchase Response: ${resp.statusText} (${resp.status})`);
                $modal.modal('show');
                setTimeout(function() { $modal.modal('hide'); }, 1000);
                updatePurchases(true, mainViewer.getIsolatedNodes());
            } else {
                resp.text().then(text => {
                    $('#purchase-modal .modal-body > p').text(`Purchase Response: ${resp.statusText} (${resp.status}) ${text}`);
                    $modal.modal('show');
                    setTimeout(function() { $modal.modal('hide'); }, 5000);
                });
            }
        });
        ev.preventDefault();
    });

    updatePurchases(true);
    updatePurchaseForm();
    updatePurchaseChart();
}