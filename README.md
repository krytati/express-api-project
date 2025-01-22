This is a simple TypeScript backend project. 

It has MongoDB in Memory Server and a few endpoints for CRUD database operations.
It also has simple jwt authorisation and routing with Express framework.
You can run the server locally (`npm run start`) and try test it with Postman or just run jest tests (`npm run test`).


- localhost:3001/signIn

        {
          "userName": "user-from-db"
        }
  
      and set bearer token from response.


- localhost:3001/list

- localhost:3001/createUser

      {
        "user": {
            "userName": "NewUserName",
            "firstName": "NewUserFirstName",
            "lastName": "NewUserLastName"
        }
      }

- localhost:3001/userById/\<exampleId>
