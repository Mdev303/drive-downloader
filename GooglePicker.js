const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

// The Browser API key obtained from the Google API Console.
const developerKey = 'AIzaSyCzVvGJh74YBCe0XLRx3rSbiviB_zvugLE';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
const clientId = '764781418716-tgrmk858t8ktlaiaen6ha7f8a3l9bt14.apps.googleusercontent.com';

// Scope to use to access user's photos.
const scope = 'https://www.googleapis.com/auth/drive.file';

let pickerApiLoaded = false;
let oauthToken;

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoad() {
    gapi.load('auth2', onAuthApiLoad);
    gapi.load('picker', onPickerApiLoad);
}

function onAuthApiLoad() {
   document.querySelector('.google-btn').addEventListener('click', () => {
       gapi.auth2.init({ client_id: clientId }).then(function(googleAuth) {
           googleAuth.signIn({ scope: scope }).then(function(result) {
               handleAuthResult(result.getAuthResponse());
           })
       });
   })
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for picking from Google Photos.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        const view = new google.picker.DocsView();
        view.setMode(google.picker.DocsViewMode.LIST);
        view.setIncludeFolders(true);
        const picker = new google.picker.PickerBuilder()
            .setOAuthToken(oauthToken)
            .setLocale('fr')
            .addViewGroup(view)
            .hideTitleBar()
            .setSize(1920, 3280)
            .setTitle('Google drive downloader by BeToBe')
            .setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
    }
}

// A simple callback implementation.
function pickerCallback(data) {
    let id = 'nothing';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        id = doc[google.picker.Document.ID];
    }
    const message = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=AIzaSyBFHimHWDyLOtcNJjA268KwRLhsBuckUxc`;
    copyToClipboard(message);
}
