# node-express-ejs-authorization boilerplate

## Application framework

- MVC

## HTTP engine

- express

## View template engine

- ejs

## Authorization

- jws

## Tutorial

```
git clone https://github.com/jobscale/node-express-ejs-authorization.git
cd node-express-ejs-authorization
npm i
npm start

open http://127.0.0.1:3000
```

login<br>
> user: wendy<br>
> password: AS2P8AcBedZ

## Docker container

- local build
```
docker build . -t p3000
docker run --name p3000 --rm -p 3000:3000 -it p3000
```
- container repository
```
docker run --name p3000 --rm -p 3000:3000 -it jobscale/node-express-ejs-authorization
```
- open
```
open http://127.0.0.1:3000
```

- curl
```
curl -i -X POST -H 'Content-Type: application/json' \
http://127.0.0.1:3000/api/slack \
--data '{"text":"with terminal"}'
```

- fetch
```
fetch("http://127.0.0.1:3000/api/slack", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  "body": JSON.stringify({ text: 'with browser' }),
});
```

login<br>
> user: wendy<br>
> password: AS2P8AcBedZ

## Directory tree

```
├── README.md
├── app
│   ├── controllers
│   │   ├── accountController.js
│   │   ├── authController.js
│   │   ├── controller.js
│   │   ├── templateController.js
│   │   ├── topController.js
│   │   └── userController.js
│   ├── global.js
│   ├── index.js
│   ├── models
│   │   ├── auth.js
│   │   └── user.js
│   ├── routes
│   │   ├── accountRoute.js
│   │   ├── authRoute.js
│   │   ├── route.js
│   │   ├── templateRoute.js
│   │   ├── topRoute.js
│   │   └── userRoute.js
│   ├── services
│   │   ├── accountService.js
│   │   ├── authService.js
│   │   ├── service.js
│   │   ├── templateService.js
│   │   ├── topService.js
│   │   └── userService.js
│   ├── validations
│   │   ├── accountValidation.js
│   │   ├── authValidation.js
│   │   └── userValidation.js
│   └── views
│       ├── account
│       │   └── password.ejs
│       ├── auth
│       │   └── login.ejs
│       ├── error
│       │   └── default.ejs
│       ├── index.ejs
│       ├── menu
│       │   ├── body.ejs
│       │   └── head.ejs
│       ├── partial
│       │   └── header.ejs
│       └── user
│           ├── index.ejs
│           ├── register.ejs
│           └── reset.ejs
├── db.example
│   └── users.json
├── index.js
├── package.json
└── public
    ├── css
    │   ├── form.css
    │   ├── menu.css
    │   └── style.css
    ├── img
    │   ├── arrow.png
    │   └── bg.png
    └── js
        ├── account
        │   └── password.js
        ├── loader.js
        ├── login.js
        ├── menu.js
        ├── user
        │   ├── register.js
        │   └── reset.js
        └── util.js
```

## License

- MIT
