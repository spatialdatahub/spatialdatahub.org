from .base import BaseDatasetTest

from datasets.views import load_dataset

class LoadDatasetViewTests(BaseDatasetTest):

    """
    The test client returns an HttpResponse object that is actually not the
    same as the HttpRequest response object.
    The only reason to use the test client would be to use the other
    arguements, such as content, context, json, etc.
    """

    def test_load_dataset_returns_status_code_200(self):
        test_url = '/load_dataset/{pk}/'.format(pk=self.ds2.pk)
        response = self.client.get(test_url)
        self.assertEqual(200, response.status_code)

    def test_load_dataset_returns_status_code_200_PASSWORD_PROTECTED(self):
        test_url = '/load_dataset/{pk}/'.format(pk=self.ds3.pk)
        response = self.client.get(test_url)
        self.assertEqual(200, response.status_code)

    def test_load_dataset_returns_content(self):
        test_url = '/load_dataset/{pk}/'.format(pk=self.ds2.pk)
        response = self.client.get(test_url)
        self.assertIn(b'properties', response.content)

    def test_load_dataset_returns_content_PASSWORD_PROTECTED(self):
        test_url = '/load_dataset/{pk}/'.format(pk=self.ds3.pk)
        print('for some reason this is not returning content during the test, but it works in production')
        print('I think it has something to do with the time it takes for the data to be recieved')
        response = self.client.get(test_url)
        self.assertIn(b'properties', response.content)
