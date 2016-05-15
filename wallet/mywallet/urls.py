from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.mywallet, name="mywallet"),
    url(r'^logout/', views.log_out, name="log out"),
    url(r'^addwallet/', views.add_wallet, name="add wallet"),
    url(r'^get-codes-by-wallet-title/', views.return_codes_by_wallet_title, name="return code by wallet title"),
    url(r'^get-wallets-titles/', views.get_wallets_titles, name="get wallets-titles"),
    url(r'^add-operation/', views.add_operation, name="add operation"),
    url(r'^get-all-wallets/', views.get_all_wallets, name="get all wallets")
]