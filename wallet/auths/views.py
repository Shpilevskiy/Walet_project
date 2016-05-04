from django.shortcuts import render
from .forms import LoginForm, RegistrationForm


def index(request):
    return render(request, 'auths/index.html', {'RegForm': RegistrationForm, 'LoginForm': LoginForm})
