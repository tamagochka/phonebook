from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
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
        if data_get != None:
            data = Abonents.objects.filter(department=data_get).order_by('id')
            for i in range(len(data)):
                print((data[i]))

            data = Departments.objects.filter(parent_id=data_get).order_by('id')
            for i in range(len(data)):
                print(data[i])




        if data_search != None:
            print('search')


        # rank = Ranks.objects.order_by('id')[1]
        # print(rank)

        # person = Abonents.objects.order_by('id')[1]
        # print(person)

        # department = Departments.objects.order_by('id')[1]
        # print(department)


        response = {
            'departments': [
                {
                    'title': 'Департамент тучных жоп',
                    'parent_id': '0'
                },
                {
                    'title': 'Отдел по взысканию взысканий',
                    'parent_id': '0'
                }
            ],
            'abonents': [
                {
                    'post': 'повелитель',
                    'surname': 'Писькин',
                    'name': 'Пися',
                    'pathronymic': 'Камушкин',
                    'rank': 'ст. сержант',
                    'extension_number': '555',
                    'landline_number': '10-10-10',
                    'department': '0'
                }
            ]
        }
        # response = {
        #     'answer': 'ololo'
        # }

        json_response = {'response': json.dumps(response)}

        return JsonResponse(json_response, status=200)
    else:
        return JsonResponse({'errors': 'error'}, status=400)
