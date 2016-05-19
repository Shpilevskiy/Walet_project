from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .forms import LoginForm, RegistrationForm
from django.contrib import messages

def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/mywallet')
    return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': LoginForm, 'mainDisabled': False, 'authDisabled': True, 'regDisabled': True})


def registration(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/mywallet')

    form = RegistrationForm(request.POST or None)
    if form.is_valid():
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        User.objects.create_user(username, email, password)
        messages.success(request, 'Account was successfully created, please, try to Sign in')
        return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': LoginForm,
                                                'mainDisabled': False, 'authDisabled': True, 'regDisabled': True})

    return render(request, 'auths/index.html', {'RegForm': form, 'LoginForm': LoginForm,
                                                'mainDisabled': True, 'authDisabled': True, 'regDisabled': False})


def authentication(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/mywallet')

    form = LoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/mywallet')
    else:
        # NEED: Return an 'invalid login' error message.
        return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': form,
                                                    'mainDisabled': True, 'authDisabled': False, 'regDisabled': True})

