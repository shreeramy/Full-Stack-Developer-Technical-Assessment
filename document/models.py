from django.db import models


class Documents(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    size = models.PositiveIntegerField()
