class IssuesExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;
        this._issues = [];

        const updateMarkupsCallback = () => {
            if (this._enabled) {
                this._updateMarkups();
            }
        };
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, updateMarkupsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, updateMarkupsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, updateMarkupsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, updateMarkupsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, updateMarkupsCallback);
        return true;
    }

    unload() {
        this.viewer.toolbar.removeControl(this.toolbar);
        return true;
    }

    onToolbarCreated() {
        this._createUI();
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

    async _createMarkups(partIds) {
        this._explodeExtension = this.viewer.getExtension('Autodesk.Explode');

        const $viewer = $('div.adsk-viewing-viewer');
        $('div.adsk-viewing-viewer label.markup').remove();
        const query = (partIds && partIds.length > 0) ? '?parts=' + partIds.join(',') : '';
        const response = await fetch('/api/maintenance/issues' + query);
        this._issues = await response.json();

        const viewer = this.viewer;
        const tree = viewer.model.getInstanceTree();
        for (const issue of this._issues) {
            // Store first fragment of each issue's part
            tree.enumNodeFragments(issue.partId, function(fragId) {
                if (!issue.fragment) {
                    issue.fragment = viewer.impl.getFragmentProxy(viewer.model, fragId);
                }
            });

            // Randomly assign placeholder image to some issues
            if (Math.random() > 0.5) {
                issue.img = 'https://placeimg.com/150/100/tech?' + issue._id
            }
            const pos = this.viewer.worldToClient(this._getIssuePosition(issue));
            const $label = $(`
                <label class="markup" data-id="${issue._id}">
                    <img class="arrow" src="/images/arrow.png" />
                    <a href="#">${issue.author}</a>: ${issue.text}
                    ${issue.img ? `<br><img class="thumbnail" src="${issue.img}" />` : ''}
                </label>
            `);
            $label.css('left', Math.floor(pos.x) + 10 /* arrow image width */ + 'px');
            $label.css('top', Math.floor(pos.y) + 10 /* arrow image height */ + 'px');
            $label.css('display', viewer.isNodeVisible(issue.partId) ? 'block' : 'none');
            $viewer.append($label);
        }
    }

    _updateMarkups() {
        const viewer = this.viewer;
        for (const label of $('div.adsk-viewing-viewer label.markup')) {
            const $label = $(label);
            const id = $label.data('id');
            const issue = this._issues.find(item => item._id === id);
            const pos = this.viewer.worldToClient(this._getIssuePosition(issue));
            $label.css('left', Math.floor(pos.x) + 10 /* arrow image width */ + 'px');
            $label.css('top', Math.floor(pos.y) + 10 /* arrow image height */ + 'px');
            $label.css('display', viewer.isNodeVisible(issue.partId) ? 'block' : 'none');
        }
    }

    _getIssuePosition(issue) {
        if (this._explodeExtension.isActive()) {
            issue.fragment.getAnimTransform();
            const offset = issue.fragment.position;
            return new THREE.Vector3(issue.x + offset.x, issue.y + offset.y, issue.z + offset.z);
        } else {
            return new THREE.Vector3(issue.x, issue.y, issue.z);
        }
    }

    _removeMarkups() {
        const $viewer = $('div.adsk-viewing-viewer label.markup').remove();
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('IssuesExtension', IssuesExtension);