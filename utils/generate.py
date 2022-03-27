from faker import Faker
import random
faker = Faker()

def generate_user():
    return f"('{faker.text(50)}', '{faker.email()}', '{faker.first_name()}', '{faker.last_name()}', '{faker.text(50)}', '{random.randint(0, 1000000)}')"

def generate_users(n):
    if n is None:
        n = 10
    sql = 'INSERT INTO Users(user_name, user_email, user_first_name, user_last_name, user_password, user_credits) VALUES '
    sql += generate_user()
    for _ in range(n-1):
        sql += f",{generate_user()}"
    return sql

def generate_service():
    return f"('{faker.text(50)}','{faker.text(250)}', '{faker.random_number()}', '{random.randint(100,199)/100}', '{random.randint(0,100)}', '{random.randint(100,199)/100}', '{random.randint(5,10)}', '{random.randint(1000,1000000)}')"


def generate_services(n):
    if n is None:
        n = 10
    sql = 'INSERT INTO services(service_name, service_description, service_base_price, service_price_modifier, service_base_value, service_value_modifier, service_max_level, service_refresh_value) VALUES '
    sql += generate_service()
    for _ in range(n-1):
        sql += f",{generate_service()}"
    return sql