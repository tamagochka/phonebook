from django.db import models


class Ranks(models.Model):

    class Meta:
        db_table = 'ranks'

    rank = models.CharField('rank', max_length=25)

    def __str__(self):
        return self.rank


class Departments(models.Model):

    class Meta:
        db_table = 'departments'

    title = models.CharField('title', max_length=100)
    parent_id = models.IntegerField('parent_id')

    def __str__(self):
        return self.title


class Abonents(models.Model):

    class Meta:
        db_table = 'abonents'

    post = models.CharField('post', max_length=100)
    surname = models.CharField('surname', max_length=25)
    name = models.CharField('name', max_length=25)
    patronymic = models.CharField('patronymic', max_length=25)
    rank = models.IntegerField('rank')
    extension_number = models.CharField('extension_number', max_length=25)
    landline_number = models.CharField('landline_number', max_length=25)
    department = models.IntegerField('department')

    def __str__(self):
        return self.surname + ' ' + self.name + ' ' + self.patronymic
