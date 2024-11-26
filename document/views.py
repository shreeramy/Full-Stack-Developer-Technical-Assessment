from rest_framework import viewsets
from .serializers import DocumentSerializer
from .models import Documents
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters


class DocumentManagementViewset(viewsets.ModelViewSet):
    pagination_class = PageNumberPagination
    serializer_class = DocumentSerializer
    queryset = Documents.objects.all()
    filter_backends = [filters.OrderingFilter,
                       filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
