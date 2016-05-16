from django.shortcuts import render, HttpResponseRedirect, RequestContext
from django.http import HttpResponse
from crispy_forms.utils import render_crispy_form
from .models import Wallet, Currency, AccountStatement, DiffOperation
from .forms import AddOperationForm
import simplejson as json
from django.contrib.auth import logout
from datetime import datetime

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render

def mywallet(request):
    if request.user.is_authenticated():
        operation_list = DiffOperation.objects.filter(user=request.user)
        paginator = Paginator(operation_list, 6)

        page = request.GET.get('page')
        try:
             operations = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            operations = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            operations = paginator.page(paginator.num_pages)

        return render(request, 'mywallet/mywallet.html', {'operations': operations})
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


def validate_new_wallet_data(title, code, value, request):
    error_msg = {}
    try:
        float(value)
    except ValueError:
        error_msg['sum'] = 'Currency must be a numeric'

    if len(code) != 3:
        error_msg['type'] = 'Enter correct currency code'

    if title == '':
        error_msg['name'] = 'Title can not be empty'

    if Wallet.objects.filter(user=request.user, title=title):
        error_msg['name'] = 'You are already have this wallet'

    if error_msg:
        error_msg['status'] = '400'

    return error_msg


def add_wallet(request):
    if request.method == 'POST':
        if request.is_ajax():
            name = request.POST.get('name')
            currency_type = request.POST.get('type')
            value = request.POST.get('sum')

            error_msg = validate_new_wallet_data(name, currency_type, value, request)

            if not error_msg:
                add_transaction(request.user,
                                currency_type,
                                name,
                                value)

                error_msg['status'] = '200'
            return HttpResponse(json.dumps(error_msg),
                                content_type="application/json")

    return HttpResponseRedirect('/')


def add_new_operation(request):
    if request.method == 'POST':
        if request.is_ajax():
            operation_type = request.POST.get('type')
            operation_title = request.POST.get('title')
            operation_value = request.POST.get('sum')
            wallet_title = request.POST.get('wallet')
            code = request.POST.get('code')
            date = request.POST.get('date')
            select_value = request.POST.get('select_value')

            error_msg = validate_add_new_operation_data(operation_type, operation_title, operation_value,
                                                        date, request, wallet_title)

            if not error_msg:
                wallet = Wallet.objects.get(user=request.user, title=wallet_title)
                account = AccountStatement.objects.get(wallet=wallet, value=select_value)
                currency = Currency.objects.get(value=account, code=code)

                print(operation_type, operation_title, operation_value, wallet_title, code, date,)
                print("!!!",wallet,"!!",account,"!!",currency)

                new_operation = DiffOperation(title=operation_title, date=date,
                                              sum=operation_value, operation_type=operation_type)
                new_operation.currency = currency
                new_operation.user = request.user
                new_operation.wallet_title = wallet_title
                new_operation.save()
                if operation_type == 'SP':
                    account.value -= float(operation_value)
                else:
                    account.value += float(operation_value)
                account.save()
                error_msg['status'] = '200'

            return HttpResponse(json.dumps(error_msg),
                                content_type="application/json")

    return HttpResponseRedirect('/')


def validate_add_new_operation_data(operation_type, operation_title, operation_value, date, request, wallet_title):
    error_msg = {}

    try:
        float(operation_value)
    except ValueError:
        error_msg['sum'] = 'Currency must be a numeric'

    if operation_title == '':
        error_msg['name'] = 'Title can not be empty'

    if operation_type != 'SP' and operation_type != 'DP':
        error_msg['type'] = 'Wrong type operation'

    try:
        print(date)
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError: #find correct exception
        error_msg['date'] = 'Wrong date'

    wallet = Wallet.objects.filter(user=request.user, title=wallet_title)
    if not wallet:
        error_msg['wallet'] = 'Wrong wallet title'

    return error_msg


def validate_new_currency_data(title, code, value, request):
    error_msg = {}

    try:
        float(value)
    except ValueError:
        error_msg['sum'] = 'Currency must be a numeric'

    if len(code) != 3:
        error_msg['type'] = 'Enter correct currency code'

    wallet = Wallet.objects.filter(user=request.user, title=title)
    accounts = AccountStatement.objects.filter(wallet=wallet)
    for account in accounts:
        if Currency.objects.filter(value=account, code=code):
            error_msg['type'] = 'You are already have this currency'

    if error_msg:
        error_msg['status'] = '400'

    return error_msg


def add_new_currency_transaction(title, code, value, request):
    wallet = Wallet.objects.get(user=request.user, title=title)

    statement = AccountStatement(value=value)
    statement.wallet = wallet
    statement.save()

    currency = Currency(code=code)
    currency.value = statement
    currency.save()


def add_new_currency(request):
    if request.method == 'POST':
        if request.is_ajax():
            title = request.POST.get('title')
            code = request.POST.get('code')
            value = request.POST.get('sum')
            print("!! ", title, "!!", value, "!!", code)

            error_msg = validate_new_currency_data(title, code, value, request)

            if not error_msg:
                add_new_currency_transaction(title, code, value, request)

                error_msg['status'] = '200'

            return HttpResponse(json.dumps(error_msg),
                                content_type="application/json")

    return HttpResponseRedirect('/')


def get_wallets_titles(request):
    if request.method == 'POST':
        if request.is_ajax():
            wallets = Wallet.objects.filter(user=request.user)
            wallets_data = [{'title': item.title} for item in wallets]
            return HttpResponse(json.dumps(wallets_data), content_type="application/json")
    return HttpResponseRedirect('/')


def return_codes_by_wallet_title(request):
    if request.method == 'POST':
        if request.is_ajax():
            title = request.POST.get('walletTitle')
            wallet = Wallet.objects.filter(user=request.user, title=title)
            accounts = AccountStatement.objects.filter(wallet=wallet)
            codes = get_values_dict(accounts)
            return HttpResponse(json.dumps(codes), content_type="application/json")
    return HttpResponseRedirect('/')


def add_operation(request):
    form = AddOperationForm(request.POST or None)
    if form.is_valid():
        form.save()
        return {'success': True}
    else:
        request_context = RequestContext(request)
        form_html = render_crispy_form(form, context=request_context)
        return {'success': False, 'AddOperationForm': form_html}


def get_values_dict(accounts):
    accounts_dict = {}
    for account in accounts:
        code = Currency.objects.filter(value=account)
        for value in code:
            accounts_dict[str(account)] = str(value)
    return accounts_dict


def get_all_wallets(request):
    if request.method == 'POST':
        if request.is_ajax():
            result_dict = {}
            wallets = Wallet.objects.filter(user=request.user)
            for wallet in wallets:
                accounts = AccountStatement.objects.filter(wallet=wallet)
                result_dict[str(wallet)] = get_values_dict(accounts)
            return HttpResponse(json.dumps(result_dict), content_type="application/json")
    return HttpResponseRedirect('/')
