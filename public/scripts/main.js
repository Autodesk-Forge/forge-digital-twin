const options = {
	env: 'AutodeskProduction',
	getAccessToken: function(callback) {
		fetch('/api/auth/token')
		    .then((response) => response.json())
		    .then((json) => {
                const auth = json.access_token;
                callback(auth.access_token, auth.expires_in);
            });
	}
};

let app = null;

Autodesk.Viewing.Initializer(options, () => {
	app = new Autodesk.Viewing.ViewingApplication('viewer');
    app.registerViewer(app.k3D, Autodesk.Viewing.Private.GuiViewer3D, { extensions: ['HeatmapExtension', 'IssuesExtension', 'AnimationExtension'] });
    loadModel(DEMO_URN /* set by the server-side template engine */);
});

function loadModel(urn) {
    return new Promise(function(resolve, reject) {
        function onDocumentLoadSuccess() {
            const viewables = app.bubble.search({ type: 'geometry' });
            if (viewables.length > 0) {
                app.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFailure);
            }
        }
        function onDocumentLoadFailure() { reject('could not load document'); }
        function onItemLoadSuccess() {
            const viewer = app.getCurrentViewer();
            initPerformanceTab(viewer);
            initMaintenanceTab(viewer);
            initProcurementTab(viewer);
            initViewer(viewer);
            resolve();
        }
        function onItemLoadFailure() { reject('could not load model'); }
        app.loadDocument('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function initViewer(viewer) {
    viewer.setQualityLevel(/* ambient shadows */ false, /* antialiasing */ true);
    viewer.setGroundShadow(true);
    viewer.setGroundReflection(false);
    viewer.setGhosting(true);
    viewer.setEnvMapBackground(true);
    viewer.setLightPreset(5);
    viewer.setSelectionColor(new THREE.Color(0xEBB30B));
}

class RandomNumberGenerator {
    constructor(seed) {
        this.m = 0x80000000;
        this.a = 1103515245;
        this.c = 12345;
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    nextFloat() {
        return this.nextInt() / (this.m - 1);
    }
}