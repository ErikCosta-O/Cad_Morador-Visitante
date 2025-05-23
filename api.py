from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Função para conectar ao banco de dados
def connect_db():
    return sqlite3.connect('cadastro.db')

# Endpoint para listar todos os cadastros
@app.route('/cadastros', methods=['GET'])
def get_cadastros():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tb_cadastro")
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

# Endpoint para adicionar um novo cadastro
@app.route('/cadastros', methods=['POST'])
def add_cadastro():
    data = request.json
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tb_cadastro (NOME, TELEFONE, EMAIL, TIPO, APARTAMENTO, BLOCO)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (data['NOME'], data['TELEFONE'], data['EMAIL'], data['TIPO'], data['APARTAMENTO'], data['BLOCO']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Cadastro adicionado com sucesso!'}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)