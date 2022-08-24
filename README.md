# ddb-lab

## Prepare environmet

- [Install DynamoDB Local](https://dynobase.dev/run-dynamodb-locally/)
- [Download NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html)

## IMDB Data

- [Datasets](https://datasets.imdbws.com/)
- [Interfaces](https://www.imdb.com/interfaces/)

## Hints

- Remove table:

    `aws dynamodb delete-table --table-name Movies --endpoint-url http://localhost:8000`
