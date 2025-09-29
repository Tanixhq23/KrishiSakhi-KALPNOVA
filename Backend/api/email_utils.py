from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_login_notification(user):
    """Sends a login notification email to the user."""
    subject = 'Successful Login to Krishi Sakhi'
    context = {'user': user}
    html_message = render_to_string('login_notification.html', context)
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to = user.email
    send_mail(subject, plain_message, from_email, [to], html_message=html_message)

def send_logout_notification(user):
    """Sends a logout notification email to the user."""
    subject = 'Successful Logout from Krishi Sakhi'
    context = {'user': user}
    html_message = render_to_string('logout_notification.html', context)
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to = user.email
    send_mail(subject, plain_message, from_email, [to], html_message=html_message)

def send_otp_email(user, otp):
    """Sends an OTP email to the user."""
    subject = 'Your OTP for username change'
    message = f'Your OTP is: {otp}'
    from_email = settings.EMAIL_HOST_USER
    to = user.email
    send_mail(subject, message, from_email, [to])
