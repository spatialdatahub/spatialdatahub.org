from selenium import webdriver
import unittest

class NewVisitorTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()

    def test_can_find_correct_web_page(self):
        # Micky has heard about a great website that will show all 
        # of GIS data in tropical locations, so she goes to the
        # website to check and see if it is true.
        self.browser.get('http://localhost:8000')

        # Micky notices that the main page title and the header both
        # mention the ZMT and wonders what it is.
        self.assertIn('ZMT', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('Leibniz Zentrum für Marine Tropenökologie', header_text)




if __name__ == '__main__':
    unittest.main(warnings='ignore')
