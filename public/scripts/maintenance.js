function initMaintenanceTab() {
    let maintenance = {
        list: [],
        pageSize: 5,
        currPage: 0
    };
    let issues = {
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
        const $tbody = $('#revisions > tbody');
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
        const $pagination = $('#revisions + nav > .pagination');
        const { list, currPage, pageSize } = maintenance;
        const pageCount = Math.ceil(list.length / pageSize);
        $pagination.empty();
        for (let i = 0; i < pageCount; i++) {
            const $li = $(`<li class="page-item ${i == currPage ? 'active' : ''}"><a class="page-link" href="#">${i + 1}</a></li>`);
            $pagination.append($li);
        }
    }

    function updateRevisionForm(partIds) {
        if (!partIds || partIds.length !== 1) {
            $('#revision-part').val('(select one part in 3D view)');
            $('#revision-form button').attr('disabled', true);
        } else {
            $('#revision-part').val(partIds[0]);
            $('#revision-form button').attr('disabled', false);
        }
    }

    async function updateIssues(reload, partIds) {
        if (reload) {
            const query = (partIds && partIds.length > 0) ? '?parts=' + partIds.join(',') : '';
            const resp = await fetch('/api/maintenance/issues' + query);
            issues.list = await resp.json();
            issues.currPage = 0;
        }
        updateIssuesTable();
        updateIssuesPagination();
    }

    function updateIssuesTable() {
        const $tbody = $('#issues > tbody');
        const { list, currPage, pageSize } = issues;
        $tbody.empty();
        for (let i = currPage * pageSize; i < (currPage + 1) * pageSize && i < list.length; i++) {
            const issue = list[i];
            const date = new Date(issue.createdAt);
            const $row = $(`
                <tr>
                    <th scope="row">${date.toLocaleDateString()}</th>
                    <td><a href="#" class="part-link">${issue.partId}</a></td>
                    <td>${issue.author}</td>
                    <td>${issue.text}</td>
                </tr>
            `);
            $tbody.append($row);
        }
    }

    function updateIssuesPagination() {
        const $pagination = $('#issues + nav > .pagination');
        const { list, currPage, pageSize } = issues;
        const pageCount = Math.ceil(list.length / pageSize);
        $pagination.empty();
        for (let i = 0; i < pageCount; i++) {
            const $li = $(`<li class="page-item ${i == currPage ? 'active' : ''}"><a class="page-link" href="#">${i + 1}</a></li>`);
            $pagination.append($li);
        }
    }

    function updateIssueForm(partIds) {
        if (!partIds || partIds.length !== 1) {
            $('#issue-part').val('(select one part in 3D view)');
            $('#issue-form button').attr('disabled', true);
        } else {
            $('#issue-part').val(partIds[0]);
            $('#issue-form button').attr('disabled', false);
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

    // Highlight a part in 3D view when its ID is clicked in the revisions table
    $('#revisions').on('click', function(ev) {        
        if (ev.target.innerText.match(/^\d+$/)) {
            const partId = parseInt(ev.target.innerText);
            const selectedIds = NOP_VIEWER.getSelection();
            if (selectedIds.length == 0 || selectedIds[0] !== partId) {
                NOP_VIEWER.select(partId);
                NOP_VIEWER.fitToView([partId]);
            }
        }
    });

    // Highlight a part in 3D view when its ID is clicked in the issues table
    $('#issues').on('click', function(ev) {        
        if (ev.target.innerText.match(/^\d+$/)) {
            const partId = parseInt(ev.target.innerText);
            const selectedIds = NOP_VIEWER.getSelection();
            if (selectedIds.length == 0 || selectedIds[0] !== partId) {
                NOP_VIEWER.select(partId);
                NOP_VIEWER.fitToView([partId]);
            }
        }
    });

    // Handle revisions table pagination
    $('#revisions + nav > .pagination').on('click', function(ev) {
        if (ev.target.innerText.match(/^\d+$/)) {
            const page = parseInt(ev.target.innerText);
            maintenance.currPage = page - 1;
            updateRevisionsTable();
            updateRevisionsPagination();
        }
    });

    // Handle issues table pagination
    $('#issues + nav > .pagination').on('click', function(ev) {
        if (ev.target.innerText.match(/^\d+$/)) {
            const page = parseInt(ev.target.innerText);
            issues.currPage = page - 1;
            updateIssuesTable();
            updateIssuesPagination();
        }
    });

    // Filter revision/issue tables based on parts isolated in 3D view
    NOP_VIEWER.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        const ids = NOP_VIEWER.getIsolatedNodes();
        updateRevisions(true, ids);
        updateIssues(true, ids);
    });

    // Update revision/issue forms based on parts highlighted in 3D view
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        const ids = NOP_VIEWER.getSelection()
        updateRevisionForm(ids);
        updateIssueForm(ids);
        if (ids.length === 1) {
            // Choose one of the pages in the pdf with some nice diagrams
            const page = [8, 6, 5][ids[0] % 3];
            $('#maintenance-instructions embed').attr('src', `/resources/Learning_about_how_aircraft_engines_work_and_fail.pdf#page=${page}`);
            $('#maintenance-instructions div.alert').hide();
        } else {
            $('#maintenance-instructions embed').attr('src', '');
            $('#maintenance-instructions div.alert').show();
        }
    });

    // Handle the event of submitting new revision
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
            const $modal = $('#revision-modal');
            if (resp.status === 200) {
                $('#revision-modal .modal-body > p').text(`Revision Response: ${resp.statusText} (${resp.status})`);
                $modal.modal('show');
                setTimeout(function() { $modal.modal('hide'); }, 1000);
                updateRevisions(true, NOP_VIEWER.getIsolatedNodes());
            } else {
                resp.text().then(text => {
                    $('#revision-modal .modal-body > p').text(`Revision Response: ${resp.statusText} (${resp.status}) ${text}`);
                    $modal.modal('show');
                    setTimeout(function() { $modal.modal('hide'); }, 5000);
                });
            }
        });
        ev.preventDefault();
    });

    // Handle the event of submitting new issue
    $('#issue-form button').on('click', function(ev) {
        const partId = parseInt($('#issue-part').val());
        const text = $('#issue-title').val();
        const author = $('#issue-author').val();
        const x = parseFloat($('#issue-position-x').val());
        const y = parseFloat($('#issue-position-y').val());
        const z = parseFloat($('#issue-position-z').val());
        fetch('/api/maintenance/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, text, author, x, y, z })
        }).then(resp => {
            const $modal = $('#issue-modal');
            if (resp.status === 200) {
                $('#issue-modal .modal-body > p').text(`Issue Response: ${resp.statusText} (${resp.status})`);
                $modal.modal('show');
                setTimeout(function() { $modal.modal('hide'); }, 1000);
                updateIssues(true, NOP_VIEWER.getIsolatedNodes());
            } else {
                resp.text().then(text => {
                    $('#issue-modal .modal-body > p').text(`Issue Response: ${resp.statusText} (${resp.status}) ${text}`);
                    $modal.modal('show');
                    setTimeout(function() { $modal.modal('hide'); }, 5000);
                });
            }
        });
        ev.preventDefault();
    });

    // After a mouse click on 3D viewport, populate X/Y/Z of the intersection
    $('#viewer').on('click', function(ev) {
        let intersections = [];
        NOP_VIEWER.impl.castRayViewport(NOP_VIEWER.impl.clientToViewport(ev.clientX, ev.clientY), false, null, null, intersections);
        if (intersections.length > 0) {
            const intersection = intersections[0];
            $('#issue-part').val(intersection.dbId);
            $('#issue-position-x').val(intersection.point.x.toFixed(2));
            $('#issue-position-y').val(intersection.point.y.toFixed(2));
            $('#issue-position-z').val(intersection.point.z.toFixed(2));
        }
    });

    updateRevisions(true);
    updateRevisionForm();
    updateRevisionChart();
    updateIssues(true);
    updateIssueForm();
}