from .base import BaseDatasetTest

from datasets.views import DatasetUpdateView
from datasets.forms import DatasetForm


class DatasetUpdateViewTests(BaseDatasetTest):

    def test_DatasetUpdateView_url_resolves_to_DatasetUpdateView(self):
        request = self.factory.get('')
        response = DatasetUpdateView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_DatasetUpdateView_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | Update %s</title>' % self.ds1.title, response.content.decode('utf-8'))

    def test_DatasetUpdateView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response, template_name="datasets/dataset_update.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_that_DatasetUpdateView_brings_in_correct_dataset_object(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])

    def test_that_DatasetUpdateView_uses_DatasetForm(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIsInstance(response.context['form'], DatasetForm)

