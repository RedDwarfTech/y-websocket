const persistenceDir = process.env.YPERSISTENCE

const getLdbDoc = async (docId) => {
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
  const ldb = new LeveldbPersistence(persistenceDir)
  const persistedYdoc = await ldb.getYDoc(docId)
  let text = persistedYdoc.getText(docId)
  return text
}

module.exports = {
  getLdbDoc
}
