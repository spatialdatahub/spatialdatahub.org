from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from .base import CssBaseLiveTest

"""
I am going to set this up to run through the tests with chrome, then to run
through the tests with firefox. If it's running with chrome I have to use the
.close() call for tear down, but if it's firefox I have to use the .quit() call
for tear down.
"""





class BrowserSizeChangerTest(CssBaseLiveTest):
    """
    This class will be set up to go through all the web pages and make sure
    that the css classes encourage the correct sizes.
    """

    def test_PORTAL_page_has_correct_bootstrap_grid_setup(self):
        """
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 sidebar-offcanvas" id="sidebar">
        <div class="col-12 col-xs-12 col-sm-6 col-md-8 col-lg-9" role="main">

        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """
        for browser in self.browsers:
            browser.get(self.live_server_url)
            sidebar = browser.find_element_by_id('sidebar')
            main_map = browser.find_element_by_id('main_map')

            # extra small
            browser.set_window_size(540, 700)
            self.assertAlmostEqual(
                sidebar.location['x'] + sidebar.size['width'],
                525,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.location['x'] + main_map.size['width'],
                525,
                delta = 10
            )

            # small
            browser.set_window_size(560, 700)
            self.assertAlmostEqual(
                sidebar.location['x'] + sidebar.size['width'],
                280,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                280,
                delta = 10
            )

            # medium 
            browser.set_window_size(780, 700)
            self.assertAlmostEqual(
                sidebar.location['x'] + sidebar.size['width'],
                260,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                515,
                delta = 10
            )

            # large 
            browser.set_window_size(1000, 700)
            self.assertAlmostEqual(
                sidebar.location['x'] + sidebar.size['width'],
                250,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                745,
                delta = 10
            )

    def test_dataset_DETAIL_page_has_correct_bootstrap_grid_setup(self):
        """
        <div class="col-12 col-xs-12" role="main" id="meta_data">
        <div class="col-12 col-xs-12" role="main" id="main_map">

        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """
        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))

        for browser in self.browsers:
            browser.get('%s%s' % (self.live_server_url, slugpk))
            meta_data = browser.find_element_by_id('meta_data')
            main_map = browser.find_element_by_id('main_map')

            # extra small
            browser.set_window_size(540, 700)
            self.assertAlmostEqual(
                meta_data.location['x'] + meta_data.size['width'],
                530,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.location['x'] + main_map.size['width'],
                530,
                delta = 10
            )

            # small
            browser.set_window_size(560, 700)
            self.assertAlmostEqual(
                meta_data.location['x'] + meta_data.size['width'],
                540,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                540,
                delta = 10
            )

            # medium
            browser.set_window_size(780, 700)
            self.assertAlmostEqual(
                meta_data.location['x'] + meta_data.size['width'],
                760,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                760,
                delta = 10
            )

            # large
            browser.set_window_size(1000, 700)
            self.assertAlmostEqual(
                meta_data.location['x'] + meta_data.size['width'],
                990,
                delta = 10
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                990,
                delta = 10
            )


    def test_dataset_CONFIRM_REMOVE_page_has_correct_bootstrap_grid_setup(self):
        """
        This one does not have any break points, so I will only test it at two
        sizes.

        <div class="col-12 col-xs-12 text-xs-center" id="confirm_remove_form">
        <div class="col-12 col-xs-12 text-xs-center" role="main" id="main_map">
        extra small / small break at 544 -> test at 540 and 560
        small / medium break at 768 -> test at 780
        medium / large break at 992 -> test at 1000
        """


        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))

        for browser in self.browsers:

            browser.get('%s%s%s' % (self.live_server_url, slugpk, 'remove'))
            confirm_remove_form = browser.find_element_by_id('confirm_remove_form')
            confirm_remove_button = browser.find_element_by_id('confirm_remove_button')
#            main_map = browser.find_element_by_id('main_map')

            # extra small
            browser.set_window_size(540, 700)
            self.assertAlmostEqual(
                confirm_remove_form.size['width'],
                540,
                delta = 10
            )
#            self.assertAlmostEqual(
#                main_map.size['width'],
#                495,
#                delta = 10
#            )

            # large
            browser.set_window_size(1000, 700)
            self.assertAlmostEqual(
                confirm_remove_form.size['width'],
                1000,
                delta = 5
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

        for browser in self.browsers:

            browser.get('%s%s' % (self.live_server_url, '/new_dataset'))
            confirm_remove_form = browser.find_element_by_id('dataset_create_form')

            # extra small
            browser.set_window_size(540, 700)
            self.assertAlmostEqual(
            confirm_remove_form.size['width'],
            520,
            delta = 5
            )

            # large
            browser.set_window_size(1000, 700)
            self.assertAlmostEqual(
                confirm_remove_form.size['width'],
                980,
                delta = 5
            )


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



        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))


        for browser in self.browsers:

            browser.get('%s%s%s' % (self.live_server_url, slugpk, 'update'))
            update_dataset_form = browser.find_element_by_id('update_dataset_form')
            main_map = browser.find_element_by_id('main_map')
            main_map = browser.find_element_by_id('main_map')
            # extra small
            browser.set_window_size(540, 700)
            self.assertAlmostEqual(
                update_dataset_form.size['width'],
                520,
                delta = 5
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                520,
                delta =5
            )

            # large
            browser.set_window_size(1000, 700)
            self.assertAlmostEqual(
                update_dataset_form.size['width'],
                980,
                delta = 5
            )
            self.assertAlmostEqual(
                main_map.size['width'],
                980,
                delta = 5
            )
    """
    def test_CONTACT_page_has_correct_bootstrap_grid_setup(self):
        pass

    def test_ABOUT_page_has_correct_bootstrap_grid_setup(self):
        pass
    """

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
            browser.get('{localhost}/{slug}-{pk}/update/'.format(localhost=self.live_server_url,
                                                                 slug=self.dummy_dataset.slug,
                                                                 pk=self.dummy_dataset.pk))
            submit_button = browser.find_element_by_id('submit_dataset')
            submit_button_class = submit_button.get_attribute('class')
            self.assertEqual(submit_button_class, 'btn btn-success')



'''
class DatasetDetailViewMiscCSS(CssBaseLiveTest):

    def test_dataset_create_view_Submit_button_is_green_and_bold(self):
        for browser in self.browsers:
            browser.get('{localhost}/{new_dataset}'.format(localhost=self.live_server_url,
                                                           new_dataset='new_dataset'))

            submit_button = browser.find_element_by_id('submit_dataset')
            submit_button_class = submit_button.get_attribute('class')
            self.assertEqual(submit_button_class, 'btn btn-success')
'''

