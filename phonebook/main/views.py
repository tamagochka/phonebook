from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import Ranks
from .models import Departments
from .models import Abonents

def index(request):
    return render(request, 'main/index.html')


@csrf_exempt
def get_data(request):
    if request.method == 'POST':
        data = request.POST.get('req')
        print(data)

        # rank = Ranks.objects.order_by('id')[1]
        # print(rank)

        person = Abonents.objects.order_by('id')[1]
        print(person)

        response = {
            'answer': 'test',
            # 'rank': ranks.g
        }
        return JsonResponse(response, status=200)
    else:
        return JsonResponse({'errors': 'error'}, status=400)
