from django.views.generic import TemplateView


class AccountView(TemplateView):
    template_name="accounts/account_view.html"

class James(TemplateView):
    template_name="accounts/james.html"
