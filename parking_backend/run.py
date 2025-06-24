from app import create_app as create_app_from_app

create_app = create_app_from_app()

if __name__ == "__main__":
    create_app.run(debug=True)
