from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse
from .models import Wallet, Currency, AccountStatement
from .forms import AddOperationForm
import simplejson as json
from django.contrib.auth import logout


def mywallet(request):
    if request.user.is_authenticated():
        return render(request, 'mywallet/mywallet.html', {'AddOperationForm': AddOperationForm})
    return HttpResponseRedirect('/')


def log_out(request):
    logout(request)
    return HttpResponseRedirect('/')


def add_transaction(user, currency_type, name, value):
    """Saves all data about transaction"""
    wallet = Wallet(title=name)
    wallet.user = user
    wallet.save()

    statement = AccountStatement(value=value)
    statement.wallet = wallet
    statement.save()

    currency = Currency(code=currency_type)
    currency.value = statement
    currency.save()


def add_wallet(request):
    if request.method == 'POST':
        if request.is_ajax():
            name = request.POST.get('name')
            currency_type = request.POST.get('type')
            value = request.POST.get('sum')

            error_msg = {}
            try:
                float(value)
            except ValueError:
                error_msg['sum'] = 'Currency must be a numeric'

            if len(currency_type) != 3:
                error_msg['type'] = 'Enter correct currency code'

            if name == '':
                error_msg['name'] = 'Title can not be empty'

            if error_msg:
                error_msg['status'] = '400'

            if not error_msg:
                add_transaction(request.user,
                                currency_type,
                                name,
                                value)

                error_msg['status'] = '200'
            return HttpResponse(json.dumps(error_msg),
                                content_type="application/json")

    return render(request, 'mywallet/mywallet.html')


def get_wallets(request):
    if request.method == 'POST':
        if request.is_ajax():
            wallets = Wallet.objects.filter(user=request.user)
            wallets_data = [{'title': item.title} for item in wallets]
            return HttpResponse(json.dumps(wallets_data), content_type="application/json")
    return render(request, 'mywallet/mywallet.html')


def return_codes_by_wallet_title(request):
    if request.method == 'POST':
        if request.is_ajax():
            title = request.POST.get('walletTitle')
            wallet = Wallet.objects.filter(user=request.user, title=title)
            account = AccountStatement.objects.filter(wallet=wallet)
            codes = Currency.objects.filter(value=account)
            codes_data = [{'code': item.code} for item in codes]
            return HttpResponse(json.dumps(codes_data), content_type="application/json")
    return render(request, 'mywallet/mywallet.html')


def add_operation(request):
    form = AddOperationForm(request.POST or None)
