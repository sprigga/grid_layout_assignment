# models.py
from django.db import models
from django.contrib.auth.models import User

class LayoutVersion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='layout_versions')
    version_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.version_name:  # 如果沒有設定名稱
            # 獲取該使用者最後一個版本號碼
            last_version = LayoutVersion.objects.filter(user=self.user).order_by('-version_name').first()
            if last_version and last_version.version_name.startswith('layout-'):
                try:
                    # 從最後一個版本提取數字並加1
                    last_number = int(last_version.version_name.split('-')[1])
                    self.version_name = f'layout-{last_number + 1}'
                except (IndexError, ValueError):
                    self.version_name = 'layout-0'
            else:
                # 如果沒有之前的版本或格式不正確，從0開始
                self.version_name = 'layout-0'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Layout {self.id} - {self.user.username} - {self.created_at}"

class Grid(models.Model):
    layout_version = models.ForeignKey(LayoutVersion, on_delete=models.CASCADE, related_name='grids')
    name = models.CharField(max_length=100, blank=True)
    x_position = models.FloatField()
    y_position = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Grid {self.id} in Layout {self.layout_version.id}: ({self.x_position}, {self.y_position}) - {self.width}x{self.height}"