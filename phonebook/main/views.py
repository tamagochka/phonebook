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
        response = {}
        if data_get != None:
            data = list(Abonents.objects.filter(department=data_get).order_by('id').values())
            response['abonents'] = data
            data = list(Departments.objects.filter(parent_id=data_get).order_by('id').values())
            response['departments'] = data

        if data_search != None:
            print('search')

        print(response)

        json_response = {'response': json.dumps(response)}
        print(json_response)
        return JsonResponse(json_response, status=200)
    else:
        return JsonResponse({'errors': 'error'}, status=400)
