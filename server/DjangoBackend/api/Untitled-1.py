# Twitter API credentials (replace with your own)
API_KEY = 'your-api-key'
API_SECRET_KEY = 'your-api-secret-key'
ACCESS_TOKEN = 'your-access-token'
ACCESS_TOKEN_SECRET = 'your-access-token-secret'
# Authenticate to Twitter
auth = tweepy.OAuth1UserHandler(consumer_key=API_KEY, consumer_secret=API_SECRET_KEY,
                                access_token=ACCESS_TOKEN, access_token_secret=ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)
# Post a tweet
def post_to_twitter(message):
    try:
        api.update_status(message)
        print("Tweet posted successfully!")
    except Exception as e:
        print(f"Error: {e}")
# Example usage