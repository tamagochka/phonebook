from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

from .models import Ranks
from .models import Departments
from .models import Abonents


def index(request):
    return render(request, 'main/index.html')


@csrf_exempt
def get_data(request):
    if request.method == 'POST':
        data_get = request.POST.get('get')
        data_search = request.POST.get('search')
        response = {}

        if data_get != None:
            data = list(Abonents.objects.filter(department=data_get).order_by('id').values())
            for item in data:
                item['rank'] = Ranks.objects.get(id=item['rank']).rank
            response['abonents'] = data
            data = list(Departments.objects.filter(parent_id=data_get).order_by('id').values())
            response['departments'] = data

        if data_search != None:
            data = list(Abonents.objects.filter(Q(surname__icontains=data_search) |
                                                Q(name__icontains=data_search) |
                                                Q(patronymic__icontains=data_search) |
                                                Q(extension_number__icontains=data_search) |
                                                Q(landline_number__icontains=data_search)).values())
            branches = []
            for item in data:
                if item:
                    branch = [item['id']]
                    parent = item['department']
                    while parent != 0:
                        branch.append(Departments.objects.get(id=parent).id)
                        # branch.insert(0, Departments.objects.get(id=parent).id)
                        parent = Departments.objects.get(id=parent).parent_id
                    branch.append(0)
                    branches.append(branch)

            tree = {}
            for branch in branches:
                curr_branch = tree
                for node in branch[::-1]:
                    if node not in curr_branch:
                        curr_branch[node] = {}
                    curr_branch = curr_branch[node]

            response['path'] = tree

        json_response = {'response': json.dumps(response)}
        # print(json_response)
        return JsonResponse(json_response, status=200)
    else:
        return JsonResponse({'errors': 'error'}, status=400)

# python ./manage.py runserver 0.0.0.0:8000 - запуск сервера
