from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from .forms import *


def index(request):
    form = LoginForm()
    return render(request, 'auths/index.html', {'form': form})
