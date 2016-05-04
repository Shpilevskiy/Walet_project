from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout
from crispy_forms.bootstrap import Field, FormActions
from django.contrib.auth.models import User


class LoginForm(forms.Form):
    username = forms.CharField(label='Username', required=True)
    password = forms.CharField(label='Password', required=True, widget=forms.PasswordInput)

    helper = FormHelper()
    helper.form_method = 'POST'
    helper.form_class = 'form-group'
    helper.form_show_labels = False
    helper.form_action = '/authentication/'
    helper.layout = Layout(
        Field('username', placeholder='Username', css_class='form-control'),
        Field('password', placeholder='Password', css_class='form-control'),
        # To do: add back to menu button (registration too)
        FormActions(Submit('login', 'Sign in', css_class='btn-primary'))
    )


class RegistrationForm(forms.Form):
    username = forms.CharField(label='Username', required=True)
    email = forms.EmailField()
    password = forms.CharField(label='Password', required=True, widget=forms.PasswordInput)

    helper = FormHelper()
    helper.form_method = 'POST'
    helper.form_show_labels = False
    helper.form_action = '/registration/'
    helper.layout = Layout(
        Field('username', placeholder='Username', css_class='form-control'),
        Field('email', placeholder='Email (example@gmail.com)', css_class='form-control'),
        Field('password', placeholder='Password', css_class='form-control'),
        FormActions(Submit('sign up', 'Sign up', css_class='btn-primary'))
    )
