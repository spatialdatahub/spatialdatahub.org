from .base import BaseDatasetTest

from datasets.views import DatasetDetailView


class DatasetDetailViewTests(BaseDatasetTest):

    def test_DatasetDetailView_url_resolves_to_DatasetDetailView(self):
        request = self.factory.get('')
        response = DatasetDetailView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_DatasetDetailView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_detail.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetDetailView_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | %s</title>' % self.ds1.title, response.content.decode('utf-8'))

    def test_dataset_AUTHOR_is_in_the_page(self):
        url = "/{slug}-{pk}/".format(slug=self.ds2.slug, pk=self.ds2.pk)
        response = self.client.get(url)
        self.assertIn(self.ds2.author, response.content.decode("utf-8"))

    def test_dataset_TITLE_is_in_the_page(self):
        url = "/{slug}-{pk}/".format(slug=self.ds2.slug, pk=self.ds2.pk)
        response = self.client.get(url)
        self.assertIn(self.ds2.title, response.content.decode("utf-8"))

    def test_dataset_DESCRIPTION_is_in_the_page(self):
        url = "/{slug}-{pk}/".format(slug=self.ds2.slug, pk=self.ds2.pk)
        response = self.client.get(url)
        self.assertIn(self.ds2.description, response.content.decode("utf-8"))

    def test_password_protected_dataset_does_not_have_user_password_in_final_stage(self):
        url = "/{slug}-{pk}/".format(slug=self.ds3.slug, pk=self.ds3.pk)
        response = self.client.get(url)
        self.assertNotIn(self.ds3.dataset_password, response.content.decode("utf-8"))
        self.assertNotIn(self.ds3.dataset_password, response.context)

    def test_that_DatasetDetailView_brings_in_correct_dataset_object(self):
        url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])
