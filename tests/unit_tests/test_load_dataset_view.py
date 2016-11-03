from .base import BaseDatasetTest

from datasets.views import load_dataset

from cryptography.fernet import Fernet
import os


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

        cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
        cryptokey_fernet = Fernet(cryptokey)

        password_bytes = (self.ds3.dataset_password).encode('UTF-8')
        password_decrypted_bytes = cryptokey_fernet.decrypt(password_bytes)
        password_decrypted_string = password_decrypted_bytes.decode('UTF-8')

        user_bytes = (self.ds3.dataset_user).encode('UTF-8')
        user_decrypted_bytes = cryptokey_fernet.decrypt(user_bytes)
        user_decrypted_string = user_decrypted_bytes.decode('UTF-8')

        print('''the methods for encrypting and decrypting work, but i cant get
any content from the page for one reason or another''')
        print(self.ds3.dataset_password)
        print(self.ds3.dataset_user)
        print(password_decrypted_string)
        print(user_decrypted_string)

        response = self.client.get(test_url)
        self.assertIn(b'properties', response.content)
