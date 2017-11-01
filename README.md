Blockstarter's DDOS Protection

Install

```
npm i bs-ddos
```


Use

```Livescript

require! {
    \express
    \ddos
}

app = express!

app.use ddos { static: 1000, api: 1000, ban: 10 * 1000 }


app.listen 80

```

Params 

* api  - limit requests in ms for /api/... requests
* static - limit requests in ms for all other requests
* ban - ban user in ms when he was rejected 4 times