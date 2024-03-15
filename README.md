# Infrastructure

## How To Use </>

### RUN 
```
npm install or yarn install
```

### SETUP THE INSTALLATION PACKAGE OFF DEV DEPENDENCIES
```
npm i --save-dev ts-node nodemon @types/compression @types/bcrypt @types/cookie-parser @types/cors @types/dotenv @types/express @types/express-session @types/jsonwebtoken @types/uuid
```

### SETUP THE INSTALLATION PACKAGE OFF ONLY DEPENDENCIES
```
npm i  @types/passport @types/passport-google-oauth2
```


### Setup The .ENV FILE OR Create a New One 🙌
```
DATABASE_URL = YOUR PRISMA BD URL PRISMA 
```
##### Using PostQL Database
```
postgres://<username>:<your_DB_pass>@localhost:5432/<default_DB_Name>
```
##### Using MYSQL Database
```
mysql://<username>:<your_DB_pass>@localhost:5432/<default_DB_Name>?connection_limit=<up_to_your>
```

##### After setup your ENV file, now Run This CMD
```
1. npm install prisma --save-dev
2. npx prisma init --datasource-provider <the provider name like: mysql, sqlite, sch>
3. npx prisma migrate dev --name init
4. run in diffrent CMD for this command "npx prisma studio" 
```

```
PORT = Your Smaple Port Running IN BackENd (like : 2000)
```

```
GOOGLE_CLIENT_ID= Your Google Client ID ( you can get on : [https://console.cloud.google.com/welcome?project])
```

```
GOOGLE_CALLBACK_URL= Your CallBack Auth Redirct (example : [localhost:300/callback/auth/google])
```

```
GOOGLE_CLIENT_SECRET= Your GOOGLE CLIENT SECRET ( you can get here ; [https://console.cloud.google.com/welcome?project] )
```

```
ACCESS_TOKEN_SECRET= YOUR ACCESS TOKEN (YOU CAN CREATE USING [Write in CMD : node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"])
```

```
REFRESH_TOKEN_SECRET= YOUR Refresh TOKEN (YOU CAN CREATE USING [Write in CMD : node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"])
```

```
SERVICE_EMAIL = your email 
```

```
SERVICE_USERNAME = your username Email
```

```
SERVICE_PASSWORD = your Password
```

```
SESSION_SECRET_TOKEN =  your SESSION SECRET TOKEN
```


