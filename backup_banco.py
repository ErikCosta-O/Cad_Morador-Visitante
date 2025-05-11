import sqlite3
import os

def realizar_backup(caminho_banco, caminho_backup):
    """
    Realiza o backup do banco de dados SQLite.

    :param caminho_banco: Caminho do banco de dados SQLite.
    :param caminho_backup: Caminho onde o arquivo de backup será salvo.
    """
    # Verifica se o arquivo do banco de dados existe
    if not os.path.exists(caminho_banco):
        print(f"Erro: O banco de dados '{caminho_banco}' não foi encontrado.")
        return

    try:
        # Conecta ao banco de dados SQLite
        con = sqlite3.connect(caminho_banco)

        # Cria o arquivo de backup e escreve os comandos SQL para recriar o banco
        with open(caminho_backup, 'w') as f:
            for linha in con.iterdump():  # Itera sobre os comandos SQL do banco
                f.write(f'{linha}\n')  # Escreve cada comando no arquivo de backup

        print(f"Backup realizado com sucesso! Arquivo salvo em: {caminho_backup}")
    except sqlite3.Error as ex:
        # Exibe uma mensagem de erro caso ocorra algum problema com o SQLite
        print(f"Erro ao realizar o backup: {ex}")
    finally:
        # Fecha a conexão com o banco de dados, se estiver aberta
        if 'con' in locals() and con:
            con.close()

# Caminho do banco de dados e do arquivo de backup
caminho_banco = 'cadastro.db'  # Substitua pelo caminho do seu banco de dados
caminho_backup = 'backup_cadastro.sql'  # Nome do arquivo de backup

# Realiza o backup do banco de dados
realizar_backup(caminho_banco, caminho_backup)