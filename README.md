<p align="center">
  <a href="https://rlujancreations.es/" target="blank"><img src="https://rlujancreations.es/wp-content/themes/rlujancreationstheme/assets/images/newlogotitle.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

## Description

**Zodiac Backend** is a backend for [CienciasOcultas](https://github.com/kmorfo/CienciasOcultasApp) kotlin app
This backend provides a prediction for the zodiacal sign requested in the language sent in parameters

We can get daily or weekly predictions according out needed

## Zodiac Backend

1. Clone this respository
2. `yarn install`
3. Clone `.env.template` file and rename to `.env`
4. Configure all environment variables according to out needs
5. Run:

```
yarn start:dev
```

6. OpenAPI Documentation

```
http://localhost:3000/api/
```

7. Get app in docker container

```
docker container run  \
-dp 3001:3001 \
--name zodiacal-backend \
kmorfo/zodiacal_backend:1.0.0
```

## License

[MIT licensed](LICENSE).
