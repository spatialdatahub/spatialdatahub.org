from .base import BaseDatasetTest

from datasets.views import ContactView


class ContactViewTests(BaseDatasetTest):

    def test_ContactView_url_resolves_to_ContactView(self):
        request = self.factory.get('')
        response = ContactView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_ContactView_uses_correct_template(self):
        response = self.client.get('/contact/')
        self.assertTemplateUsed(response,
            template_name="datasets/contact.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_ContactView_url_title_is_correct(self):
        response = self.client.get('/contact/')
        self.assertIn('<title>ZMT | Contact</title>', response.content.decode('utf-8'))
