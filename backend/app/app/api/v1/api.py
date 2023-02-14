from fastapi import APIRouter

from app.api.v1.endpoints import auth, user, post

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"], include_in_schema=False)
api_router.include_router(user.router, prefix="/users", tags=["user"])
api_router.include_router(post.router, prefix="/posts", tags=["post"])
