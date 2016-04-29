from django.shortcuts import render
# It's better to avoid importing things we don't currently need
# Star imports are generally VERY BAD IDEA
# http://docs.quantifiedcode.com/python-code-patterns/maintainability/from_module_import_all_used.html
from .forms import LoginForm


def index(request):
    form = LoginForm()
    return render(request, 'auths/index.html', {'form': form})
