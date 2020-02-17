class GooglePicker {

    /**
     * Replace with your credentials
     * @type {string, boolean}
     */
    developerKey = 'AIzaSyDdAZpO8pm1smUurUTfiyo-BGEnpHCweoI';
    clientId = '141211420870-fd3ktu1879c2p6u4l6rd4upgafj5clqs.apps.googleusercontent.com';
    appId = '141211420870';
    scope = ['https://www.googleapis.com/auth/drive.appfolder'];
    pickerApiLoaded = false;
    oauthToken;

    constructor () {
    }

    /**
     * Initialize the picker will be called per the SDK
     */
    loadPicker = () => {
        gapi.load('auth', {'callback': this.onAuthApiLoad});
        gapi.load('picker', {'callback': this.onPickerApiLoad});
    };

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

    createPicker() {
        if (this.pickerApiLoaded && this.oauthToken) {
            const view = new google.picker.View(google.picker.ViewId.DOCS);
            view.setMimeTypes("video/mp4");
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
                .setCallback(this.pickerCallback)
                .build();
            picker.setVisible(true);
        }
    }

    pickerCallback(data) {
        if (data.action === google.picker.Action.PICKED) {
            const fileId = data.docs[0].id;
            alert('The user selected: ' + fileId);
        }
    }
}
