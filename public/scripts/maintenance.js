function initMaintenanceTab() {
    const $tbody = $('#revisions > tbody');
    const $pagination = $('#maintenance .pagination');
    let maintenance = {
        list: [],
        pageSize: 5,
        currPage: 0
    };

    async function updateRevisions(reload, partIds) {
        if (reload) {
            const query = (partIds && partIds.length > 0) ? '?parts=' + partIds.join(',') : '';
            const resp = await fetch('/api/maintenance/revisions' + query);
            maintenance.list = await resp.json();
            maintenance.currPage = 0;
        }
        updateRevisionsTable();
        updateRevisionsPagination();
    }

    function updateRevisionsTable() {
        const { list, currPage, pageSize } = maintenance;
        $tbody.empty();
        for (let i = currPage * pageSize; i < (currPage + 1) * pageSize && i < list.length; i++) {
            const review = list[i];
            const date = new Date(review.createdAt);
            const $row = $(`
                <tr>
                    <th scope="row">${date.toLocaleDateString()}</th>
                    <td><a href="#" class="part-link">${review.partId}</a></td>
                    <td>${review.author}</td>
                    <td style="color: ${review.passed ? 'green' : 'red'};">${review.passed ? 'Good' : 'Bad'}</td>
                </tr>
            `);
            $tbody.append($row);
        }
    }

    function updateRevisionsPagination() {
        const { list, currPage, pageSize } = maintenance;
        const pageCount = Math.ceil(list.length / pageSize);
        $pagination.empty();
        for (let i = 0; i < pageCount; i++) {
            const $li = $(`<li class="page-item ${i == currPage ? 'active' : ''}"><a class="page-link" href="#">${i + 1}</a></li>`);
            $pagination.append($li);
        }
    }

    function updateRevisionForm(partIds) {
        if (partIds && partIds.length === 1) {
            $('#revision-part').val(partIds[0]);
            $('#revision-form button').attr('disabled', false);
        } else {
            $('#revision-part').val('(select part in 3D view)');
            $('#revision-form button').attr('disabled', true);
        }
    }

    function updateRevisionChart(partIds) {
        const ctx = document.getElementById("revision-stats").getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: 'Status',
                    data: [12, 19, 3, 5, 2, 3].map(i => Math.floor(Math.random() * 100)),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
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
    }

    $('#revisions').on('click', function(ev) {
        let partId = parseInt(ev.target.innerText);
        if (partId) {
            let selectedIds = NOP_VIEWER.getSelection();
            if (selectedIds.length == 0 || selectedIds[0] !== partId) {
                NOP_VIEWER.select(partId);
                NOP_VIEWER.fitToView([partId]);
            }
        }
    });

    $pagination.on('click', function(ev) {
        let page = parseInt(ev.target.innerText);
        if (page) {
            maintenance.currPage = page - 1;
            updateRevisionsTable();
            updateRevisionsPagination();
        }
    });

    NOP_VIEWER.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        updateRevisions(true, NOP_VIEWER.getIsolatedNodes());
    });
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        updateRevisionForm(NOP_VIEWER.getSelection());
    });
    $('#revision-form button').on('click', function(ev) {
        const partId = parseInt($('#revision-part').val());
        const author = $('#revision-author').val();
        const passed = $('#revision-status').val() == 'Good';
        const description = $('#revision-description').val();;
        fetch('/api/maintenance/revisions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, author, passed, description })
        }).then(resp => {
            $('#revision-modal .modal-body > p').text(`Revision Response: ${resp.statusText} (${resp.status})`);
            $('#revision-modal').modal('show');
            updateRevisions(true, NOP_VIEWER.getIsolatedNodes());
            setTimeout(function() { $('#revision-modal').modal('hide'); }, 1000);
        });
        ev.preventDefault();
    });

    updateRevisions(true);
    updateRevisionForm();
    updateRevisionChart();
}