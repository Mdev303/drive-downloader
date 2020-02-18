// The Browser API key obtained from the Google API Console.
const developerKey = 'AIzaSyCzVvGJh74YBCe0XLRx3rSbiviB_zvugLE';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
const clientId = '764781418716-tgrmk858t8ktlaiaen6ha7f8a3l9bt14.apps.googleusercontent.com';

// Scope to use to access user's google drive files.
const scope = 'https://www.googleapis.com/auth/drive.file';

let pickerApiLoaded = false;
let oauthToken;

// Function to copy the future url on the clipboard
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

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoad() {
    gapi.load('auth2', onAuthApiLoad);
    gapi.load('picker', onPickerApiLoad);
}

// When the login button is pressed sign in
function onAuthApiLoad() {
   document.querySelector('.google-btn').addEventListener('click', () => {
       gapi.auth2.init({ client_id: clientId }).then(function(googleAuth) {
           googleAuth.signIn({ scope: scope }).then(function(result) {
               handleAuthResult(result.getAuthResponse());
           })
       });
   })
}
// Callback function to load picker
function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

// On auth success create a picker
function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for picking from Google drive.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        const view = new google.picker.DocsView();
        view.setMode(google.picker.DocsViewMode.LIST);
        view.setIncludeFolders(true);
        const picker = new google.picker.PickerBuilder()
            .setOAuthToken(oauthToken)
            .setLocale('en')
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

// Callback function that will parse the google drive download URL & copy to clipboard
function pickerCallback(data) {
    let id = 'nothing';
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
        const doc = data[google.picker.Response.DOCUMENTS][0];
        id = doc[google.picker.Document.ID];
        const message = `https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?id=${id}&authuser=2&export=download`;
        const response  = axios.post(message, '', {
            headers: {
                'X-Drive-First-Party': 'DriveWebUi',
                'x-requested-with': 'BeTobe'
            }
        });
        response.then(({data}) => {
            const downloadUrl = data.match(/downloadUrl":"(.*?)"/);
            let fileName = data.match(/fileName":"(.*?)"/);
            if (fileName.length > 0) {
                fileName = fileName[1];
            } else {
                fileName = 'Download'
            }
            const replaced = downloadUrl[1].replace('/\\u003d|\\u0026\g', '');
            copyToClipboard(replaced);
            document.getElementById('text-container').style.display = 'block';
            if (fileName.length > 35) {
                fileName = `${fileName.slice(0, 35)}...`
            }
            document.getElementById('text-container').textContent = fileName;
            document.getElementById('text-container').href = replaced;
        });
    }
}
