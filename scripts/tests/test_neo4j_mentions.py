from neo4j import GraphDatabase

import os
uri = "bolt://localhost:7687"
neo4j_password = os.getenv("NEO4J_PASSWORD", "your_password_here")
driver = GraphDatabase.driver(uri, auth=("neo4j", neo4j_password))

with driver.session() as s:
    res = s.run('MATCH (s:Shloka)-[r:MENTIONS]->(e) RETURN s.id as shloka_id, e.name as entity_name, labels(e) as labels LIMIT 20')
    print("Sample MENTIONS:")
    for r in res:
        print(r['shloka_id'], "->", r['entity_name'], r['labels'])
        
    res2 = s.run('MATCH (s:Shloka) RETURN count(s) as c')
    print("Total Shlokas:", res2.single()['c'])
    
    res3 = s.run('MATCH (s:Shloka)-[r:MENTIONS]->(e) RETURN count(s) as c')
    print("Total MENTIONS:", res3.single()['c'])
    
    res4 = s.run('MATCH (e:Entity) RETURN count(e) as c')
    print("Total Entities:", res4.single()['c'])
