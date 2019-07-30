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

let mainViewer = null;

Autodesk.Viewing.Initializer(options, () => {
    mainViewer = new Autodesk.Viewing.Private.GuiViewer3D(
        document.getElementById('viewer'),
        { extensions: ['HeatmapExtension', 'IssuesExtension', 'AnimationExtension'] }
    );
    mainViewer.start();
    loadModel(DEMO_URN /* set by the server-side template engine */);
});

function loadModel(urn) {
    return new Promise(function(resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            const node = doc.getRoot().getDefaultGeometry();
            mainViewer.loadDocumentNode(doc, node)
                .then(function () {
                    initPerformanceTab(mainViewer);
                    initMaintenanceTab(mainViewer);
                    initProcurementTab(mainViewer);
                    initViewer(mainViewer);
                    resolve();
                })
                .catch(function (err) {
                    reject('Could not load viewable: ' + err);
                });
        }
        function onDocumentLoadFailure(err) {
            reject('Could not load document: ' + err);
        }
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
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
