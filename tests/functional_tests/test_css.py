from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from .base import BaseLiveTest


class BrowserSizeChangerTest(BaseLiveTest):
    """
    This class will be set up to go through all the web pages and make sure
    that the css classes encourage the correct sizes.
    """

    def test_PORTAL_page_has_correct_bootstrap_grid_setup(self):
        self.browser.get(self.live_server_url)
        sidebar = self.browser.find_element_by_id('sidebar')
        main_map = self.browser.find_element_by_id('main_map')

        # <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 sidebar-offcanvas" id="sidebar">
        # <div class="col-12 col-xs-12 col-sm-6 col-md-8 col-lg-9" role="main">

        # extra small / small break at 544 -> test at 540 and 560
        # small / medium break at 768 -> test at 780
        # medium / large break at 992 -> test at 1000

        # extra small
        self.browser.set_window_size(540, 700)
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
        self.browser.set_window_size(560, 700)
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
        self.browser.set_window_size(780, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            260,
            delta = 10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            525,
            delta = 10
        )

        # large 
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            sidebar.location['x'] + sidebar.size['width'],
            250,
            delta = 10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            750,
            delta = 10
        )

    def test_dataset_DETAIL_page_has_correct_bootstrap_grid_setup(self):

        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))

        self.browser.get('%s%s' % (self.live_server_url, slugpk))
        meta_data= self.browser.find_element_by_id('meta_data')
        main_map = self.browser.find_element_by_id('main_map')

        # <div class="col-12 col-xs-12 col-sm-6 col-md-4" role="main" id="meta_data">
        # <div class="col-12 col-xs-12 col-sm-6 col-md-8" role="main" id="main_map">

        # extra small / small break at 544 -> test at 540 and 560
        # small / medium break at 768 -> test at 780
        # medium / large break at 992 -> test at 1000

        # extra small
        self.browser.set_window_size(540, 700)
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
        self.browser.set_window_size(560, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            280,
            delta = 10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            280,
            delta = 10
        )

        # medium
        self.browser.set_window_size(780, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            260,
            delta = 10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            510,
            delta = 10
        )

        # large
        self.browser.set_window_size(1000, 700)
        self.assertAlmostEqual(
            meta_data.location['x'] + meta_data.size['width'],
            330,
            delta = 10
        )
        self.assertAlmostEqual(
            main_map.size['width'],
            660,
            delta = 10
        )


    def test_dataset_CONFIRM_REMOVE_page_has_correct_bootstrap_grid_setup(self):
        pass

    def test_dataset_CREATE_page_has_correct_bootstrap_grid_setup(self):
        pass

    def test_dataset_UPDATE_page_has_correct_bootstrap_grid_setup(self):
        pass

    def test_CONTACT_page_has_correct_bootstrap_grid_setup(self):
        pass

    def test_ABOUT_page_has_correct_bootstrap_grid_setup(self):
        pass

