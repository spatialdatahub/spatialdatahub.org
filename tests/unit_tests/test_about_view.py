from .base import BaseDatasetTest

from datasets.views import AboutView


class AboutViewTests(BaseDatasetTest):

    def test_about_url_resolves_to_AboutView(self):
        request = self.factory.get('')
        response = AboutView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_AboutView_uses_correct_template(self):
        response = self.client.get('/about/')
        self.assertTemplateUsed(response,
            template_name="datasets/about.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_AboutView_url_title_is_correct(self):
        response = self.client.get('/about/')
        self.assertIn('<title>ZMT | About</title>', response.content.decode('utf-8'))
