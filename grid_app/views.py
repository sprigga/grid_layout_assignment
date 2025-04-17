# views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
import json
from .models import Grid, LayoutVersion
from django.contrib.auth.models import User

def grid_editor(request):
    # if not request.user.is_authenticated:
    #     return redirect('login')  # 未登入則跳轉到登入頁面
    return render(request, 'grid_editor.html', {'user': request.user})

@csrf_exempt
@login_required
def save_grid_layout(request):
    if request.method == 'POST':
        try:
            grids_data = json.loads(request.POST.get('grids', '[]'))
            layout_version = LayoutVersion.objects.create(user=request.user)
            for grid_data in grids_data:
                Grid.objects.create(
                    layout_version=layout_version,
                    name=grid_data.get('id', ''),
                    x_position=float(grid_data.get('x', 0)),
                    y_position=float(grid_data.get('y', 0)),
                    width=float(grid_data.get('width', 100)),
                    height=float(grid_data.get('height', 100))
                )
            return JsonResponse({'status': 'success', 'layout_id': layout_version.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@login_required
def get_grid_layout(request):
    if request.method == 'GET':
        layout_id = request.GET.get('layout_id')
        if layout_id:
            grids = Grid.objects.filter(layout_version_id=layout_id, layout_version__user=request.user)
        else:
            try:
                latest_version = LayoutVersion.objects.filter(user=request.user).latest('created_at')
                grids = latest_version.grids.all()
            except LayoutVersion.DoesNotExist:
                grids = []
        grid_list = [{
            'id': grid.name,
            'x': grid.x_position,
            'y': grid.y_position,
            'width': grid.width,
            'height': grid.height
        } for grid in grids]
        return JsonResponse({'status': 'success', 'grids': grid_list})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# @login_required
# def grid_list(request):
#     grids = Grid.objects.filter(layout_version__user=request.user)
#     grid_data = [{
#         'id': grid.id,
#         'name': grid.name,
#         'x': grid.x_position,
#         'y': grid.y_position,
#         'width': grid.width,
#         'height': grid.height,
#         'layout_id': grid.layout_version.id,
#         'created_at': grid.created_at,
#         'updated_at': grid.updated_at
#     } for grid in grids]
#     return render(request, 'grid_list.html', {'grids': grid_data})

@login_required
def layout_versions(request):
    versions = LayoutVersion.objects.filter(user=request.user).order_by('-created_at')
    version_data = []
    for version in versions:
        grids = version.grids.all().order_by('-id')
        grid_data = [{
            'id': grid.id,
            'name': grid.name,
            'x': grid.x_position,
            'y': grid.y_position,
            'width': grid.width,
            'height': grid.height,
            'created_at': grid.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': grid.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        } for grid in grids]
        version_data.append({
            'id': version.id,
            'name': version.version_name,
            'created_at': version.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'grids': grid_data
        })
    return render(request, 'layout_versions.html', {'versions': version_data})

@csrf_exempt
@login_required
def delete_layout_version(request, version_id):
    if request.method == 'POST':
        try:
            version = LayoutVersion.objects.get(id=version_id, user=request.user)
            version.delete()
            return JsonResponse({'status': 'success', 'message': '佈局版本已刪除'})
        except LayoutVersion.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': '佈局版本不存在'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # 註冊後自動登入
            return redirect('grid_editor')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def custom_logout(request):
    if request.user.is_authenticated:
        logout(request)  # 登出使用者
    return render(request, 'grid_editor.html', {'user': request.user})  # 渲染 grid_editor.html