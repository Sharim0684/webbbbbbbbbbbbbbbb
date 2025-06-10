import requests
import json

def post_to_twitter(api_key, api_secret, access_token, access_token_secret, message):
    url = "https://api.twitter.com/2/tweets"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {"text": message}
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

def post_to_instagram(access_token, image_url, caption):
    try:
        # First, create a container for the media
        container_url = f"https://graph.facebook.com/v18.0/{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media"
        container_params = {
            "image_url": image_url,
            "caption": caption,
            "access_token": access_token
        }
        container_response = requests.post(container_url, params=container_params)
        container_data = container_response.json()
        
        if 'id' not in container_data:
            return {
                'success': False,
                'error': container_data.get('error', {}).get('message', 'Failed to create media container')
            }
        
        # Then publish the container
        publish_url = f"https://graph.facebook.com/v18.0/{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish"
        publish_params = {
            "creation_id": container_data['id'],
            "access_token": access_token
        }
        publish_response = requests.post(publish_url, params=publish_params)
        publish_data = publish_response.json()
        
        if 'id' in publish_data:
            return {
                'success': True,
                'post_id': publish_data['id'],
                'status': 'Posted successfully'
            }
        else:
            return {
                'success': False,
                'error': publish_data.get('error', {}).get('message', 'Failed to publish media')
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == "__main__":
    twitter_api_key = "YOUR_TWITTER_API_KEY"
    twitter_api_secret = "YOUR_TWITTER_API_SECRET"
    twitter_access_token = "YOUR_TWITTER_ACCESS_TOKEN"
    twitter_access_secret = "YOUR_TWITTER_ACCESS_SECRET"
    
    instagram_access_token = "YOUR_INSTAGRAM_ACCESS_TOKEN"
    
    message = "Automating social media posts with Python! #Python #Automation"
    image_url = "https://your-image-url.com/example.jpg"
    caption = "Automating Instagram posts with Python! #Python #Automation"
    
    # Post to Twitter
    twitter_response = post_to_twitter(twitter_api_key, twitter_api_secret, twitter_access_token, twitter_access_secret, message)
    print("Twitter Response:", twitter_response)
    
    # Post to Instagram
    instagram_response = post_to_instagram(instagram_access_token, image_url, caption)
    print("Instagram Response:", instagram_response)
