import requests

def test_facebook_token():
    access_token = "EACPakZBS9OCcBOxYjQiPIaSKcdZCUUw4ueWBkchu7arDcUceu5NjKKPi6ePZADTSBfI1GhbSsMC6K3OFn829hPZAOtCDl3MBZBoUUk3tTmNoShlNQ1JsI8A4rSF0JfNb0iN92iAiC91M2aKhdO9OVr9Pu1oElU05EOxbT7yEZBE9OSejyzzzGHxLXZAM6ksWZA3C"
    
    # First, verify the token
    print("\nVerifying token...")
    verify_url = "https://graph.facebook.com/v18.0/me"
    verify_response = requests.get(
        verify_url,
        params={
            'access_token': access_token,
            'fields': 'id,name'
        }
    )
    
    if verify_response.status_code == 200:
        user_info = verify_response.json()
        print(f"Token valid for user: {user_info.get('name')} (ID: {user_info.get('id')})")
        
        # Get list of pages you manage
        print("\nFetching your Facebook pages...")
        pages_url = "https://graph.facebook.com/v18.0/me/accounts"
        pages_response = requests.get(
            pages_url,
            params={
                'access_token': access_token,
                'fields': 'name,id,access_token'
            }
        )
        
        if pages_response.status_code == 200:
            pages = pages_response.json().get('data', [])
            if pages:
                # Use the first page
                page = pages[0]
                page_id = page['id']
                page_access_token = page['access_token']
                print(f"Using page: {page['name']} (ID: {page_id})")
                
                # Post to the page
                print("\nPosting to the page...")
                post_url = f"https://graph.facebook.com/v18.0/{page_id}/feed"
                post_data = {
                    'message': 'Test post from Python script',
                    'access_token': page_access_token
                }
                
                post_response = requests.post(post_url, data=post_data)
                
                if post_response.status_code == 200:
                    result = post_response.json()
                    print("Post successful!")
                    print(f"Post ID: {result.get('id')}")
                else:
                    print("Post failed:")
                    error = post_response.json().get('error', {})
                    print(f"Error code: {error.get('code')}")
                    print(f"Error type: {error.get('type')}")
                    print(f"Message: {error.get('message')}")
            else:
                print("No pages found. Please make sure you have admin access to at least one Facebook page.")
        else:
            print("Failed to fetch pages:")
            error = pages_response.json().get('error', {})
            print(f"Error code: {error.get('code')}")
            print(f"Error type: {error.get('type')}")
            print(f"Message: {error.get('message')}")
            
        # Get debug info
        debug_url = "https://graph.facebook.com/debug_token"
        debug_response = requests.get(
            debug_url,
            params={
                'input_token': access_token,
                'access_token': access_token
            }
        )
        if debug_response.status_code == 200:
            debug_info = debug_response.json().get('data', {})
            print("\nToken debug info:")
            print(f"Valid: {debug_info.get('is_valid')}")
            print(f"App ID: {debug_info.get('app_id')}")
            print(f"Scopes: {', '.join(debug_info.get('scopes', []))}")
    else:
        print("Token verification failed:")
        print(verify_response.json())

if __name__ == "__main__":
    test_facebook_token()