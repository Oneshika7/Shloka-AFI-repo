from neo4j import GraphDatabase

import os
uri = 'bolt://localhost:7687'
neo4j_password = os.getenv("NEO4J_PASSWORD", "your_password_here")
driver = GraphDatabase.driver(uri, auth=('neo4j', neo4j_password))

def check_duplicates():
    with driver.session() as s:
        res = s.run('MATCH (n) RETURN n.name as name, id(n) as id, labels(n) as labels')
        nodes = {}
        for r in res:
            name = r['name']
            if not name: continue
            if name not in nodes: nodes[name] = []
            nodes[name].append(r)
            
        dup_count = 0
        for name, arr in nodes.items():
            if len(arr) > 1:
                dup_count += 1
                print(f"Duplicate found: '{name}' has {len(arr)} nodes. Labels: {[x['labels'] for x in arr]}")
                
        print(f"Total distinct names with duplicates: {dup_count}")

def deduplicate_edges():
    with driver.session() as s:
        # Delete duplicate relationships between same source, target, and type
        res = s.run('''
            MATCH (a)-[r]->(b)
            WITH a, b, type(r) AS t, collect(r) AS rels
            WHERE size(rels) > 1
            UNWIND tail(rels) AS rel
            DELETE rel
            RETURN count(rel) as deleted
        ''')
        for r in res:
            print(f"Deleted {r['deleted']} duplicate relationships.")

check_duplicates()
deduplicate_edges()
driver.close()
