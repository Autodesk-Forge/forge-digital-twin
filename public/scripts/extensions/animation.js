ANIMATED_PARTS = [1467, 1412];

class AnimationExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;
        return true;
    }

    unload() {
        this.viewer.toolbar.removeControl(this.toolbar);
        return true;
    }

    onToolbarCreated() {
        this._createUI();
    }

    _enableAnimations(ids) {
        const viewer = this.viewer;
        const it = viewer.model.getData().instanceTree;
        const axis = new THREE.Vector3(0, 0, 1);
        const meshes = [];
        for (const id of ids) {
            it.enumNodeFragments(id, function(fragId) {
                const mesh = viewer.impl.getFragmentProxy(viewer.model, fragId);
                mesh.scale = new THREE.Vector3(1, 1, 1);
                mesh.quaternion = new THREE.Quaternion(0, 0, 0, 1);
                mesh.position = new THREE.Vector3(0, 0, 0);
                meshes.push(mesh);
            }, true);
        }

        let counter = 0;
        this._timer = setInterval(function() {
            for (const mesh of meshes) {
                mesh.quaternion.setFromAxisAngle(axis, Math.PI * counter);
                mesh.updateAnimTransform();
            }
            counter += 0.123;
            viewer.impl.invalidate(true, true, true);
        }, 100);
    }

    _disableAnimations() {
        clearInterval(this._timer);
    }

    _createUI() {
        const viewer = this.viewer;

        this.button = new Autodesk.Viewing.UI.Button('AnimationButton');
        this.button.onClick = () => {
            this._enabled = !this._enabled;
            if (this._enabled) {
                this._enableAnimations(ANIMATED_PARTS);
                this.button.setState(0);
            } else {
                this._disableAnimations();
                this.button.setState(1);
            }
        };
        const icon = this.button.container.children[0];
        icon.classList.add('fas', 'fa-broadcast-tower');
        this.button.setToolTip('Realtime Data Animation');
        this.toolbar = viewer.toolbar.getControl('CustomToolbar') || new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
        this.toolbar.addControl(this.button);
        viewer.toolbar.addControl(this.toolbar);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('AnimationExtension', AnimationExtension);