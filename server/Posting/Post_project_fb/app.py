from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse, RedirectResponse
# Removed unnecessary Flask import
from fastapi.middleware.cors import CORSMiddleware
from requests import request
import uvicorn
import os
from utils import exchange_code_for_token, post_to_facebook, post_to_linkedin, exchange_linkedin_code_for_token, post_to_linkedin_with_image  # Fixed import

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_REDIRECT_URI = "http://localhost:8000/linkedin/callback"


@app.get("/")
async def index():
    return JSONResponse(content={"message": "Hello, OAuth2 Social Media Bot!"}, status_code=200)


@app.get("/authorize")
async def authorize():
    """Redirects the user to Facebook's OAuth2.0 authorization URL."""
    auth_url = (
        f"https://www.facebook.com/v18.0/dialog/oauth?"
        f"client_id={FACEBOOK_APP_ID}"
        f"&redirect_uri={FACEBOOK_REDIRECT_URI}"
        f"&scope=pages_show_list,pages_read_engagement,pages_manage_posts,public_profile"
        f"&response_type=code"
    )
    return RedirectResponse(auth_url)


@app.get("/oauth_callback")
async def oauth_callback(code: str = Query(...)):
    """Handles OAuth callback by exchanging the code for an access token."""
    token_data = exchange_code_for_token(code)
    if "access_token" in token_data:
        return JSONResponse(content={"status": "success", "message": "Access token obtained"})
    else:
        return JSONResponse(content={"status": "error", "message": token_data}, status_code=400)


@app.get("/linkedin/authorize")
async def linkedin_authorize():
    """Redirects the user to LinkedIn's OAuth2.0 authorization URL."""
    auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization?"
        f"response_type=code&client_id={LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={LINKEDIN_REDIRECT_URI}"
        f"&scope=openid%20profile%20w_member_social%20email"  # Updated scopes
    )
    return RedirectResponse(auth_url)

@app.get("/linkedin/callback")
async def linkedin_callback(code: str = Query(...)):
    """Handles LinkedIn OAuth callback."""
    token_data = exchange_linkedin_code_for_token(code)  # Updated function name
    if "access_token" in token_data:
        return JSONResponse(content={"status": "success", "message": "LinkedIn access token obtained"})
    else:
        return JSONResponse(content={"status": "error", "message": token_data}, status_code=400)


@app.post("/social")
async def post_to_social_media(request: Request):
    """Post content to social media platforms."""
    try:
        data = await request.json()
        responses = {}
        
        if "facebook" in data and "message" in data["facebook"]:
            responses["facebook"] = post_to_facebook(data["facebook"]["message"])
            
        if "linkedin" in data and "message" in data["linkedin"]:
            responses["linkedin"] = post_to_linkedin(data["linkedin"]["message"])

        return JSONResponse(content=responses, status_code=200)

    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


# FILEPATH: c:/Users/Dell/Documents/Webappp/Web-application/server/Posting/Post_project_fb/app.py

# ... existing code ...

@app.post("/post_to_linkedin_with_image")
async def post_to_linkedin_with_image_route(request: Request):
    """Route to post a message with an image to LinkedIn."""
    data = await request.json()
    message = data.get("message")
    image_path = data.get("image_path")

    if not message or not image_path:
        return JSONResponse(content={"status": "error", "message": "Missing message or image path"}, status_code=400)

    result = post_to_linkedin_with_image(message, image_path)
    return JSONResponse(content=result)

# ... existing code ...