class PropertyStatementPDFDownload(View):
    serializer_class = TenantSerializer
    template_name = 'property/pdf/property-statement.html'

    def get(self, request):
        # Get start_date and end_date from request query parameters
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        # Convert start_date and end_date strings to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

        # Get all tenants
        queryset = Tenant.objects.all()
        response_data = []
        total_amount_paid = 0
        total_category_amounts = {
            'Rent': 0,
            'Water Bill': 0,
            'Deposit Invoices': 0,
            'Other Bills': 0,
            'Amount Due': 0
        }
        total_balance = 0

        for tenant_data in self.get_tenants_data(queryset):
            category_sums = self.calculate_category_sums(
                tenant_data, start_date, end_date)
            balance_carried_forward = self.calculate_balance_carried_forward(
                tenant_data, start_date)
            amount_paid = self.calculate_amount_paid(
                tenant_data, start_date, end_date)
            balance = category_sums['Amount Due'] - amount_paid

            response_data.append({
                'tenant_id': tenant_data['id'],
                'unit': tenant_data['unit'],
                'property_name': tenant_data['property'],
                'phone_number': tenant_data['phone_number'],
                'category_sums': category_sums,
                'total_amount_due': category_sums['Amount Due'],
                'balance_carried_forward': balance_carried_forward,
                'amount_paid': amount_paid,
                'balance': balance
            })

            total_amount_paid += amount_paid
            for category, amount in category_sums.items():
                total_category_amounts[category] += amount
            total_balance += balance

        # Render PDF template with response_data
        html_content = render_to_string(
            self.template_name, {'response_data': response_data, 'total_amount_paid': total_amount_paid, 'total_category_amounts': total_category_amounts, 'total_balance': total_balance})

        # Configure wkhtmltopdf
        config = pdfkit.configuration(
            wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")

        # Generate PDF
        pdf = pdfkit.from_string(html_content, False, configuration=config)

        # Create HTTP response with PDF content
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="property_statement.pdf"'
        return response

    def get_tenants_data(self, queryset):
        serializer = self.serializer_class(queryset, many=True)
        return serializer.data

    def calculate_category_sums(self, tenant_data, start_date, end_date):
        category_sums = {
            'Rent': 0,
            'Water Bill': 0,
            'Deposit Invoices': 0,
            'Other Bills': 0,
            'Amount Due': 0
        }

        invoices = tenant_data.get('invoices', [])

        for invoice in invoices:
            invoice_date_str = invoice.get('invoice_date')
            invoice_date = datetime.strptime(invoice_date_str, '%Y-%m-%d')

            if start_date <= invoice_date <= end_date:
                item_name = invoice.get('item_name')
                amount = Decimal(invoice.get('amount'))

                if item_name == 'rent':
                    category_sums['Rent'] += amount
                elif item_name == 'water':
                    category_sums['Water Bill'] += amount
                elif 'rent_deposit' in item_name.lower():
                    category_sums['Deposit Invoices'] += amount
                else:
                    category_sums['Other Bills'] += amount

                category_sums['Amount Due'] += amount

        return category_sums

    def calculate_balance_carried_forward(self, tenant_data, start_date):
        tenant_statements = tenant_data.get('statements', [])
        filtered_statements = [statement for statement in tenant_statements
                               if datetime.strptime(statement.get('transaction_date'), '%Y-%m-%d') < start_date]

        if filtered_statements:
            latest_statement = max(filtered_statements,
                                   key=lambda x: x.get('transaction_date'))
            running_balance = Decimal(latest_statement.get('running_balance'))
            return max(0, running_balance)
        return 0

    def calculate_amount_paid(self, tenant_data, start_date, end_date):
        tenant_payments = tenant_data.get('payments', [])
        total_amount_paid = sum(Decimal(payment.get('paid_amount')) for payment in tenant_payments
                                if start_date <= datetime.strptime(payment.get('payment_date'), '%Y-%m-%d') <= end_date)
        return total_amount_paid
