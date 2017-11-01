require! {
    \express
    \require-ls
    \./ddos.ls
}

app = express!

app.use ddos { static: 1000, api: 1000, ban: 10 * 1000 }

app.listen 8080