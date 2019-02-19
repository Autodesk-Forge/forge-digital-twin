function initProcurementTab() {
    $('#purchases .part-link').on('click', function(ev) {
        let partId = parseInt(ev.target.innerText);
        if (partId) {
            let selectedIds = NOP_VIEWER.getSelection();
            if (selectedIds.length == 0 || selectedIds[0] !== partId) {
                NOP_VIEWER.select(partId);
                NOP_VIEWER.fitToView(partId);
            }
        }
    });

    NOP_VIEWER.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, function(ev) {
        const isolatedIds = NOP_VIEWER.getIsolatedNodes();
        const rows = $('#purchases > tbody > tr');
        if (isolatedIds.length > 0) {
            for (const row of rows) {
                const link = $(row).find('.part-link')[0];
                if (isolatedIds.indexOf(parseInt(link.innerText)) === -1) {
                    $(row).hide();
                } else {
                    $(row).show();
                }
            }
        } else {
            rows.show();
        }
    });
}