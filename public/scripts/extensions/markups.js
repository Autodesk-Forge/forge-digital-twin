const MOCK_MARKUP_NOTES = ['foo', 'bar', 'baz'];
const MARKUP_DATA = [];
for (let i = 0; i < 10; i++) {
    MARKUP_DATA.push({
        id: i,
        x: (Math.random() - 0.5) * 100.0,
        y: (Math.random() - 0.5) * 100.0,
        z: (Math.random() - 0.5) * 1000.0,
        note: MOCK_MARKUP_NOTES[Math.floor(Math.random() * MOCK_MARKUP_NOTES.length)]
    });
}

class MarkupExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;

        if (this.viewer.toolbar) {
            this._createUI();
        } else {
            const onToolbarCreated = () => {
                this._createUI();
                this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
            };
            this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
        }

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
            if (this._enabled) {
                this._updateMarkups();
            }
        });

        return true;
    }

    unload() {
        this.viewer.toolbar.removeControl(this.toolbar);
    }

    _createUI() {
        const viewer = this.viewer;

        this.button = new Autodesk.Viewing.UI.Button('MarkupButton');
        this.button.onClick = () => {
            this._enabled = !this._enabled;
            if (this._enabled) {
                this._createMarkups();
            } else {
                this._removeMarkups();
            }
        };
        this.button.addClass('adsk-icon-box');
        this.button.setToolTip('Markups');
        this.toolbar = viewer.toolbar.getControl('CustomToolbar') || new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
        this.toolbar.addControl(this.button);
        viewer.toolbar.addControl(this.toolbar);
    }

    _createMarkups() {
        const $viewer = $('#viewer');
        for (const item of MARKUP_DATA) {
            const pos = this.viewer.worldToClient(new THREE.Vector3(item.x, item.y, item.z));
            const $label = $(`
                <label class="markup" data-id="${item.id}">
                    <img src="/favicon.ico" width="15" height="15" />
                    <a href="#">${item.id}</a>: ${item.note}
                </label>
            `);
            $label.css('left', Math.floor(pos.x) + 'px');
            $label.css('top', Math.floor(pos.y) + 'px');
            $viewer.append($label);
        }
    }

    _updateMarkups() {
        for (const label of $('#viewer label.markup')) {
            const $label = $(label);
            const id = $label.data('id');
            const item = MARKUP_DATA[parseInt(id)];
            const pos = this.viewer.worldToClient(new THREE.Vector3(item.x, item.y, item.z));
            $label.css('left', Math.floor(pos.x) + 'px');
            $label.css('top', Math.floor(pos.y) + 'px');
        }
    }

    _removeMarkups() {
        const $viewer = $('#viewer label.markup').remove();
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MarkupExtension', MarkupExtension);