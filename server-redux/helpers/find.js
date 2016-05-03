export function findEntryById(list, id) {
  const entry = list.findEntry(item => item.get('id') === id);
  return entry || null;
}
