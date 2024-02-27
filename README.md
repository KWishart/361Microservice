# 361Microservice
Communication Contract 

A. How to programatically request data:
  Write to the token.json file with the information provided by Google's authentication when a user logs in.
  Example: 
    JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,                        # client_id and client_secret are taken from credentials.json
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });

B. How to programatically receive data:
  Read from contacts.json to receive name and email from user's contacts if they have any.

C. UML Sequence Diagram:
             ----------------                    ----------------                  ----------------
            | Program making |                  |  token.json    |                |  contact list  |
            |    Request     |                  |                |                |  microservice  |
             ----------------                    ----------------                  ----------------
   program must     |                                   |    loop                          |    microservice retrieves
   authenticate     |      write refresh token and      |        ReadFile(token.json)      |    data from Google and loops
   user from Google |  -------------------------------> |  <------------------------------ |    until all contacts are found
                    |      credentials to json file     |                                  |
                    |                                   |                                  |
                    |  loop                             |       WriteFile(contacts.json)   |    writes contacts information to json
                    |      check file for contacts      |  <------------------------------ |
                    |  <------------------------------- |  end loop                        |
                    |  end loop                         |  opt                             |
                    |                                   |      WriteFile(contacts.json)    |    if none are found, microservice
                    |                                   |  <------------------------------ |    writes 'no contacts found'
                                               ----------------
                                              |  contacts.json |
                                               ----------------
