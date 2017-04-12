from django.contrib.auth.models import User
#from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from accounts.models import Account
from datasets.models import Dataset
from datasets.models import Keyword

from main.views import keyword_list

class KeywordModelTests(TestCase):
    def setUp(self):

        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds2 = Dataset.objects.create(
           account=self.a1,
           author="zmtdummy",
           title="Password Protected Dataset",
           description="Just a page that requires login and password info",
           url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
               "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
               "password_protected_dataset.json",
           dataset_user="zmtdummy",
           dataset_password="zmtBremen1991",
           public_access=False)

    def test_that_keyword_can_be_created(self):
        kw1 = Keyword.objects.create(keyword="biology")
        self.assertEqual(kw1, Keyword.objects.get(keyword="biology"))

    def test_that_keyword_can_be_associated_with_dataset(self):
        kw1 = Keyword.objects.create(keyword="biology")
        kw1.datasets.add(self.ds1)
        kw1.save()

        self.assertEqual(kw1.datasets.all().first(), self.ds1)

    def test_that_keyword_can_be_associated_with_multiple_datasets(self):
        kw1 = Keyword.objects.create(keyword="biology") 
        kw1.datasets.add(self.ds1, self.ds2)
        kw1.save()

        self.assertEqual(len(kw1.datasets.all()), 2)

    def test_that_dataset_can_be_associated_with_multiple_keywords(self):
        kw1 = Keyword.objects.create(keyword="biology")
        kw1.datasets.add(self.ds1)
        kw1.save()
        kw2 = Keyword.objects.create(keyword="chemistry")
        kw2.datasets.add(self.ds1)
        kw2.save()

        self.assertEqual(len(self.ds1.keyword_set.all()), 2)

    def test_keywords_must_be_unique(self):
        with self.assertRaises(IntegrityError):
            kw1 = Keyword.objects.create(keyword="biology")
            kw1.datasets.add(self.ds1)
            kw1.save()
            kw2 = Keyword.objects.create(keyword="biology")
            kw2.datasets.add(self.ds1)
            kw2.save()


class KeywordViewTests(TestCase):

    def setUp(self):

        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds2 = Dataset.objects.create(
           account=self.a1,
           author="zmtdummy",
           title="Password Protected Dataset",
           description="Just a page that requires login and password info",
           url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
               "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
               "password_protected_dataset.json",
           dataset_user="zmtdummy",
           dataset_password="zmtBremen1991",
           public_access=False)


