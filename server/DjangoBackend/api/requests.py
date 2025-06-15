import requests
import json
from django.conf import settings
from typing import Dict, Optional, Tuple


def validate_credentials(platform: str, credentials: Dict) -> Tuple[bool, str]:
    """
    Validate social media credentials.
    
    Args:
        platform: Platform name (twitter, instagram)
        credentials: Dictionary containing credentials
        
    Returns:
        Tuple of (is_valid: bool, error_message: str)
    """
    if platform == 'twitter':
        required_fields = ['api_key', 'api_secret', 'access_token', 'access_token_secret']
    elif platform == 'instagram':
        required_fields = ['access_token']
    else:
        return False, f"Unsupported platform: {platform}"
        
    missing_fields = [field for field in required_fields if field not in credentials]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
        
    return True, ""


def post_to_twitter(credentials: Dict, message: str) -> Dict:
    """
    Post message to Twitter.
    
    Args:
        credentials: Dictionary containing Twitter credentials
        message: Message to post
        
    Returns:
        Dictionary containing response data
    """
    try:
        is_valid, error = validate_credentials('twitter', credentials)
        if not is_valid:
            return {'success': False, 'error': error}

        url = "https://api.twitter.com/2/tweets"
        headers = {
            "Authorization": f"Bearer {credentials['access_token']}",
            "Content-Type": "application/json"
        }
        payload = {"text": message}
        
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 201:
            return {
                'success': True,
                'post_id': response.json().get('data', {}).get('id'),
                'message': 'Posted successfully'
            }
        else:
            error_data = response.json().get('errors', [{}])[0]
            return {
                'success': False,
                'error': error_data.get('detail') or f"Twitter API Error: {response.status_code}"
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def post_to_instagram(credentials: Dict, media_path: str, caption: str) -> Dict:
    """
    Post media to Instagram.
    
    Args:
        credentials: Dictionary containing Instagram credentials
        media_path: Path to local media file
        caption: Post caption
        
    Returns:
        Dictionary containing response data
    """
    try:
        is_valid, error = validate_credentials('instagram', credentials)
        if not is_valid:
            return {'success': False, 'error': error}

        # First, create the media
        create_url = f"https://graph.facebook.com/v18.0/{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media"
        headers = {
            "Authorization": f"Bearer {credentials['access_token']}",
            "Content-Type": "application/json"
        }
        
        # Upload media file
        with open(media_path, 'rb') as media_file:
            files = {
                'image_file': media_file
            }
            data = {
                'caption': caption,
                'access_token': credentials['access_token']
            }
            create_response = requests.post(create_url, headers=headers, files=files, data=data)
            
        if create_response.status_code != 200:
            error_data = create_response.json().get('error', {})
            return {
                'success': False,
                'error': error_data.get('message') or 'Failed to create media'
            }
            
        media_id = create_response.json().get('id')
        if not media_id:
            return {
                'success': False,
                'error': 'Failed to get media ID'
            }
            
        # Publish the media
        publish_url = f"https://graph.facebook.com/v18.0/{media_id}/publish"
        publish_response = requests.post(publish_url, headers=headers)
        
        if publish_response.status_code == 200:
            return {
                'success': True,
                'post_id': media_id,
                'message': 'Posted successfully'
            }
        else:
            error_data = publish_response.json().get('error', {})
            return {
                'success': False,
                'error': error_data.get('message') or 'Failed to publish media'
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def post_to_social_media(platform: str, credentials: Dict, content: str, media_path: Optional[str] = None) -> Dict:
    """
    Post content to social media platform.
    
    Args:
        platform: Platform name (twitter, instagram)
        credentials: Dictionary containing platform credentials
        content: Content to post
        media_path: Optional path to media file (required for Instagram)
        
    Returns:
        Dictionary containing response data
    """
    if platform.lower() == 'twitter':
        return post_to_twitter(credentials, content)
    elif platform.lower() == 'instagram':
        if not media_path:
            return {'success': False, 'error': 'Media path is required for Instagram posts'}
        return post_to_instagram(credentials, media_path, content)
    else:
        return {'success': False, 'error': f'Unsupported platform: {platform}'}


if __name__ == "__main__":
    # Example usage (remove before deployment)
    # These should be loaded from environment variables or settings in production
    twitter_credentials = {
        'api_key': settings.TWITTER_API_KEY,
        'api_secret': settings.TWITTER_API_SECRET,
        'access_token': settings.TWITTER_ACCESS_TOKEN,
        'access_token_secret': settings.TWITTER_ACCESS_SECRET
    }
    
    instagram_credentials = {
        'access_token': settings.INSTAGRAM_ACCESS_TOKEN
    }
    
    message = "Automating social media posts with Python! #Python #Automation"
    media_path = "path/to/your/image.jpg"
    caption = "Automating Instagram posts with Python! #Python #Automation"
    
    # Post to Twitter
    twitter_response = post_to_social_media('twitter', twitter_credentials, message)
    print("Twitter Response:", twitter_response)
    
    # Post to Instagram
    instagram_response = post_to_social_media('instagram', instagram_credentials, caption, media_path)
    print("Instagram Response:", instagram_response)
