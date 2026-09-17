from neo4j import GraphDatabase

import os
uri = 'bolt://localhost:7687'
neo4j_password = os.getenv("NEO4J_PASSWORD", "your_password_here")
driver = GraphDatabase.driver(uri, auth=('neo4j', neo4j_password))

def merge_duplicate_nodes():
    with driver.session() as s:
        # Find all node names
        res = s.run('MATCH (n) WHERE n.name IS NOT NULL RETURN n.name as name, collect(n) as nodes')
        for r in res:
            name = r['name']
            nodes = r['nodes']
            if len(nodes) > 1:
                print(f"Merging {len(nodes)} nodes for '{name}'")
                # We will keep the first node and move all relationships to it, then delete the others.
                # APOC procedure apoc.refactor.mergeNodes is perfect for this, but if not installed, we do it manually.
                s.run('''
                    MATCH (n) WHERE n.name = $name
                    WITH collect(n) as nodes
                    CALL apoc.refactor.mergeNodes(nodes, {properties:"combine", mergeRels:true})
                    YIELD node
                    RETURN node
                ''', name=name)

# If APOC is not installed, we can just do manual cypher:
def manual_merge():
    with driver.session() as s:
        res = s.run('MATCH (n) WHERE NOT "Shloka" in labels(n) AND n.name IS NOT NULL RETURN n.name as name, collect(n) as nodes')
        for r in res:
            name = r['name']
            nodes = r['nodes']
            if len(nodes) > 1:
                print(f"Manually merging {len(nodes)} nodes for '{name}'")
                s.run('''
                    MATCH (n) WHERE NOT 'Shloka' IN labels(n) AND n.name = $name
                    WITH collect(n) as nodes
                    WITH head(nodes) as main_node, tail(nodes) as other_nodes
                    UNWIND other_nodes as other
                    
                    // Copy labels
                    WITH main_node, other, labels(other) as other_labels
                    CALL apoc.create.addLabels(main_node, other_labels) YIELD node AS _
                    
                    // Move incoming relationships
                    WITH main_node, other
                    MATCH (a)-[r]->(other)
                    CALL apoc.refactor.to(r, main_node) YIELD input, output
                    
                    // Move outgoing relationships
                    WITH main_node, other
                    MATCH (other)-[r]->(b)
                    CALL apoc.refactor.from(r, main_node) YIELD input, output
                    
                    // Delete other
                    WITH other
                    DETACH DELETE other
                ''', name=name)

# Actually, the simplest way since it's a small graph and might not have APOC:
def plain_cypher_merge():
    with driver.session() as s:
        res = s.run('MATCH (n) WHERE NOT "Shloka" in labels(n) AND n.name IS NOT NULL RETURN n.name as name, collect(n) as nodes')
        for r in res:
            name = r['name']
            nodes = r['nodes']
            if len(nodes) > 1:
                print(f"Plain Cypher merging '{name}'")
                s.run('''
                    MATCH (n) WHERE NOT 'Shloka' IN labels(n) AND n.name = $name
                    WITH collect(n) as nodes
                    WITH head(nodes) as main_node, tail(nodes) as other_nodes
                    UNWIND other_nodes as other
                    
                    // Move incoming relationships
                    OPTIONAL MATCH (a)-[r_in]->(other)
                    WITH main_node, other, a, r_in
                    CALL {
                        WITH main_node, a, r_in
                        WITH main_node, a, r_in WHERE r_in IS NOT NULL
                        MERGE (a)-[new_r_in:RELATED_TO]->(main_node)
                        // We would need dynamic relationship types here, which is hard in plain Cypher without APOC.
                    }
                ''', name=name)

# Given we might not have APOC, and we only have ~11 duplicates, let's just wipe and rebuild?
# NO, let's just deduplicate edges in the FRONTEND!
