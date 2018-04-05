from django.test import TestCase

from keywords.forms import KeywordCreateForm


class KeywordCreateFormTest(TestCase):

    def test_KeywordCreateForm_allows_blank_items(self):
        form = KeywordCreateForm(data={"keyword": ""})
        self.assertTrue(form.is_valid())
