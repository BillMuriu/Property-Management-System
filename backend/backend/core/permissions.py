from rest_framework.permissions import BasePermission
from .models import PropertyManager


class IsAdminUser(BasePermission):
    """
    Custom permission to only allow admin users.
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            try:
                property_manager = PropertyManager.objects.get(
                    user=request.user)
                return property_manager.roles == 'admin'
            except PropertyManager.DoesNotExist:
                return False
        return False


class IsViewerUser(BasePermission):
    """
    Custom permission to only allow viewer users.
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            try:
                property_manager = PropertyManager.objects.get(
                    user=request.user)
                return property_manager.roles == 'viewer'
            except PropertyManager.DoesNotExist:
                return False
        return False


class IsEditorUser(BasePermission):
    """
    Custom permission to only allow editor users.
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            try:
                property_manager = PropertyManager.objects.get(
                    user=request.user)
                return property_manager.roles == 'editor'
            except PropertyManager.DoesNotExist:
                return False
        return False
