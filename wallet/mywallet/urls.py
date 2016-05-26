from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.mywallet, name="mywallet"),
    url(r'^logout/', views.log_out, name="log out"),
    url(r'^addwallet/', views.add_wallet, name="add wallet"),
    url(r'^add-new-currency/', views.add_new_currency, name='add new currency'),
    url(r'^add-new-operation/', views.add_new_operation, name='add new operation'),
    url(r'^get-codes-by-wallet-title/', views.return_codes_by_wallet_title, name="return code by wallet title"),
    url(r'^get-wallets-titles/', views.get_wallets_titles, name="get wallets-titles"),
    url(r'^get-all-wallets/', views.get_all_wallets, name="get all wallets"),
    url(r'^edit-wallet-title/', views.edit_wallet_title, name="Editing wallet title")
]