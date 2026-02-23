

# Create your models here.
from django.db import models
from django.utils import timezone




# USER MODEL (Normal User)


class UserMe(models.Model):


    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)  # store hashed
    reward_points = models.IntegerField(default=0)




    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name




#  INSTITUTION (Admin Model)


class Institution(models.Model):


    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=200)  # store hashed


    address = models.TextField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True) 
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True) 

    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name




# QUEUE


class Queue(models.Model):


    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="queues"
    )


    name = models.CharField(max_length=255)
    size = models.IntegerField()


    service_time_minutes = models.IntegerField(default=5)


    is_paused = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)


    allow_swaps = models.BooleanField(default=True)
    max_swaps_per_user = models.IntegerField(default=2)


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name






# TOKEN (Updated with Per-Queue Swap Tracking)


class Token(models.Model):
    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('CALLING', 'Calling'),
        ('COMPLETED', 'Completed'),
        ('SKIPPED', 'Skipped'),
    )


    user = models.ForeignKey(UserMe, on_delete=models.CASCADE, related_name="tokens")
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE, related_name="tokens")


    token_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')


    swaps_used = models.IntegerField(default=0)


    joined_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)


    def is_call_expired(self):
        if not self.called_at:
            return False
        # 60 second window for the "Confirmation Call"
        expiry_time = self.called_at + timezone.timedelta(seconds=60)
        return timezone.now() > expiry_time


    def __str__(self):
        return f"Token {self.token_number} - {self.queue.name}"


    class Meta:
        ordering = ['token_number']




# SWAP REQUEST (The Core of your USP)

from django.db import models
from django.utils import timezone
from datetime import timedelta

class SwapRequest(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    queue = models.ForeignKey(
        Queue,
        on_delete=models.CASCADE,
        related_name="swap_requests"
    )

    sender = models.ForeignKey(
        Token,
        on_delete=models.CASCADE,
        related_name="sent_requests"
    )

    receiver = models.ForeignKey(
        Token,
        on_delete=models.CASCADE,
        related_name="received_requests"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    
    def is_expired(self):
        expiry_time = self.created_at + timedelta(minutes=5)
        return timezone.now() > expiry_time

    def __str__(self):
        return f"Swap [{self.status}]: {self.sender.token_number} <-> {self.receiver.token_number}"

