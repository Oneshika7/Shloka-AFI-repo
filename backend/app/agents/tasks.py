# Tasks for the SHLOKA-AFI Multi-Agent System
from crewai import Task
from textwrap import dedent

# Define tasks for each agent
parse_sanskrit_task = Task(
    description=dedent('''
        Parse and preprocess the provided Sanskrit shloka text.
        Perform text normalization, sandhi splitting, and initial segmentation.
    '''),
    expected_output=dedent('''
        Normalized Sanskrit text with basic linguistic processing completed.
    '''),
    agent=None  # Will be assigned to specific agent in the crew
)

extract_entities_task = Task(
    description=dedent('''
        Extract Ayurvedic entities (Dravya, Guna, Karma, Dosha, Roga,
        Rasa, Vihara, etc.) from the parsed Sanskrit text.
    '''),
    expected_output=dedent('''
        List of extracted entities with their classifications and attributes.
    '''),
    agent=None
)

map_relationships_task = Task(
    description=dedent('''
        Identify and map relationships between the extracted entities.
    '''),
    expected_output=dedent('''
        Documented relationships between Ayurvedic entities.
    '''),
    agent=None
)

map_to_ontology_task = Task(
    description=dedent('''
        Map the extracted entities and relationships to the AFI ontology.
    '''),
    expected_output=dedent('''
        Entities and relationships mapped to AFI ontology with semantic tagging.
    '''),
    agent=None
)

validate_output_task = Task(
    description=dedent('''
        Validate the extracted entities, relationships, and ontology mappings for accuracy.
    '''),
    expected_output=dedent('''
        Quality report with validation results and any issues identified.
    '''),
    agent=None
)