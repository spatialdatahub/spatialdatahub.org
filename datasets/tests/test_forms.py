from django.test import TestCase


from datasets.forms import DatasetForm
from datasets.models import Dataset


class DatasetFormTest(TestCase):
    """
    Test (1) that all the required fields return an error if
    they are left blank.

    Test that (2) when valid data are submitted via the form that they
    can in fact be saved as a dataset object, and retrieved from the
    list of dataset objects.

    The third test is an extension of the second, it simply tests (3) whether
    valid password protected datasets can be saved to the dataset.

    Test that (4) valid data with incorrect information (ie url that passes, but
    actually codes for a broken link) is somehow stopped.
    """


    # 1
    def test_form_rejects_blank_data(self):
        """
        I honestly don't remember writing this set of tests, but it
        actually seems good for checking that the form does the right
        thing if it's empty.

        It starts by (1) setting up a set of empty inputs, then it checks
        (2) that the form is not valid, then it goes through each field
        and checks (3) that each required field returns an error.
        """
        # 1
        form = DatasetForm(data={'author': '', 'title': '', 'description': '',
                                 'url': ''})
        # 2
        self.assertFalse(form.is_valid())

        # 3
        self.assertEqual(
            form.errors['author'],
            ["This field is required."]
        )

        self.assertEqual(
            form.errors['title'],
            ["This field is required."]
        )

        self.assertEqual(
            form.errors['description'],
            ["This field is required."]
        )

        self.assertEqual(
            form.errors['url'],
            ["This field is required."]
        )


    # 2 
    def test_form_saved_dataset_is_retreivable_from_database(self):
        # Get dataset info to save
        form_data ={'author': 'Johan Sundström',
                    'title':'world.geo.json',
                    'description':"To mock something fast and",
                    'url':'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'}
        form = DatasetForm(data=form_data)
        # Save the dataset
        self.assert_(form.is_valid())
        self.assertEqual(form.instance.author, 'Johan Sundström')

        form.save()

        # Check that the dataset has been added to the database
        d1 = Dataset.objects.get(title='world.geo.json')
        self.assertEqual(form.instance.title, d1.title)

    # 3
    def test_form_can_save_password_protected_dataset(self):
        form_data = {'author':"zmtdummy",
                     'title':"ZMT GeoJSON Polygon",
                     'description':"Polygons spelling 'ZMT' over " +
                                 "the location of the ZMT",
                     'url':"https://bitbucket.org/zmtdummy/geojsondata" +
                         "/raw/0f318d948d74a67bceb8da5257a97b7df80fd2dd" +
                         "/zmt_polygons.json",
                     'dataset_user':"zmtdummy",
                     'dataset_password':"zmtBremen1991"}
        form = DatasetForm(data=form_data)
        # Save the dataset
        self.assert_(form.is_valid())
        self.assertEqual(form.instance.author, 'zmtdummy')

        form.save()

        # Check that the dataset has been added to the database
        d1 = Dataset.objects.get(title='ZMT GeoJSON Polygon')
        self.assertEqual(form.instance.title, d1.title)


    # 4
    # I need to write some tests for broken stuff. For instance, if the 
    # Url or Password or Username are incorrect but pass the '.is_valid()'
    # test.
