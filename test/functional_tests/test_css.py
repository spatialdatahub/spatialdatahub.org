from selenium import webdriver

from accounts.models import Account
from datasets.models import Dataset

from django.contrib.staticfiles.testing import StaticLiveServerTestCase

"""
I am going to set this up to run through the tests with chrome, then to run
through the tests with firefox. If it's running with chrome I have to use the
.close() call for tear down, but if it's firefox I have to use the .quit() call
for tear down.
"""


class BrowserSizeChangerTests(StaticLiveServerTestCase):
    """
    This class will be set up to go through all the web pages and make sure
    that the css classes encourage the correct sizes.
    """

    def setUp(self):
        self.browser = webdriver.Chrome()

        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

    def tearDown(self):
        self.browser.quit()

    def test_PORTAL_page_has_correct_bootstrap_grid_setup(self):
        """

        This probably needs to all be updated
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3
         sidebar-offcanvas" id="sidebar">
        <div class="col-12 col-xs-12 col-sm-6 col-md-8 col-lg-9" role="main">

        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """
        self.browser.get(self.live_server_url)
        sidebar = self.browser.find_element_by_id('sidebar')
        main_map = self.browser.find_element_by_id('main_map')

        # extra small
        self.browser.set_window_size(540, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            525,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.location['x'] + main_map.size['width'],
            525,
            delta=10
        )

        # small
        self.browser.set_window_size(560, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            540,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            540,
            delta=10
        )

        # medium
        self.browser.set_window_size(780, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            260,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            515,
            delta=10
        )

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            325,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            650,
            delta=10
        )

    def test_dataset_DETAIL_page_has_correct_bootstrap_grid_setup(self):
        """
        <div class="col-12 col-xs-12" role="main" id="meta_data">
        <div class="col-12 col-xs-12" role="main" id="main_map">

        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """
        slugslugpk = ('/{account_slug}/{dataset_slug}/{pk}/'.format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk))

        self.browser.get('%s%s' % (self.live_server_url, slugslugpk))
        meta_data = self.browser.find_element_by_id('meta_data')
        main_map = self.browser.find_element_by_id('main_map')

        # extra small
        self.browser.set_window_size(540, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            530,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.location['x'] + main_map.size['width'],
            530,
            delta=10
        )

        # small
        self.browser.set_window_size(560, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            540,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            540,
            delta=10
        )

        # medium
        self.browser.set_window_size(780, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            760,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            760,
            delta=10
        )

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            990,
            delta=10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            990,
            delta=10
        )

    def test_dataset_CONFIRM_REMOVE_page_has_correct_bootstrap_grid(self):
        """
        This one does not have any break points, so I will only test it at two
        sizes.

        <div class="col-12 col-xs-12 text-xs-center" id="confirm_remove_form">
        <div class="col-12 col-xs-12 text-xs-center" role="main"
         id="main_map">
        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """

        slugslugpk = ('/{account_slug}/{dataset_slug}/{pk}/'.format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk))

        self.browser.get('%s%s%s' % (self.live_server_url,
                                     slugslugpk, 'remove'))
        confirm_remove_form = self.browser.find_element_by_id(
            'confirm_remove_form')
#        main_map = self.browser.find_element_by_id('main_map')

        # extra small
        self.browser.set_window_size(540, 700)
        self.assertAlmostEqual(
            confirm_remove_form.size['width'],
            515,
            delta=10
        )
#        self.assertAlmostEqual(
#            main_map.size['width'],
#            495,
#            delta = 10
#        )

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            confirm_remove_form.size['width'],
            970,
            delta=5
        )
#            self.assertAlmostEqual(
#                main_map.size['width'],
#                960,
#                delta = 5
#            )

    def test_dataset_CREATE_page_has_correct_bootstrap_grid_setup(self):
        """
        This one does not have any break points, so I will only test it at two
        sizes.
        # <div class="col-12 col-xs-3 sidebar" id="dataset_create_form">
        # <div class="col-12 col-xs-9" role="main" id="main_map">
        # extra small / small break at 544 -> test at 540 and 560
        # small / medium break at 768 -> test at 780
        # medium / large break at 992 -> test at 1000
        """

        slug = ('/{account_slug}'.format(
            account_slug=self.a1.account_slug))

        self.browser.get('%s%s%s' % (
            self.live_server_url, slug, '/new_dataset/'))
        confirm_remove_form = self.browser.find_element_by_id(
            'dataset_create_form')

        # extra small
        self.browser.set_window_size(540, 700)
        self.assertAlmostEqual(
            confirm_remove_form.size['width'],
            500,
            delta=5)

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            confirm_remove_form.size['width'],
            955,
            delta=5)

    def test_dataset_UPDATE_page_has_correct_bootstrap_grid_setup(self):
        """
        This one does not have any break points, so I will only test it at two
        sizes.

        <div class="col-12 col-xs-12" id="update_dataset_form">
        <div class="col-12 col-xs-12" role="main" id="main_map">

        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """

        slugslugpk = ('/{account_slug}/{dataset_slug}/{pk}/'.format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk))

        self.browser.get('%s%s%s' % (
            self.live_server_url, slugslugpk, 'update'))
        update_dataset_form = self.browser.find_element_by_id(
            'update_dataset_form')
        # extra small
        self.browser.set_window_size(540, 700)
        self.assertAlmostEqual(
            update_dataset_form.size['width'],
            495,
            delta=5)

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            update_dataset_form.size['width'],
            955,
            delta=5
        )


'''
class DatasetCreateViewMiscCSS(CssBaseLiveTest):

    def test_dataset_create_view_Submit_button_is_green_and_bold(self):
        for browser in self.browsers:
            browser.get('{localhost}/{new_dataset}'.format(localhost=self.live_server_url,
                                                           new_dataset='new_dataset'))

            submit_button = browser.find_element_by_id('submit_dataset')
            submit_button_class = submit_button.get_attribute('class')
            self.assertEqual(submit_button_class, 'btn btn-success')


class DatasetUpdateViewMiscCSS(CssBaseLiveTest):

    def test_dataset_update_view_Submit_button_is_green_and_bold(self):
        for browser in self.browsers:
            browser.get('{localhost}/{slug}-{pk}/update/'.format(
                localhost=self.live_server_url,
                slug=self.ds1.slug,
                pk=self.ds1.pk))
            submit_button = browser.find_element_by_id('submit_dataset')
            submit_button_class = submit_button.get_attribute('class')
            self.assertEqual(submit_button_class, 'btn btn-success')



class DatasetDetailViewMiscCSS(CssBaseLiveTest):

    def test_dataset_create_view_Submit_button_is_green_and_bold(self):
        for browser in self.browsers:
            browser.get('{localhost}/{new_dataset}'.format(
                localhost=self.live_server_url,
                new_dataset='new_dataset'))

            submit_button = browser.find_element_by_id('submit_dataset')
            submit_button_class = submit_button.get_attribute('class')
            self.assertEqual(submit_button_class, 'btn btn-success')
'''
