from rest_framework.test import APITestCase
from .models import Documents
from rest_framework import status
import django
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
os.environ['DJANGO_ENV'] = 'test'

django.setup()


class DocumentManageAPITest(APITestCase):

    def setUp(self):
        self.document = Documents.objects.create(
                        name="Test Docuement",
                        content="content", size=100)
        self.url = '/api/documents/'

    def test_create_document_success(self):
        data = {
            "name": "document12",
            "content": "content",
            "size": 123}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(response.data['content'], data['content'])
        self.assertEqual(response.data['size'], data['size'])

    def test_invalid_content(self):
        data = {
            "name": "document12",
            "content": "content",
            }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('size', response.data)

    def test_documents_list_success(self):
        data = {
            "count": 1,
            "next": None,
            "previous": None,
            'results': [
                {
                    'id': 1,
                    'name': "Test Docuement",
                    'content': "content",
                    'created_at': str(self.document.created_at),
                    'size': 100
                }
            ]
        }

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], data['count'])
        self.assertIn('results', response.data)

    def test_document_retrieve(self):
        response = self.client.get(f'{self.url}{self.document.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.document.name)
        self.assertEqual(response.data['id'], self.document.id)
        self.assertEqual(response.data['content'], self.document.content)

    def test_delete_document(self):
        response = self.client.get(f'{self.url}{self.document.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.delete(f'{self.url}{self.document.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
