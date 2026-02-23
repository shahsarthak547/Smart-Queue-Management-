from django.contrib import admin

# Register your models here.




# Register your models here.
from django.contrib import admin
from .models import UserMe, Institution, Queue, Token


# Registering models the quick way
admin.site.register(UserMe)
admin.site.register(Institution)
admin.site.register(Queue)
admin.site.register(Token)


