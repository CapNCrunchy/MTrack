import MySQLdb
import string
import random
db = MySQLdb.connect(host='Mtracker.mysql.pythonanywhere-services.com', 
                     password='Group007', 
                     database='Mtracker$default')

def random_id():
    res = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=10))
    return str(res)

def generate_id(cursor, name_id, name_table):
    new_id = (random_id(),)
    str_ex = 'SELECT * FROM {0} WHERE {1} =%s'.format(name_table, name_id)
    cursor.execute(str_ex, new_id)
    while len(cursor.fetchall()) > 0:
        new_id = (random_id(),)
        cursor.execute(str_ex, new_id)
    return new_id

def insert_appointment(user_id, date, address, doctor_name, purpose):
    cursor = db.cursor()
    appointment_id = generate_id(cursor, name_id='appointment_id', name_table='appointments')
    str_ex = 'INSERT INTO appointments (user_id, appointment_id, date, address, doctor_name, purpose) VALUES (%s, %s, %s, %s, %s, %s)'
    vals = (user_id, appointment_id, date, address, doctor_name, purpose)
    cursor.execute(str_ex, vals)
    db.commit()
    return appointment_id

