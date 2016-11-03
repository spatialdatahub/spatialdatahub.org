from .base import BaseDatasetTest

from datasets.views import DatasetRemoveView


class DatasetRemoveViewTests(BaseDatasetTest):

    def test_DatasetRemoveView_url_resolves_to_DatasetRemoveView(self):
        request = self.factory.get('')
        response = DatasetRemoveView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_DatasetRemoveView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_remove.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetRemoveView_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | Remove Dataset</title>', response.content.decode('utf-8'))

    def test_that_DatasetRemoveView_brings_in_correct_dataset_object(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])
