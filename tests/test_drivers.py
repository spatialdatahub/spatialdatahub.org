from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase



class FirefoxDriverTester(StaticLiveServerTestCase):

    def setUp(self):
        self.firefox = webdriver.Firefox()

    def tearDown(self):
        self.firefox.quit()

    def test_firefox(self):
        self.firefox.get(self.live_server_url)




'''
class BaseDriverTester(StaticLiveServerTestCase):

    @classmethod
    def setUp(self):

#        self.firefox = webdriver.Firefox()
        self.chrome = webdriver.Chrome()
#        self.browsers = [self.firefox, self.chrome]

#    @classmethod
#    def tearDown(self):
#        for browser in self.browsers:
#            if browser == self.chrome:
#                self.browser.quit()
#            elif browser == self.chrome:
#                browser.close()

    @classmethod
    def tearDown(self):
        self.chrome.quit()





class DriverTest(BaseDriverTester):

    def test_chrome(self):
        self.chrome.get(self.live_server_url)

#    def test_firefox(self):
#        self.firefox.get(self.live_server_url)


#    def test_drivers(self):
#        for browser in self.browsers:
#            browser.get(self.live_server_url)
'''
