from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .forms import LoginForm, RegistrationForm


def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/mywallet')
    return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': LoginForm})


def registration(request):
    form = RegistrationForm(request.POST or None)
    if form.is_valid():
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        User.objects.create_user(username, email, password)
        return HttpResponseRedirect('/')
    return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': LoginForm})


def authentication(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/mywallet')
        else:
            # NEED: Return a 'disabled account' error message
            return HttpResponseRedirect('/')
    else:
        # NEED: Return an 'invalid login' error message.
        return HttpResponseRedirect('/')

