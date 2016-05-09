from django.shortcuts import render, HttpResponseRedirect


def mywallet(request):
    if request.user.is_authenticated():
        return render(request, 'mywallet/mywallet.html')
    return HttpResponseRedirect('/')
