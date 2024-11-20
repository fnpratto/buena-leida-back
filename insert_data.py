import json
import psycopg2
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración de conexión
connection = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)
cursor = connection.cursor()

# Cargar datos desde el archivo JSON
with open('books.json', 'r') as file:
    data = json.load(file)

# Insertar datos en la tabla "books"
for record in data:
    query = """
        INSERT INTO books (title, author, coverimage, publication_date, genre, summary)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        record["title"],
        record["author"],
        record["coverimage"],
        record["publication_date"],
        record["genre"],
        record["summary"]
    )
    
    cursor.execute(query, values)

# Confirmar la transacción
connection.commit()

# Cerrar la conexión
cursor.close()
connection.close()

print("Datos insertados correctamente en la tabla 'books'.")
