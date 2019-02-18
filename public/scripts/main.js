const URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtZGlnaXRhbC10d2luL0pldF9FbmdpbmVfTW9kZWwuemlw';

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
    app.registerViewer(app.k3D, Autodesk.Viewing.Private.GuiViewer3D, { extensions: [] });
    loadModel(URN);
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
            setTimeout(function() {
                app.getCurrentViewer().setViewCube('back, top, left');
            }, 1000);
            resolve();
        }
        function onItemLoadFailure() { reject('could not load model'); }
        app.loadDocument('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}