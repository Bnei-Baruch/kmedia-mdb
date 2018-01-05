SELECT
  cu.id,
  cu.uid,
  cu.type_id,
  array_agg(DISTINCT f.language)
FROM content_units cu INNER JOIN files f ON cu.id = f.content_unit_id AND f.type = 'image'
GROUP BY cu.id
HAVING count(DISTINCT f.language) > 1
ORDER BY cu.created_at DESC;