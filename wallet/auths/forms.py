from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout
from crispy_forms.bootstrap import Field, FormActions


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(label="Password", required=True, widget=forms.PasswordInput)

    helper = FormHelper()
    helper.form_method = 'POST'
    helper.layout = Layout(
        Field('email', css_class='form-control'),
        Field('password', css_class='form-control'),
        # To do: add back to menu button
        FormActions(Submit('login', 'Sign in', css_class='btn-primary'))
    )