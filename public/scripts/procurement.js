function initProcurementTab() {
    const $tbody = $('#purchases > tbody');
    const $pagination = $('#procurement .pagination');
    let purchases = {
        list: [],
        pageSize: 10,
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
            $('#purchase-part').val('');
            $('#purchase-price').val('');
            $('#purchase-form button').attr('disabled', true);
        }
    }

    $('#purchases').on('click', function(ev) {
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
            purchases.currPage = page - 1;
            updatePurchasesTable();
            updatePurchasesPagination();
        }
    });
    NOP_VIEWER.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        updatePurchases(true, NOP_VIEWER.getIsolatedNodes());
    });
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(ev) {
        updatePurchaseForm(NOP_VIEWER.getSelection());
    });
    $('#purchase-form button').on('click', function(ev) {
        const partId = parseInt($('#purchase-part').val());
        const supplier = $('#purchase-supplier').val();
        const price = parseFloat($('#purchase-price').val().replace('$', ''));
        fetch('/api/procurement/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, supplier, price })
        }).then(resp => {
            alert(`Purchase Response: ${resp.statusText} (${resp.status})`);
            updatePurchases(true, NOP_VIEWER.getIsolatedNodes());
        });
        ev.preventDefault();
    });

    updatePurchases(true);
    updatePurchaseForm();
}