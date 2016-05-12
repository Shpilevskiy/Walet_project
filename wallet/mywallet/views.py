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
                error_msg['type'] = 'Input correct code'

            if name == '':
                error_msg['name'] = 'Title cant be empty'

            if not error_msg:
                wallet = Wallet(title=name)
                wallet.user = request.user
                wallet.save()

                statement = AccountStatement(value=value)
                statement.wallet = wallet
                statement.save()

                currency = Currency(code=currency_type)
                currency.value = statement
                currency.save()
                error_msg['status'] = '200'
                return HttpResponse(json.dumps(error_msg), content_type="application/json")

            error_msg['status'] = '400'
            return HttpResponse(json.dumps(error_msg), content_type="application/json")
    return render(request, 'mywallet/mywallet.html')
