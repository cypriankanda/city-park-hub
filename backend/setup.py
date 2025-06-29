from setuptools import setup, find_packages

setup(
    name="city_park_hub",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "python-dotenv",
        "passlib",
        "jose",
        "pydantic",
        "alembic",
    ],
)
