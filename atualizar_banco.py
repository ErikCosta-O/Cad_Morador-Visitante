import sqlite3

def atualizar_banco(caminho_banco, caminho_sql):
    """
    Atualiza o banco de dados SQLite com base em um arquivo SQL.

    :param caminho_banco: Caminho do banco de dados SQLite.
    :param caminho_sql: Caminho do arquivo SQL contendo os comandos.
    """
    try:
        # Conecta ao banco de dados SQLite
        con = sqlite3.connect(caminho_banco)
        cur = con.cursor()

        # Lê o arquivo SQL
        with open(caminho_sql, 'r') as f:
            script_sql = f.read()  # Lê todo o conteúdo do arquivo SQL

        # Divide o script SQL em comandos individuais usando o delimitador ';'
        comandos = script_sql.split(';')
        for comando in comandos:
            comando = comando.strip()  # Remove espaços em branco no início e no final
            if comando:  # Ignora comandos vazios
                try:
                    # Adiciona valores padrão para colunas ausentes na tabela 'tb_cadastro'
                    if "INSERT INTO" in comando and "tb_cadastro" in comando:
                        if comando.count(',') == 4:  # Verifica se apenas 5 valores foram fornecidos
                            comando = comando.replace(')', ', NULL, NULL)')  # Adiciona valores NULL para colunas ausentes
                    cur.execute(comando)  # Executa o comando SQL
                except sqlite3.OperationalError as ex:
                    # Ignora erros relacionados a tabelas já existentes
                    if "already exists" in str(ex):
                        print(f"Aviso: {ex}")  # Exibe um aviso no console
                    else:
                        raise  # Relança outros erros

        # Confirma as alterações no banco de dados
        con.commit()
        print(f"Banco de dados '{caminho_banco}' atualizado com sucesso!")
    except sqlite3.Error as ex:
        # Exibe uma mensagem de erro caso ocorra algum problema com o banco de dados
        print(f"Erro ao atualizar o banco de dados: {ex}")
    finally:
        # Fecha a conexão com o banco de dados, se estiver aberta
        if 'con' in locals() and con:
            con.close()

# Caminhos do banco de dados e do arquivo SQL
caminho_banco = 'cadastro.db'  # Substitua pelo caminho do seu banco de dados
caminho_sql = 'backup_cadastro.sql'  # Substitua pelo caminho do arquivo SQL

# Atualiza o banco de dados usando os caminhos fornecidos
atualizar_banco(caminho_banco, caminho_sql)