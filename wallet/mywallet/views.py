from django.shortcuts import render, HttpResponseRedirect
from django.contrib.auth import authenticate, logout


def mywallet(request):
    if request.user.is_authenticated():
        return render(request, 'mywallet/mywallet.html')
    return HttpResponseRedirect('/')


def log_out(requset):
    logout(requset)
    return HttpResponseRedirect('/')
