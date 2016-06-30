from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from .base import BaseLiveTest

class NewVisitorTest(BaseLiveTest):

    def test_can_find_correct_web_page(self):
        self.browser.get(self.live_server_url)

        self.assertIn('ZMT', self.browser.title)

#        We don't really have a header anymore.
#        header_text = self.browser.find_element_by_tag_name('h1').text
#        self.assertIn('Leibniz Zentrum für Marine Tropenökologie', header_text)

    """
    def test_only_authenticated_users_can_see_secret_datasets(self):
        pass

    def test_can_display_map_data(self):
        pass

    def test_can_clear_map_data(self):
        pass

    def test_can_query_datasets(self):
        pass
    """



class DatasetFormPageTests(BaseLiveTest):
    """
    This set of test will test whether (1) a dataset can be entered and saved from
    the create form page, (2) an existing dataset can be updated, and (3) an existing
    dataset can be deleted.

    Test that (4) datasets that are password protected can be changed to not password
    protected.
    """

    # 1
    def test_can_use_dataset_create_form_to_make_new_dataset(self):

        # Get Homepage URL and check if the data are already there
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('Dum Dum Dataset', page_text)

        # Get URL for form
        self.browser.get('%s%s' % (self.live_server_url,'/new_dataset/'))

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


    # 2
    def test_can_update_existing_dataset(self):

        # Get Homepage URL and check if the data are already there
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('Super Dum Dum Dataset', page_text)

        # Get dummy_dataset slug and pk
        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))

        # Get URL for form update
        self.browser.get('%s%s%s' % (self.live_server_url, slugpk, 'update'))

        # Get form inputs
        author_input =  self.browser.find_element_by_id('id_author')
        title_input = self.browser.find_element_by_id('id_title')
        description_input = self.browser.find_element_by_id('id_description')
        url_input = self.browser.find_element_by_id('id_url')
        public_access_input = self.browser.find_element_by_id('id_public_access')
        submit_button = self.browser.find_element_by_id('submit_dataset')

        # Send inputs information
        author_input.clear()
        author_input.send_keys('Rat')

        title_input.clear()
        title_input.send_keys('Super Dum Dum Dataset')

        description_input.clear()
        description_input.send_keys('This is an UPDATED dummy dataset on the zmtdummy github account')

        url_input.clear()
        url_input.send_keys('https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/dumdum.json')

        # Submit data 
        submit_button.click()

        # The slug should be different so we need to make the slug we search for different
        # It seems like the updated dataset is showing up on the web page, but that it is not
        # actually being saved to the dummy_dataset instance.

        updatedslugpk = ('/super-dum-dum-dataset-%s/' % self.dummy_dataset.pk)
        # Check Homepage URL to see that the dataset title is there in the text
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('Super Dum Dum Dataset', page_text)

        # Check dataset detail url to see that the author and description have been changed.
        self.browser.get('%s%s' % (self.live_server_url, updatedslugpk))
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('Rat', page_text)
        self.assertIn('UPDATED', page_text)


    # 3
    def test_can_delete_dataset(self):

        # Get dummy_dataset slug and pk
        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))
        # Get URL for delete page
        self.browser.get('%s%s%s' % (self.live_server_url, slugpk, 'remove'))

        # Get delete button and click it
        delete_button = self.browser.find_element_by_id('confirm_delete')
        delete_button.click()

        # Check the main page for the dummy dataset, it should be gone
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('dummy dataset', page_text)
        self.assertIn('There are no datasets available', page_text)


    # 4
    def test_can_change_dataset_from_NOT_password_protected_to_password_protected(self):

        # Get dummy_dataset slug and pk
        slugpk = ('/%s-%s/' % (self.dummy_dataset.slug, self.dummy_dataset.pk))
        # Get URL for update page
        self.browser.get('%s%s%s' % (self.live_server_url, slugpk, 'update'))

        # Get dataset_user, dataset_password, and url form inputs

        # Get form inputs
        author_input =  self.browser.find_element_by_id('id_author')
        title_input = self.browser.find_element_by_id('id_title')
        description_input = self.browser.find_element_by_id('id_description')
        public_access_input = self.browser.find_element_by_id('id_public_access')
        url_input = self.browser.find_element_by_id('id_url')
        dataset_user_input = self.browser.find_element_by_id('id_dataset_user')
        dataset_password_input = self.browser.find_element_by_id('id_dataset_password')
        submit_button = self.browser.find_element_by_id('submit_dataset')

        # Send inputs information

        ######## I need to remove this once I find out how to auto populate the
        ######## form fields.

        author_input.clear()
        author_input.send_keys('Rat')

        title_input.clear()
        title_input.send_keys('dummy dataset')

        description_input.clear()
        description_input.send_keys('This is an UPDATED dummy dataset on the zmtdummy github account')

        ######## 
        ######## 

        dataset_user_input.clear()
        dataset_user_input.send_keys('zmtdummy')

        dataset_password_input.clear()
        dataset_password_input.send_keys('zmtBremen1991')

        url_input.clear()
        url_input.send_keys("https://bitbucket.org/zmtdummy/geojsondata/raw/" +
                            "0f318d948d74a67bceb8da5257a97b7df80fd2dd/zmt_polygons.json")

        # Submit data
        submit_button.click()

        # Check the main page for the dummy dataset, it should be gone
        self.browser.get(self.live_server_url)
        self.browser.implicitly_wait(9)

        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('dummy dataset', page_text)

        self.browser.get('%s%s' % (self.live_server_url, slugpk))
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertIn('https://bitbucket.org/zmtdummy/geojsondata/raw/0f318d948d74a67bceb8da5257a97b7df80fd2dd/zmt_polygons.json', page_text)
