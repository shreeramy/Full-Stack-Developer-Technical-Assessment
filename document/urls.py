from .views import DocumentManagementViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    'documents',
    DocumentManagementViewset,
    basename="manage_document"
)

urlpatterns = router.urls
