from django.urls import path
from .views import (
    InvoiceListCreateAPIView, InvoiceRetrieveUpdateDestroyAPIView,
    InvoiceItemListCreateAPIView, InvoiceItemRetrieveUpdateDestroyAPIView,
    PaymentListCreateAPIView, PaymentRetrieveUpdateDestroyAPIView,
    ExpenseListCreateView, ExpenseRetrieveUpdateDestroyView,
    TenantStatementListAPIView
)

urlpatterns = [
    # invoices urls
    path('invoices/', InvoiceListCreateAPIView.as_view(), name='invoice-list'),
    path('invoices/<int:pk>/',
         InvoiceRetrieveUpdateDestroyAPIView.as_view(), name='invoice-detail'),

    # invoice items urls
    path('invoice-items/', InvoiceItemListCreateAPIView.as_view(),
         name='invoice-item-list'),
    path('invoice-items/<int:pk>/',
         InvoiceItemRetrieveUpdateDestroyAPIView.as_view(), name='invoice-item-detail'),


    # payment urls
    path('payments/', PaymentListCreateAPIView.as_view(),
         name='payment-list-create'),
    path('payments/<int:pk>/',
         PaymentRetrieveUpdateDestroyAPIView.as_view(), name='payment-detail'),

    path('tenant-statements/', TenantStatementListAPIView.as_view(),
         name='tenant-statements-list'),


    # expenses urls
    # List and create expenses
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseRetrieveUpdateDestroyView.as_view(),
         name='expense-detail'),

]
