from .base import BaseDatasetTest

from datasets.views import DatasetCreateView
from datasets.forms import DatasetForm


class DatasetCreateViewTests(BaseDatasetTest):

    def test_DatasetCreateView_url_resolves_to_DatasetCreateView(self):
        request = self.factory.get('')
        response = DatasetCreateView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_DatasetCreateView_uses_correct_template(self):
        response = self.client.get('/new_dataset/')
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_create.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_dataset_DatasetCreateView_url_title_is_correct(self):
        response = self.client.get('/new_dataset/')
        self.assertIn('<title>ZMT | Add Dataset</title>', response.content.decode('utf-8'))

    def test_DatasetCreateView_uses_DatasetForm(self):
        response = self.client.get('/new_dataset/')
        self.assertIsInstance(response.context['form'], DatasetForm)
