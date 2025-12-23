from my_langchain.vectorstore import get_vectorstore # Usa il nome della cartella rinominata

# 1. Inizializza il vectorstore
vs = get_vectorstore()

# # 2. Conta i documenti (giusto per conferma)
# count = vs._collection.count()
# print(f"Documenti totali nel DB: {count}")

# 3. Esegui la ricerca
query = "AI"
print(f"Eseguo ricerca per: {query}...")

docs = vs.similarity_search(query, k=1)

# 4. Verifica e stampa i risultati
if docs:
    print("\n--- RISULTATO TROVATO ---")
    print(docs[0].page_content)
    print("-------------------------")
else:
    print("\nNessun risultato trovato. Prova con una parola diversa.")