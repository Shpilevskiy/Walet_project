from django import forms
from .models import Wallet
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout
from crispy_forms.bootstrap import Field, FormActions


class AddOperationForm(forms.Form):
    title = forms.CharField(label='Title', required=True)
    sum = forms.FloatField(label='Sum', required=True)
    wallets = forms.ModelChoiceField(label='Wallets', queryset=Wallet.objects.all(), required=True)
    date = forms.DateField(widget=forms.TextInput(attrs={'type': 'date'})
)

    helper = FormHelper()
    helper.form_method = 'POST'
    helper.form_class = 'form-horizontal, form-group'
    helper.form_show_labels = False
    helper.form_action = '/add-operation/'

    helper.layout = Layout(
        Field('title', placeholder='Title', css_class='form-control'),
        Field('sum', placeholder='Sum', css_class='form-control'),
        Field('wallets', css_class='form-control'),
        Field('date', css_class='form-control'),
        # To do: add back to menu button (registration too)
        FormActions(Submit('Add', 'add', css_class='btn, btn-primary'))
    )