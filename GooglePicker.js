class GooglePicker {

    /**
     * Replace with your credentials
     * @type {string, boolean}
     */
    developerKey = 'AIzaSyCzVvGJh74YBCe0XLRx3rSbiviB_zvugLE';
    clientId = '764781418716-tgrmk858t8ktlaiaen6ha7f8a3l9bt14.apps.googleusercontent.com';
    appId = '764781418716';
    scope = ['https://www.googleapis.com/auth/drive.appfolder'];
    pickerApiLoaded = false;
    oauthToken;
    callbackFnc;

    constructor (callback) {
        this.callbackFnc = callback;
    }

    onAuthApiLoad = () => {
        console.log('on auth claled');
        window.gapi.auth.authorize(
            {
                'client_id': this.clientId,
                'scope': this.scope,
                'immediate': false
            },
            this.handleAuthResult);
    };

    onPickerApiLoad = () => {
        this.pickerApiLoaded = true;
        this.createPicker();
    };

    handleAuthResult = (authResult) => {
        if (authResult && !authResult.error) {
            this.oauthToken = authResult.access_token;
            this.createPicker();
        }
    };

    createPicker = () => {
        if (this.pickerApiLoaded && this.oauthToken) {
            const view = new google.picker.View(google.picker.ViewId.DOCS);
            //view.setMimeTypes("video/mp4");
            const picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
                .setAppId(this.appId)
                .setOAuthToken(this.oauthToken)
                .setLocale('fr')
                .setTitle('Direct Downloader By BeToBe')
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(this.developerKey)
                .setCallback(this.callbackFnc)
                .build();
            picker.setVisible(true);
        }
    }
}
