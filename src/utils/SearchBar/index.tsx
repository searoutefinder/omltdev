export function highlightMatch(fullText: string, query: string) {
  if (!query) return fullText;

  //1.both to lowercase for case-insensitive match
  const lowerText = fullText.toLowerCase();
  const lowerQuery = query.toLowerCase();

  //2.find the first occurrence
  const startIndex = lowerText.indexOf(lowerQuery);
  if (startIndex === -1) {
    return fullText; // no match found
  };
  
  //3.calculate end of matched substring
  const endIndex = startIndex + query.length;

  //3.calculate end of matched substring
  const before = fullText.slice(0, startIndex);
  const match = fullText.slice(startIndex, endIndex);
  const after = fullText.slice(endIndex);

  return (
    <>
      {before}
      <strong>{match}</strong>
      {after}
    </>
  );
}
