from neo4j import GraphDatabase

import os
uri = "bolt://localhost:7687"
neo4j_password = os.getenv("NEO4J_PASSWORD", "your_password_here")
driver = GraphDatabase.driver(uri, auth=("neo4j", neo4j_password))

def delete_empty_nodes():
    with driver.session() as session:
        result = session.run("MATCH (n) WHERE n.name = '' OR n.name IS NULL OR n.name = ' ' DETACH DELETE n RETURN count(n) as deleted")
        for record in result:
            print(f"Deleted {record['deleted']} empty nodes.")

delete_empty_nodes()
driver.close()
