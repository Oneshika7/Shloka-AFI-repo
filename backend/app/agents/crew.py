# Main CrewAI orchestration for SHLOKA-AFI
from crewai import Crew
from .agents import (
    sanskrit_parser_agent,
    entity_hunter_agent,
    relationship_mapper_agent,
    ontology_mapper_agent,
    validator_agent
)
from .tasks import (
    parse_sanskrit_task,
    extract_entities_task,
    map_relationships_task,
    map_to_ontology_task,
    validate_output_task
)

class ShlokaAfiCrew:
    def __init__(self, shloka_text):
        self.shloka_text = shloka_text
        self.crew = None
        self.setup_crew()

    def setup_crew(self):
        # Assign agents to tasks
        parse_sanskrit_task.agent = sanskrit_parser_agent
        extract_entities_task.agent = entity_hunter_agent
        map_relationships_task.agent = relationship_mapper_agent
        map_to_ontology_task.agent = ontology_mapper_agent
        validate_output_task.agent = validator_agent

        # Create the crew
        self.crew = Crew(
            agents=[
                sanskrit_parser_agent,
                entity_hunter_agent,
                relationship_mapper_agent,
                ontology_mapper_agent,
                validator_agent
            ],
            tasks=[
                parse_sanskrit_task,
                extract_entities_task,
                map_relationships_task,
                map_to_ontology_task,
                validate_output_task
            ],
            process=Process.sequential,
            verbose=2
        )

    def run(self):
        # Run the crew
        result = self.crew.kickoff()
        return result