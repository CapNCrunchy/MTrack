# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: /home/Mtracker/./backend.py
# Bytecode version: 3.10.0rc2 (3439)
# Source timestamp: 2024-11-18 01:54:59 UTC (1731894899)

import MySQLdb
import string
import random
db = MySQLdb.connect(host='Mtracker.mysql.pythonanywhere-services.com', password='Group007', database='Mtracker$default')

def print_table(name_table):
    cursor = db.cursor()
    str_ex = 'SELECT * FROM {0}'.format(name_table)
    cursor.execute(str_ex)
    for x in cursor:
        print(x)

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

def insert_vaccination(user_id, name, last_date, next_date):
    cursor = db.cursor()
    vaccination_id = generate_id(cursor, name_id='vaccination_id', name_table='vaccinations')
    str_ex = 'INSERT INTO vaccinations (user_id, vaccination_id, name, date_last, date_next) VALUES (%s, %s, %s, %s, %s)'
    vals = (user_id, vaccination_id, name, last_date, next_date)
    cursor.execute(str_ex, vals)
    db.commit()
    return vaccination_id

def insert_prescription(user_id, name, num_of_doses, size_of_doses, last_date, next_date):
    cursor = db.cursor()
    prescription_id = generate_id(cursor, name_id='prescription_id', name_table='prescriptions')
    str_ex = 'INSERT INTO prescriptions (user_id, prescription_id, name, num_of_doses, size_of_doses, last_date, next_date) VALUES (%s, %s, %s, %s, %s, %s, %s)'
    vals = (user_id, prescription_id, name, num_of_doses, size_of_doses, last_date, next_date)
    cursor.execute(str_ex, vals)
    db.commit()
    return prescription_id

def insert_profile(email, password, f_name, l_name, sex, phone_num, dob):
    cursor = db.cursor()
    user_id = generate_id(cursor, name_id='user_id', name_table='profiles')
    str_ex = 'INSERT INTO profiles (user_id, email, password, first_name, last_name, sex, phone_number, date_of_birth) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'
    vals = (user_id, email, password, f_name, l_name, sex, phone_num, dob)
    cursor.execute(str_ex, vals)
    db.commit()
    return user_id

def insert_schedule_time(prescription_id, weekday, time):
    cursor = db.cursor()
    str_ex = 'INSERT INTO schedule_times (prescription_id, weekday, time) VALUES (%s, %s, %s)'
    vals = (prescription_id, weekday, time)
    cursor.execute(str_ex, vals)
    db.commit()

def update_entry(name_id, name_table, id, name_cols, entries):
    cursor = db.cursor()
    i = 0
    for col in name_cols:
        str_ex = 'UPDATE {0} SET {1} =%s WHERE {2} =%s'.format(name_table, col, name_id)
        vals = (entries[i], id)
        cursor.execute(str_ex, vals)
        i = i + 1
    db.commit()

def delete_entry(name_id, name_table, entry):
    cursor = db.cursor()
    str_ex = 'DELETE FROM {0} WHERE {1} =%s'.format(name_table, name_id)
    cursor.execute(str_ex, (entry,))
    if name_table == 'prescriptions':
        str_ex = 'DELETE FROM schedule_times WHERE {0} =%s'.format(name_id)
        cursor.execute(str_ex, (entry,))
    db.commit()

def delete_profile(user_id):
    cursor = db.cursor()
    str_ex = 'DELETE FROM {0} WHERE user_id =%s'
    cursor.execute(str_ex.format('appointments'), (user_id,))
    cursor.execute(str_ex.format('vaccinations'), (user_id,))
    cursor.execute(str_ex.format('prescriptions'), (user_id,))
    cursor.execute(str_ex.format('schedule_times'), (user_id,))
    cursor.execute(str_ex.format('profiles'), (user_id,))
    db.commit()

def verify_unique(entry, array):
    unique = True
    for i in range(0, len(array)):
        if entry == array[i]:
            unique = False
    return unique

def convert_date(date):
    x = date.split()
    new_date = ''
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    numbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for y in range(0, len(months)):
        if months[y] == x[0]:
            new_date = numbers[y] + '/'
    if new_date != '':
        return new_date
    return date

def search_entry(user_id, search):
    cursor = db.cursor()
    tables = ['appointments', 'prescriptions', 'vaccinations']
    top_entries = ['', '', '', '', '']
    index = 0
    back = [3, 4, 4]
    back_index = 0
    for i in range(0, len(tables)):
        str_ex = 'SHOW COLUMNS FROM {0}'.format(tables[i])
        cursor.execute(str_ex)
        columns = cursor.fetchall()
        for j in range(2, len(columns)):
            col = columns[j][0]
            entry = search + '%'
            str_ex = 'SELECT {0} FROM {1} WHERE user_id = %s AND {2} LIKE %s'.format(columns[1][0], tables[i], col)
            vals = (user_id, entry)
            cursor.execute(str_ex, vals)
            for x in cursor.fetchall():
                if verify_unique(x, top_entries) and index <= 4:
                    top_entries[index] = x
                    index = index + 1
        if index > back[back_index]:
            index = back[back_index]
        back_index = back_index + 1
        continue
    if top_entries[4] == '' and search != convert_date(search):
        new_entries = search_entry(user_id, convert_date(search))
        new_index = 0
        while index < 5 and new_entries[new_index] != '':
            if verify_unique(new_entries[new_index], top_entries):
                top_entries[index] = new_entries[new_index]
            index = index + 1
            new_index = new_index + 1
    return top_entries

def search_user(email, password):
    cursor = db.cursor()
    str_ex = 'SELECT * FROM profiles WHERE email =%s'
    cursor.execute(str_ex, (email,))
    user = cursor.fetchall()
    if len(user) == 0:
        return
    if password != user[0][2]:
        return
    return user[0][0]

def get_user_table(db, user_id, name_table):
    cursor = db.cursor()
    str_ex = 'SELECT * FROM {0} WHERE user_id =%s'.format(name_table)
    cursor.execute(str_ex, (user_id,))
    return cursor.fetchall()

def get_user_database(db, user_id):
    profile = get_user_table(db, user_id, 'profiles')
    appointments = get_user_table(db, user_id, 'appointments')
    prescriptions = get_user_table(db, user_id, 'prescriptions')
    vaccinations = get_user_table(db, user_id, 'vaccinations')
    schedule_times = get_user_table(db, user_id, 'schedule_times')
    return [profile, appointments, prescriptions, vaccinations, schedule_times]

def testing():
    insert_profile(email='example@gmail.com', password='123abc', f_name='John', l_name='Smith', sex='Male', phone_num='123-456-7890', dob='01/01/2001')
    insert_profile(email='example2@gmail.com', password='456def', f_name='Jane', l_name='Smith', sex='F', phone_num='098-765-4321', dob='02/02/2002')
    print('Profile Entries:')
    print_table('profiles')
    user_id1 = search_user('example@gmail.com', '123abc')
    user_id2 = search_user('example2@gmail.com', '456def')
    insert_appointment(user_id=user_id1, date='11/12/2024', address='1234 Example Drive', doctor_name='June Bob', purpose='Consultation')
    insert_vaccination(user_id=user_id1, name='Example Vaccination', last_date='06/12/2024', next_date='12/12/2024')
    insert_prescription(user_id=user_id1, name='Examplevanium', num_of_doses='20', size_of_doses='10', last_date='06/12/2024', next_date='12/12/2024')
    entries = search_entry(user_id1, 'June')
    for i in entries:
        print(i)
    print_table('profiles')
    print_table('appointments')
    print_table('vaccinations')
    print_table('prescriptions')
    delete_profile(user_id1)
    delete_profile(user_id2)
    print('After Deleting')
    print_table('profiles')
testing()