# HRMS

## devs
vineet,
pranav


```bash
cd client
npm i
npm run dev
```

```bash
cd server
python -m venv venv
pip install -r requirements.txt
env\Scripts\activate.bat
```




## Intialize Alembic
```bash
alembic init alembic
```

### Create Migrations
```bash
alembic revision --autogenerate -m "create users"
```
or
```bash
alembic revision --autogenerate -m "initial schema"
```


### Apply Migrations
***important***
```bash
alembic upgrade head
```

later
```bash
alembic revision \
--autogenerate \
-m "create employees"
```