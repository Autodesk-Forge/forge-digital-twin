class IssuesExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;
        this._issues = [];

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

        this.button = new Autodesk.Viewing.UI.Button('IssuesButton');
        this.button.onClick = () => {
            this._enabled = !this._enabled;
            if (this._enabled) {
                this._createMarkups();
                this.button.setState(0);
            } else {
                this._removeMarkups();
                this.button.setState(1);
            }
        };
        const icon = this.button.container.children[0];
        icon.classList.add('fas', 'fa-flag');
        this.button.setToolTip('Issues');
        this.toolbar = viewer.toolbar.getControl('CustomToolbar') || new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
        this.toolbar.addControl(this.button);
        viewer.toolbar.addControl(this.toolbar);
    }

    async _createMarkups() {
        const $viewer = $('#viewer');
        const response = await fetch('/api/maintenance/issues');
        this._issues = await response.json();
        for (const issue of this._issues) {
            // Randomly assign placeholder image to some issues
            if (Math.random() > 0.5) {
                issue.img = 'https://placeimg.com/150/100/tech?' + issue.id
            }
            const pos = this.viewer.worldToClient(new THREE.Vector3(issue.x, issue.y, issue.z));
            const $label = $(`
                <label class="markup" data-id="${issue.id}">
                    <img class="arrow" src="/images/arrow.png" />
                    <a href="#">${issue.author}</a>: ${issue.text}
                    ${issue.img ? `<br><img class="thumbnail" src="${issue.img}" />` : ''}
                </label>
            `);
            $label.css('left', Math.floor(pos.x) + 10 /* arrow image width */ + 'px');
            $label.css('top', Math.floor(pos.y) + 10 /* arrow image height */ + 'px');
            $viewer.append($label);
        }
    }

    _updateMarkups() {
        for (const label of $('#viewer label.markup')) {
            const $label = $(label);
            const id = $label.data('id');
            const item = this._issues.find(issue => issue.id === parseInt(id));
            const pos = this.viewer.worldToClient(new THREE.Vector3(item.x, item.y, item.z));
            $label.css('left', Math.floor(pos.x) + 10 /* arrow image width */ + 'px');
            $label.css('top', Math.floor(pos.y) + 10 /* arrow image height */ + 'px');
        }
    }

    _removeMarkups() {
        const $viewer = $('#viewer label.markup').remove();
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('IssuesExtension', IssuesExtension);