/* Citations: Code Adapted from Google's People API Tutorial */

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

//Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

// Load or request or authorization to call APIs.
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  return client;
}

// Print the name and email addresses to console and writes them to json file
async function listContacts(auth) {
  const service = google.people({version: 'v1', auth});
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log('No contacts found.');
    return;
  }
  console.log('User Contacts:');
  
  connections.forEach((person) => {
    if (person.names && person.names.length > 0 && person.emailAddresses && person.emailAddresses.length > 0) {
        let contact = 
        {
            name: person.names[0].displayName,
            email: person.emailAddresses[0].value
        };
        console.log(contact);
        fs.appendFile('./contacts.json', JSON.stringify(contact), err => {
            {
                if (err) {
                    console.error(err);
                }
            }
        });
    } else {
      console.log('No names or emails were found.');
    }
  });
}



authorize().then(listContacts).catch(console.error);
