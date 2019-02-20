function initMaintenanceTab() {
    const $tbody = $('#maintenance-history > tbody');
    const $pagination = $('#maintenance .pagination');
    let maintenance = {
        list: [],
        pageSize: 10,
        currPage: 0
    };

    async function updateMaintenance(reload, partIds) {
        if (reload) {
            const query = (partIds && partIds.length > 0) ? '?parts=' + partIds.join(',') : '';
            const resp = await fetch('/api/maintenance/history' + query);
            maintenance.list = await resp.json();
            maintenance.currPage = 0;
        }
        updateMaintenanceTable();
        updateMaintenancePagination();
    }

    function updateMaintenanceTable() {
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

    function updateMaintenancePagination() {
        const { list, currPage, pageSize } = maintenance;
        const pageCount = Math.ceil(list.length / pageSize);
        $pagination.empty();
        for (let i = 0; i < pageCount; i++) {
            const $li = $(`<li class="page-item ${i == currPage ? 'active' : ''}"><a class="page-link" href="#">${i + 1}</a></li>`);
            $pagination.append($li);
        }
    }

    function updateMaintenanceForm(partIds) {
        if (partIds && partIds.length === 1) {
            $('#maintenance-part').val(partIds[0]);
            $('#maintenance-form button').attr('disabled', false);
        } else {
            $('#maintenance-part').val('(select part in 3D view)');
            $('#maintenance-form button').attr('disabled', true);
        }
    }

    $('#maintenance-history').on('click', function(ev) {
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
            updateMaintenanceTable();
            updateMaintenancePagination();
        }
    });

    NOP_VIEWER.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        updateMaintenance(true, NOP_VIEWER.getIsolatedNodes());
    });
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        updateMaintenanceForm(NOP_VIEWER.getSelection());
    });
    $('#maintenance-form button').on('click', function(ev) {
        const partId = parseInt($('#maintenance-part').val());
        const author = $('#maintenance-author').val();
        const passed = $('#maintenance-status').val() == 'Good';
        const description = $('#maintenance-description').val();;
        fetch('/api/maintenance/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, author, passed, description })
        }).then(resp => {
            $('#maintenance-modal .modal-body > p').text(`Maintenance Record Response: ${resp.statusText} (${resp.status})`);
            $('#maintenance-modal').modal('show');
            updateMaintenance(true, NOP_VIEWER.getIsolatedNodes());
            setTimeout(function() { $('#maintenance-modal').modal('hide'); }, 1000);
        });
        ev.preventDefault();
    });

    updateMaintenance(true);
    updateMaintenanceForm();
}