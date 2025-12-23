from backend.app.langchain.vectorstore import get_vectorstore

vs = get_vectorstore()
print(vs._collection.count())