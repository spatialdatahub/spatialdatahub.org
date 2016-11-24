from django.test import TestCase, Client
from django.core.urlresolvers import reverse


class AboutViewTests(TestCase):

    def test_AboutView_url_resolves(self):
        response = self.client.get("/about/")
        self.assertEqual(response.status_code, 200)

    def test_AboutView_uses_correct_template(self):
        response = self.client.get(reverse("about"))
        self.assertTemplateUsed(response,
            template_name="about.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_AboutView_url_title_is_correct(self):
        response = self.client.get(reverse("about"))
        self.assertIn("<title>ZMT | About</title>", response.content.decode("utf-8"))


class ContactViewTests(TestCase):

    def test_ContactView_url_resolves(self):
        response = self.client.get("/contact/")
        self.assertEqual(response.status_code, 200)

    def test_ContactView_uses_correct_template(self):
        response = self.client.get(reverse("contact"))
        self.assertTemplateUsed(response,
            template_name="contact.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_ContactView_url_title_is_correct(self):
        response = self.client.get(reverse("contact"))
        self.assertIn("<title>ZMT | Contact</title>", response.content.decode("utf-8"))
