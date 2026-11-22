from neo4j import GraphDatabase

import logging

import os

from typing import List, Dict, Any

from datetime import datetime



logger = logging.getLogger(__name__)



NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")

NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")

NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "your_password_here")



class GraphService:

    def __init__(self):

        self.driver = None

        self._connect()



    def _connect(self):

        try:

            self.driver = GraphDatabase.driver(

                NEO4J_URI,

                auth=(NEO4J_USER, NEO4J_PASSWORD)

            )

            self.driver.verify_connectivity()

            logger.info("Neo4j connected successfully")

        except Exception as e:

            logger.error(f"Neo4j connection failed: {e}")

            self.driver = None

    def _node_id(self, name: str) -> str:

        return name.lower().replace(" ", "_")



    def is_available(self) -> bool:
        if self.driver is None:
            self._connect()
        return self.driver is not None



    def write_shloka(self, shloka_id: str, text: str, translation: str, entities: List[Dict], relationships: List[Dict]) -> bool:

        if not self.is_available():

            return False

        try:

            with self.driver.session() as session:

                # Create Shloka node

                session.run("""

                    MERGE (s:Shloka {id: $id})

                    SET s.text = $text,

                        s.translation = $translation,

                        s.created_at = $created_at

                """, id=shloka_id, text=text, translation=translation,

                     created_at=datetime.utcnow().isoformat())



                # Create entity nodes and link to shloka

                for ent in entities:
                    name = ent.get("name")
                    if not name:
                        continue
                    
                    ALLOWED_NODE_LABELS = {"Herb", "Dosha", "Disease", "Action", "Entity", "Symptom", "Formulation", "Dhatu", "Mala", "Rasa", "Virya", "Vipaka", "Prabhava", "Property", "Part", "Preparation", "Treatment", "Therapy", "Diet", "Lifestyle", "Time", "Season", "Place", "Person", "Animal", "Instrument", "Measure", "Concept", "Book", "Author", "God", "Other"}
                    raw_category = str(ent.get("type", "Entity")).strip().capitalize()
                    category = raw_category if raw_category in ALLOWED_NODE_LABELS else "Entity"
                    definition = ent.get("definition", "")
                    confidence = ent.get("confidence", 0.85)
                    props = ent.get("properties", {})
                    
                    # Merge on :Entity to guarantee uniqueness by name, then add specific label
                    session.run(f"""
                        MERGE (e:Entity {{name: $name}})
                        ON CREATE SET e.definition = $definition,
                                      e.dosage = $dosage,
                                      e.intake = $intake,
                                      e.rasa = $rasa,
                                      e.virya = $virya
                        SET e:{category}
                        WITH e
                        MATCH (s:Shloka {{id: $shloka_id}})
                        MERGE (s)-[r:MENTIONS]->(e)
                        SET r.confidence = $confidence
                    """, name=name, definition=definition,
                         dosage=props.get("dosage", ""),
                         intake=props.get("intake", ""),
                         rasa=str(props.get("rasa", "")),
                         virya=props.get("virya", ""),
                         shloka_id=shloka_id, confidence=confidence)

                # Create relationships between entities
                for rel in relationships:
                    source = rel.get("source", "")
                    target = rel.get("target", "")
                    import re
                    ALLOWED_REL_TYPES = {"CURES", "AGGRAVATES", "BALANCES", "RELATED_TO", "CONTAINS", "CAUSES", "PREVENTS", "ALLEVIATES", "INCREASES", "DECREASES", "HAS_PROPERTY", "HAS_PART", "HAS_INGREDIENT", "HAS_ACTION", "HAS_INDICATION", "HAS_CONTRAINDICATION", "HAS_SIDE_EFFECT", "HAS_DOSE", "HAS_VEHICLE", "HAS_TIME", "MENTIONS"}
                    raw_rel = str(rel.get("type", "RELATED_TO")).strip().upper().replace(" ", "_")
                    sanitized_rel = re.sub(r'[^A-Z0-9_]', '', raw_rel)
                    rel_type = sanitized_rel if sanitized_rel in ALLOWED_REL_TYPES else "RELATED_TO"
                    conf = rel.get("confidence", 0.8)

                    session.run(f"""
                        MATCH (a:Entity {{name: $source}})
                        MATCH (b:Entity {{name: $target}})
                        MERGE (a)-[r:{rel_type}]->(b)
                        SET r.confidence = $confidence
                    """, source=source, target=target, confidence=conf)



                logger.info(f"Graph written for shloka {shloka_id}: {len(entities)} entities, {len(relationships)} relationships")

                return True



        except Exception as e:

            logger.error(f"Graph write failed: {e}")

            return False



    def get_shloka_subgraph(self, shloka_id: str) -> Dict:

        if not self.is_available():

            return {"nodes": [], "edges": []}

        try:

            with self.driver.session() as session:

                result = session.run("""

                    MATCH (s:Shloka {id: $id})-[r:MENTIONS]->(e)

                    OPTIONAL MATCH (e)-[rel]->(e2)

                    RETURN s, e, r, rel, e2

                """, id=shloka_id)



                nodes = {}

                edges = []



                for record in result:
                    s = record["s"]
                    entity = record["e"]
                    
                    if s and s["id"] not in nodes:
                        nodes[s["id"]] = {
                            "id": s["id"],
                            "label": s.get("text", "Shloka")[:30] + "...",
                            "type": "Shloka",
                            "properties": {}
                        }
                    
                    if entity and entity["name"] not in nodes:
                        nodes[entity["name"]] = {
                            "id": entity["name"].lower().replace(" ", "_"),
                            "label": entity["name"],
                            "type": list(entity.labels)[0] if entity.labels else "Entity",
                            "properties": dict(entity)
                        }
                        
                    if s and entity and record["r"]:
                        edges.append({
                            "from": s["id"],
                            "to": entity["name"].lower().replace(" ", "_"),
                            "label": "MENTIONS"
                        })

                    if record["e2"] and record["rel"]:
                        e2 = record["e2"]
                        if e2["name"] not in nodes:
                            nodes[e2["name"]] = {
                                "id": e2["name"].lower().replace(" ", "_"),
                                "label": e2["name"],
                                "type": list(e2.labels)[0] if e2.labels else "Entity",
                                "properties": dict(e2)
                            }
                        edges.append({
                            "from": entity["name"].lower().replace(" ", "_"),
                            "to": e2["name"].lower().replace(" ", "_"),
                            "label": type(record["rel"]).__name__
                        })

                return {"nodes": list(nodes.values()), "edges": edges}

        except Exception as e:
            logger.error(f"Subgraph query failed: {e}")
            return {"nodes": [], "edges": []}

    def execute_cypher(self, query: str, parameters: dict = None) -> Dict:
        if not self.is_available():
            return {"nodes": [], "edges": []}
        try:
            with self.driver.session() as session:
                result = session.run(query, parameters or {})
                nodes = {}
                edges = []
                for record in result:
                    # Generic parser for nodes and relationships returned
                    for val in record.values():
                        if hasattr(val, "labels"): # It's a node
                            node_id = str(val.element_id if hasattr(val, "element_id") else val.id)
                            if node_id not in nodes:
                                nodes[node_id] = {
                                    "id": node_id,
                                    "label": val.get("name", str(node_id)),
                                    "type": list(val.labels)[0] if val.labels else "Entity",
                                    "properties": dict(val)
                                }
                        elif hasattr(val, "type"): # It's a relationship
                            edges.append({
                                "from": str(val.start_node.element_id if hasattr(val.start_node, "element_id") else val.start_node.id),
                                "to": str(val.end_node.element_id if hasattr(val.end_node, "element_id") else val.end_node.id),
                                "label": val.type
                            })
                return {"nodes": list(nodes.values()), "edges": edges}
        except Exception as e:
            logger.error(f"Custom Cypher execution failed: {e}")
            return {"error": str(e), "nodes": [], "edges": []}



    def get_full_graph(self) -> Dict:

        if not self.is_available():

            return {"nodes": [], "edges": []}

        try:

            with self.driver.session() as session:

                result = session.run("""
                    MATCH (n)
                    OPTIONAL MATCH (n)-[r]->(m)
                    RETURN n, r, m
                """)

                nodes = {}

                edges = []

                for record in result:

                    n = record["n"]

                    if n and n.id not in nodes:

                        name = n.get("name", str(n.id))

                        node_id = self._node_id(name)
                        nodes[n.id] = {

                            "id": node_id,

                            "label": name,

                            "type": list(n.labels)[0] if n.labels else "Entity",

                            "properties": dict(n)

                        }

                    if record["m"] and record["r"]:

                        m = record["m"]

                        if m.id not in nodes:

                            mname = m.get("name", str(m.id))
                            mid = self._node_id(mname)
                            nodes[m.id] = {

                                "id": mname.lower().replace(" ", "_"),

                                "label": mname,

                                "type": list(m.labels)[0] if m.labels else "Entity",

                                "properties": dict(m)

                            }

                        nname = n.get("name", str(n.id))
                        nid = self._node_id(nname)
                        mname = m.get("name", str(m.id))
                        mid = self._node_id(mname)
                        edges.append({

                            "from": nid,
                            "to": mid,
                            "label": record["r"].type

                        })

                return {"nodes": list(nodes.values()), "edges": edges}

        except Exception as e:

            logger.error(f"Full graph query failed: {e}")

            return {"nodes": [], "edges": []}



    def get_stats(self) -> Dict:

        if not self.is_available():

            return {"total_nodes": 0, "total_relationships": 0, "total_shlokas": 0, "node_types": {}, "relationship_types": {}}

        try:

            with self.driver.session() as session:

                total_nodes = session.run("MATCH (n) RETURN count(n) as c").single()["c"]

                total_rels = session.run("MATCH ()-[r]->() RETURN count(r) as c").single()["c"]

                total_shlokas = session.run("MATCH (s:Shloka) RETURN count(s) as c").single()["c"]

                node_types_result = session.run("MATCH (n) RETURN labels(n)[0] as type, count(n) as cnt")

                node_types = {r["type"]: r["cnt"] for r in node_types_result}

                rel_types_result = session.run("MATCH ()-[r]->() RETURN type(r) as type, count(r) as cnt")

                rel_types = {r["type"]: r["cnt"] for r in rel_types_result}

                return {

                    "total_nodes": total_nodes,

                    "total_relationships": total_rels,

                    "total_shlokas": total_shlokas,

                    "node_types": node_types,

                    "relationship_types": rel_types,

                    "nodes": total_nodes

                }

        except Exception as e:

            logger.error(f"Stats query failed: {e}")

            return {"total_nodes": 0, "total_relationships": 0, "total_shlokas": 0, "node_types": {}, "relationship_types": {}}



    def get_entity(self, name: str) -> Dict:

        if not self.is_available():

            return {}

        try:

            with self.driver.session() as session:

                result = session.run("""

                    MATCH (e {name: $name})

                    OPTIONAL MATCH (e)-[r]->(connected)

                    RETURN e, r, connected

                """, name=name)

                entity_data = None

                connections = []

                for record in result:

                    if not entity_data:

                        e = record["e"]

                        entity_data = {

                            "name": e.get("name", name),

                            "type": list(e.labels)[0] if e.labels else "Entity",

                            "properties": dict(e)

                        }

                    if record["connected"] and record["r"]:

                        connections.append({

                            "node": record["connected"].get("name", ""),

                            "relationship": record["r"].type,

                            "type": list(record["connected"].labels)[0] if record["connected"].labels else "Entity"

                        })

                if entity_data:

                    entity_data["connections"] = connections

                return entity_data or {}

        except Exception as e:

            logger.error(f"Entity query failed: {e}")

            return {}



graph_service = GraphService()