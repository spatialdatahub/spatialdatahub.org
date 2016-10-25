from selenium import webdriver

firefox = webdriver.Firefox()
firefox.get('http://localhost:8000')
assert 'ZMT' in firefox.title

chrome = webdriver.Chrome()
chrome.get('http://localhost:8000')
assert 'ZMT' in chrome.title
