class DirectLink {
    /**
     * Google apis credentials initialisation
     * @type {string}
     */
    CLIENT_ID = '764781418716-sjfvoh4fpou2jbqu7v568e32dqu2genv.apps.googleusercontent.com';
    API_KEY = 'AIzaSyDJZ-XjiaxW5nWtFvZT8iMTS-jEFhkJ71Y';
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    /**
     * Calling initialisation function with auth parameter
     */
    constructor () {
        gapi.load('client:auth2', this.initClient);
    }

    /**
     * Init client and update current status + listen to his changes
     * @returns {Promise<void>}
     */
    initClient = async () => {
        await gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES
        });
        // Listen for status change
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);

        // Update current status
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        this.updateSignInStatus(signedIn);
        console.log(`Is signed in ? ${signedIn}`);
        if (!signedIn) {
            this.login();
        }
    };

    /**
     * List files if logged in
     * @param signedIn
     */
    updateSignInStatus = (signedIn) => {
        if (signedIn) {
            this.listFiles();
        }
    };

    /**
     * Sign In
     */
     login = () => {
        gapi.auth2.getAuthInstance().signIn();
     };

    /**
     * Sign out
     */
    logout = () => {
         gapi.auth2.getAuthInstance().signOut();
     };

    /**
     * Return files
     * @returns {Promise<void>}
     */
     listFiles = async () => {
        const response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
        });
        const files = response.result.files;
        console.log(files);
    }
}
