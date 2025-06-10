# Add this line to specify the custom user model
AUTH_USER_MODEL = 'accounts.CustomUser'

# Make sure 'accounts' is in INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',  # Make sure this line exists
    # ... other apps ...
]