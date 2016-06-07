from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import unittest

class BaseLiveTest(StaticLiveServerTestCase):

    @classmethod
    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    @classmethod
    def tearDown(self):
        self.browser.quit()

class NewVisitorTest(BaseLiveTest):

    def test_can_find_correct_web_page(self):
        # Micky has heard about a great website that will show all 
        # of GIS data in tropical locations, so she goes to the
        # website to check and see if it is true.
        self.browser.get(self.live_server_url)

        # Micky notices that the main page title and the header both
        # mention the ZMT and wonders what it is.
        self.assertIn('ZMT', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('Leibniz Zentrum für Marine Tropenökologie', header_text)

    def test_can_display_map_data(self):
        pass

    def test_can_clear_map_data(self):
        pass

    def test_can_query_datasets(self):
        pass

    # DatasetForm page tests
class DatasetFormPageTests(BaseLiveTest):
    """
    This set of test will test whether (1) a dataset can be entered and saved from
    the create form page, (2) the dataset can be updated, and (3) the dataset can be
    deleted.
    """

    # 1
    def test_can_use_dataset_to_create_form_then_update_dataset_then_delete_it(self):

        # Get Homepage URL and check if the data are already there
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('Dum Dum Dataset', page_text)

        # Get URL for form
        self.browser.get('%s%s' % (self.live_server_url,'/new_dataset/'))
        self.browser.implicitly_wait(3)

        # Get form inputs
        author_input =  self.browser.find_element_by_id('id_author')
        title_input = self.browser.find_element_by_id('id_title')
        description_input = self.browser.find_element_by_id('id_description')
        url_input = self.browser.find_element_by_id('id_url')
        submit_button = self.browser.find_element_by_id('submit_dataset')

        # Send inputs information
        author_input.send_keys('Pat')
        title_input.send_keys('Dum Dum Dataset')
        description_input.send_keys('This is a dummy dataset on the zmtdummy github account')
        url_input.send_keys('https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/dumdum.json')

        # Submit data 
        submit_button.click()

        # Check Homepage URL to see that the dataset title is there in the text
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('Dum Dum Dataset', page_text)

        self.browser.get('%s%s' % (self.live_server_url,'/dum-dum-dataset-1/'))

#    def test_can_update_dataset(self):

        # Get Homepage URL and check if the data are already there
#        self.browser.get(self.live_server_url)
#        page_text = self.browser.find_element_by_tag_name('body').text
#        self.assertNotIn('Super Dum Dum Dataset', page_text)

        # Get URL for form update
        self.browser.get('%s%s' % (self.live_server_url,'/dum-dum-dataset-1/update/'))

        """
        For one reason or another the live test server is not finding the update url
        when all the tests are run together, but it is able to find it when only the functinal
        tests are run.
        """

        # Get form inputs
        author_input =  self.browser.find_element_by_id('id_author')
        title_input = self.browser.find_element_by_id('id_title')
        description_input = self.browser.find_element_by_id('id_description')
        url_input = self.browser.find_element_by_id('id_url')
        public_access_input = self.browser.find_element_by_id('id_public_access')
        submit_button = self.browser.find_element_by_id('submit_dataset')

        # Send inputs information
        author_input.send_keys('Rat')
        title_input.send_keys('Super Dum Dum Dataset')
        description_input.send_keys('This is an UPDATED dummy dataset on the zmtdummy github account')
        url_input.send_keys('https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/dumdum.json')
        public_access_input.click()

        # Submit data 
        submit_button.click()

        # Check Homepage URL to see that the dataset title is there in the text
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('Super Dum Dum Dataset', page_text)

#        self.browser.get(self.live_server_url)
#        page_text = self.browser.find_element_by_tag_name('body').text
#        self.assertIn('Rat', page_text)
#        self.assertIn('UPDATED', page_text)

    def test_can_delete_dataset(self):
        pass

