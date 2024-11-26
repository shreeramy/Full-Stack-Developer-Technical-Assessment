# Kids Needs App

## Installation

To install and set up the Kids Needs App, follow these steps:
Clone the repository: 
``` sh
git clone <repository_url>
``` 

* Install the required dependencies 
``` sh
pip install -r requirements.txt
```

## Set up the database

* Run migrations
``` sh
python manage.py makemigrations
python manage.py migrate
```

* Start the development server

```sh
python manage.py runserver
```


- GET /api/documents - List all documents.
- GET /api/documents?search= - Search documents.
- GET /api/documents/{id} - Get a single document.
- POST /api/documents - Create a new document.
- DELETE /api/documents/{id} - Delete a document.

* Sample Response
```sh
{
  "id": 1,
  "name": "document1",
  "content": "content",
  "created_at": "2024-11-26T09:42:03.219593Z",
  "size": 123
}
```