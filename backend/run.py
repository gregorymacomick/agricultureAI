import os
from app import create_app, db

# Create the app instance based on the environment variable
config_name = os.getenv('FLASK_ENV', 'default')
app = create_app(config_name)

if __name__ == '__main__':
    with app.app_context():
        # This creates the .db file and tables if they don't exist
        db.create_all()
        print("Database initialized!")
        
    app.run(host='0.0.0.0', port=5000)