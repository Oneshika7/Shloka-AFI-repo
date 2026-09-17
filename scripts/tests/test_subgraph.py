from neo4j import GraphDatabase

uri = 'bolt://localhost:7687'
driver = GraphDatabase.driver(uri, auth=('neo4j', 'ayurveda_admin'))

with driver.session() as s:
    res = s.run('MATCH (s:Shloka)-[r:MENTIONS]->(e) RETURN count(*) as c')
    print("MENTIONS relationships:", res.single()['c'])
    
    res2 = s.run('MATCH (s:Shloka) RETURN count(*) as c')
    print("Shloka nodes:", res2.single()['c'])
    
    res3 = s.run('MATCH (e) WHERE NOT "Shloka" in labels(e) RETURN count(*) as c')
    print("Entity nodes:", res3.single()['c'])
    
    res4 = s.run('MATCH (s:Shloka) RETURN s.id LIMIT 5')
    print("Sample Shloka IDs in Neo4j:")
    for r in res4:
        print(r['s.id'])
