from django.core.urlresolvers import resolve
from django.test import TestCase

from portal.views import index


class BaseUrlView(TestCase):
    """
    This class will test that (1) the root url resolves to the correct
    view, (2) that the title on the view is correct, (3) that the correct
    variables are brought into the view and displayed, and more.
    """

    # 1
    def test_base_url_resolves_to_home_page(self):
        found = resolve('/')
        self.assertEqual(found.func, index)

    # 2
    def test_view_title_is_correct(self):
       pass
