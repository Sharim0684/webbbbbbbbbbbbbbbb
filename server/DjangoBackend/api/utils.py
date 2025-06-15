from datetime import datetime, timedelta
import requests
from django.conf import settings
from .models import SocialMediaCredentials

def get_platform_token(user_id: int, platform: str) -> str:
    """
    Get access token for a specific platform.
    
    Args:
        user_id: User ID
        platform: Platform name ('facebook', 'linkedin', 'instagram')
        
    Returns:
        Access token string or None if not found
    """
    try:
        credentials = SocialMediaCredentials.objects.get(user_id=user_id, platform=platform)
        return credentials.access_token
    except SocialMediaCredentials.DoesNotExist:
        return None

def post_to_facebook(user_id: int, message: str, media_path: str = None) -> tuple[bool, str]:
    """
    Post a message to Facebook page.
    
    Args:
        user_id: User ID
        message: Post content
        media_path: Optional path to media file
        
    Returns:
        Tuple of (success: bool, error_message: str)
    """
    try:
        page_token = get_platform_token(user_id, 'facebook')
        if not page_token:
            return False, "Failed to retrieve Facebook page access token"

        url = f"https://graph.facebook.com/v18.0/{settings.FACEBOOK_PAGE_ID}/feed"
        
        if media_path:
            with open(media_path, 'rb') as media_file:
                files = {'source': media_file}
                data = {
                    'message': message,
                    'access_token': page_token
                }
                response = requests.post(url, files=files, data=data)
        else:
            data = {
                'message': message,
                'access_token': page_token
            }
            response = requests.post(url, data=data)

        if response.status_code == 200:
            return True, ""
        else:
            return False, f"Facebook API Error: {response.text}"
    except Exception as e:
        return False, f"Error posting to Facebook: {str(e)}"

def post_to_linkedin(user_id: int, message: str, media_path: str = None) -> tuple[bool, str]:
    """
    Post a message to LinkedIn.
    
    Args:
        user_id: User ID
        message: Post content
        media_path: Optional path to media file
        
    Returns:
        Tuple of (success: bool, error_message: str)
    """
    try:
        access_token = get_platform_token(user_id, 'linkedin')
        if not access_token:
            return False, "Missing or expired LinkedIn token"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
        }
        
        url = "https://api.linkedin.com/v2/ugcPosts"
        
        if media_path:
            # Handle LinkedIn media upload
            try:
                # Register media upload
                register_url = "https://api.linkedin.com/v2/assets?action=registerUpload"
                register_data = {
                    "registerUploadRequest": {
                        "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                        "owner": f"urn:li:person:{settings.LINKEDIN_USER_ID}",
                        "serviceRelationships": [{
                            "relationshipType": "OWNER",
                            "identifier": "urn:li:userGeneratedContent"
                        }]
                    }
                }
                
                register_response = requests.post(
                    register_url,
                    headers=headers,
                    json=register_data
                )
                
                if register_response.status_code != 200:
                    return False, f"Failed to register LinkedIn media upload: {register_response.text}"
                
                upload_data = register_response.json()
                upload_url = upload_data['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
                asset_urn = upload_data['value']['asset']
                
                # Upload media
                with open(media_path, 'rb') as media_file:
                    media_response = requests.post(
                        upload_url,
                        headers=headers,
                        data=media_file
                    )
                    
                if media_response.status_code != 201:
                    return False, f"Failed to upload media to LinkedIn: {media_response.text}"
                
                # Create post with media
                post_data = {
                    "author": f"urn:li:person:{settings.LINKEDIN_USER_ID}",
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {
                                "text": message
                            },
                            "shareMediaCategory": "IMAGE",
                            "media": [{
                                "status": "READY",
                                "description": {"text": message},
                                "media": asset_urn,
                                "title": {"text": "Post"}
                            }]
                        }
                    },
                    "visibility": {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                    }
                }
            except Exception as e:
                return False, f"Error handling LinkedIn media upload: {str(e)}"
        else:
            # Create text-only post
            post_data = {
                "author": f"urn:li:person:{settings.LINKEDIN_USER_ID}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": message
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
        
        response = requests.post(url, headers=headers, json=post_data)
        
        if response.status_code == 201:
            return True, ""
        else:
            return False, f"LinkedIn API Error: {response.text}"
    except Exception as e:
        return False, f"Error posting to LinkedIn: {str(e)}"

def post_to_instagram(user_id: int, message: str, media_path: str) -> tuple[bool, str]:
    """
    Post a message to Instagram.
    
    Args:
        user_id: User ID
        message: Post content
        media_path: Path to media file (required for Instagram)
        
    Returns:
        Tuple of (success: bool, error_message: str)
    """
    try:
        if not media_path:
            return False, "Media is required for Instagram posts"

        access_token = get_platform_token(user_id, 'instagram')
        if not access_token:
            return False, "Missing or expired Instagram token"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # First create the media container
        create_url = "https://graph.facebook.com/v17.0/me/media"
        create_data = {
            "image_url": media_path,
            "caption": message
        }

        create_response = requests.post(create_url, headers=headers, json=create_data)
        if create_response.status_code != 200:
            return False, f"Failed to create Instagram media: {create_response.text}"

        media_id = create_response.json().get('id')
        if not media_id:
            return False, "Failed to get Instagram media ID"

        # Publish the post
        publish_url = f"https://graph.facebook.com/v17.0/{media_id}/publish"
        publish_response = requests.post(publish_url, headers=headers)

        if publish_response.status_code == 200:
            return True, ""
        else:
            return False, f"Instagram API Error: {publish_response.text}"
    except Exception as e:
        return False, f"Error posting to Instagram: {str(e)}"