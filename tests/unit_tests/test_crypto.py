from django.test import TestCase
from datasets.models import Dataset
from .base import BaseDatasetTest

from cryptography.fernet import Fernet
import os


class CryptoFieldTests(BaseDatasetTest):
    """
    This is a set of tests that will make sure that the dataset_password and
    dataset_user fields are encrypted

    These all have to be used in conjunction with views, the passwords cannot
    be put into the database directly, otherwise they will not be encrypted.
    """

    def test_that_dataset_password_is_encrypted(self):
        self.assertNotEqual(self.ds3.dataset_password, "zmtBremen1991")

    def test_that_dataset_user_is_encrypted(self):
        self.assertNotEqual(self.ds3.dataset_user, "zmtdummy")

    def test_that_dataset_password_can_be_decrypted(self):
        """
        I am not actually calling the load dataset function anywhere here
        """
        dspw_key = os.environ['CRYPTOKEY_DSPW'].encode('UTF-8')
        f_dspw = Fernet(dspw_key)
        b_pw = (self.ds3.dataset_password).encode('UTF-8')
        decrypted_pw = f_dspw.decrypt(b_pw)
        self.assertEqual(decrypted_pw, b"zmtBremen1991")

    def test_that_dataset_user_can_be_decrypted(self):
        dsu_key = os.environ['CRYPTOKEY_DSU'].encode('UTF-8')
        f_dsu = Fernet(dsu_key)
        b_u = (self.ds3.dataset_user).encode('UTF-8')
        decrypted_u = f_dsu.decrypt(b_u)
        self.assertEqual(decrypted_u, b"zmtdummy")

    def test_that_cryptokeys_are_different(self):
        dspw_key = os.environ['CRYPTOKEY_DSPW'].encode('UTF-8')
        dsu_key = os.environ['CRYPTOKEY_DSU'].encode('UTF-8')
        self.assertNotEqual(dspw_key, dsu_key)
