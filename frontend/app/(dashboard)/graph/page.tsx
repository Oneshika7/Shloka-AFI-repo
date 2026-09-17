"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import Header from '@/components/Header';
import GlassCard from '@/components/GlassCard';
import { RefreshCw, Network, X, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const API_URL = "";

export default function GraphPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center h-screen bg-[var(--background)]">
        <Network className="w-12 h-12 text-gold-500 animate-pulse" />
      </div>
    }>
      <GraphPageContent />
    </Suspense>
  );
}

function GraphPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shlokaIdParam = searchParams.get('shloka_id');
  const { data: session } = useSession();

  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [selectedShloka, setSelectedShloka] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Stylesheet for cytoscape
  const stylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'right',
        'text-margin-x': 8,
        'font-family': 'Inter, sans-serif',
        'font-size': '12px',
        'font-weight': '600',
        'color': '#f7f3eb', 
        'text-background-opacity': 0.8,
        'text-background-color': '#1a1208',
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '4px',
        'text-outline-width': 0,
        'background-color': '#38bdf8', 
        'width': 20,
        'height': 20,
        'overlay-opacity': 0
      }
    },
    {
      selector: 'node[type = "Herb"]',
      style: { 'background-color': '#00ff88', 'text-outline-width': 0, 'width': 26, 'height': 26 } 
    },
    {
      selector: 'node[type = "Dosha"]',
      style: { 'background-color': '#ff00ff', 'text-outline-width': 0, 'width': 32, 'height': 32 }
    },
    {
      selector: 'node[type = "Disease"]',
      style: { 'background-color': '#ff3333', 'text-outline-width': 0, 'width': 24, 'height': 24 }
    },
    {
      selector: 'node[type = "Karma"]',
      style: { 'background-color': '#00aaff', 'text-outline-width': 0, 'width': 22, 'height': 22 } 
    },
    {
      selector: 'node[type = "Rasa"]',
      style: { 'background-color': '#ffcc00', 'text-outline-width': 0, 'width': 22, 'height': 22 } 
    },
    {
      selector: 'node[type = "Shloka"]',
      style: { 'background-color': '#ff8800', 'text-outline-width': 0, 'width': 28, 'height': 28, 'shape': 'rectangle', 'text-wrap': 'wrap', 'text-max-width': '120px' } 
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#94a3b8', 
        'opacity': 0.8,
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#94a3b8',
        'label': 'data(label)',
        'font-size': '10px',
        'font-weight': '600',
        'color': '#f7f3eb',
        'text-background-opacity': 0.8,
        'text-background-color': '#1a1208',
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '3px',
        'text-outline-width': 0,
        'text-rotation': 'autorotate',
        'text-margin-y': -8,
        'overlay-opacity': 0
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#ffff00',
        'shadow-blur': 15,
        'shadow-color': '#ffff00',
        'shadow-opacity': 1
      }
    }
  ];

  const layoutConfig = {
    name: 'cose',
    idealEdgeLength: 80,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 50,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
    animate: false
  };

  // Convert Neo4j response to Cytoscape elements
  const formatElements = (nodes: any[], edges: any[]): cytoscape.ElementDefinition[] => {
    const els: cytoscape.ElementDefinition[] = [];
    
    // Normalize and stringify all IDs
    const normalizedNodes = nodes.map(n => ({ ...n, id: String(n.id).trim() }));
    const filteredNodes = normalizedNodes.filter(n => n.id !== '');
    const validNodeIds = new Set(filteredNodes.map(n => n.id));
    const addedNodeIds = new Set<string>();

    filteredNodes.forEach(n => {
      if (!addedNodeIds.has(n.id)) {
        addedNodeIds.add(n.id);
        let nodeType = n.properties?.type || n.type || (n.labels && n.labels.length > 0 ? n.labels[0] : 'Unknown');
        if (nodeType === 'Roga') nodeType = 'Disease';
        
        els.push({
          data: { ...n.properties, id: n.id, label: n.label || n.id, type: nodeType }
        });
      }
    });

    const addedEdges = new Set<string>();
    edges.forEach((e) => {
      const fromId = String(e.from).trim();
      const toId = String(e.to).trim();

      if (validNodeIds.has(fromId) && validNodeIds.has(toId)) {
        // Create deterministic sorted edge ID to prevent bidirectional duplicates
        const [nodeA, nodeB] = [fromId, toId].sort();
        const edgeId = `edge_${nodeA}_${nodeB}_${e.label}`;
        
        if (!addedEdges.has(edgeId)) {
          addedEdges.add(edgeId);
          els.push({
            data: { id: edgeId, source: fromId, target: toId, label: e.label }
          });
        }
      }
    });
    return els;
  };

  const fetchFullGraph = async () => {
    if (!(session as any)?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/graph/full`, {
        headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch graph');
      const data = await res.json();
      setElements(formatElements(data.nodes || [], data.edges || []));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!(session as any)?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/graph/stats`, {
        headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchHistory = async () => {
    if (!(session as any)?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/shlokas`, {
        headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory((data.shlokas || []).slice(0, 10));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if ((session as any)?.accessToken) {
      fetchStats();
      fetchHistory();
    }
  }, [(session as any)?.accessToken]);

  useEffect(() => {
    if (!(session as any)?.accessToken) return;
    if (shlokaIdParam) {
      handleShlokaClick(shlokaIdParam);
    } else {
      setSelectedShloka(null);
      fetchFullGraph();
    }
  }, [shlokaIdParam, (session as any)?.accessToken]);

  const handleEntityTap = async (nodeId: string, nodeName: string) => {
    if (!(session as any)?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/graph/entity/${encodeURIComponent(nodeName)}`, {
        headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedEntity(data);
        
        // Dynamically add new connections to the graph
        if (data.connections && cyRef.current) {
          const cy = cyRef.current;
          const newEls: cytoscape.ElementDefinition[] = [];
          const addedDynEdges = new Set<string>();
          
          data.connections.forEach((conn: any, i: number) => {
            const targetId = conn.node.toLowerCase().replace(/ /g, '_');
            
            // Add node if not exists
            if (cy.getElementById(targetId).empty()) {
              newEls.push({
                data: { id: targetId, label: conn.node, type: conn.type }
              });
            }
            
            // Add edge if not exists, using same deterministic ID logic
            const [nodeA, nodeB] = [nodeId, targetId].sort();
            const edgeId = `edge_${nodeA}_${nodeB}_${conn.relationship}`;
            
            if (cy.getElementById(edgeId).empty() && !addedDynEdges.has(edgeId)) {
              addedDynEdges.add(edgeId);
              newEls.push({
                data: { id: edgeId, source: nodeId, target: targetId, label: conn.relationship }
              });
            }
          });
          
          if (newEls.length > 0) {
            cy.add(newEls);
            cy.layout({ name: 'cose', animate: true, randomize: false }).run();
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch entity details", e);
    }
  };

  const handleShlokaClick = async (shlokaId: string) => {
    if (!(session as any)?.accessToken) return;
    setSelectedShloka(shlokaId);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/graph/visualize/${encodeURIComponent(shlokaId)}`, {
        headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setElements(formatElements(data.nodes || [], data.edges || []));
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="Knowledge Graph" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Shloka History */}
        <div className="w-64 shrink-0 border-r border-sandy-500/10 flex flex-col bg-[#f7f3eb]/80 dark:bg-[#0f0d0a]/80 backdrop-blur-md relative z-10">
          <div className="p-4 border-b border-sandy-500/10">
            <h3 className="font-serif font-bold text-gold-500 text-sm tracking-wide">Processed Shlokas</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {history.map((shloka, i) => (
              <button
                key={i}
                onClick={() => handleShlokaClick(shloka.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  selectedShloka === shloka.id 
                    ? 'border-gold-500 bg-gold-500/10 text-[var(--foreground)]' 
                    : 'border-sandy-500/10 hover:bg-sandy-500/10 text-sandy-500'
                }`}
              >
                <p className="line-clamp-2 font-medium">{shloka.text || shloka.source}</p>
                <p className="text-[9px] mt-2 opacity-60">
                  {new Date(shloka.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Graph Canvas */}
        <div className="flex-1 relative bg-[var(--background)] flex flex-col">
          <div className="absolute top-4 left-4 z-10 flex gap-3">
            <button
              onClick={() => router.push('/workspace')}
              className="px-4 py-2 rounded-full glass-panel border border-sandy-500/20 hover:bg-sandy-500/10 transition-colors flex items-center gap-2 text-xs font-semibold text-sandy-500 bg-[var(--background)] shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shloka
            </button>
            <GlassCard className="p-3 py-2 flex items-center gap-4 text-xs font-semibold !rounded-full">
              <span className="text-gold-500">{stats?.total_nodes || 0} Nodes</span>
              <span className="text-sage-500">{stats?.total_relationships || 0} Edges</span>
            </GlassCard>
            <button 
              onClick={() => { setSelectedShloka(null); fetchFullGraph(); }}
              className="p-2.5 rounded-full glass-panel border border-sandy-500/20 hover:bg-sandy-500/10 transition-colors"
              title="Reset Graph"
            >
              <RefreshCw className="w-4 h-4 text-sandy-500" />
            </button>
          </div>

          {/* Graph Legend */}
          <div className="absolute top-4 right-4 z-10">
            <GlassCard className="p-3 text-xs font-medium space-y-2 !rounded-xl shadow-lg bg-[#1a1208]/90 border-sandy-500/20">
              <div className="text-gold-500 font-bold mb-2 border-b border-sandy-500/20 pb-1">Graph Legend</div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#00ff88]"></div> <span className="text-sandy-500">Herb</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#ff00ff]"></div> <span className="text-sandy-500">Dosha</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#ff3333]"></div> <span className="text-sandy-500">Disease (Roga)</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#00aaff]"></div> <span className="text-sandy-500">Karma</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#ffcc00]"></div> <span className="text-sandy-500">Rasa</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#ff8800] rounded-sm"></div> <span className="text-sandy-500">Shloka</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#38bdf8]"></div> <span className="text-sandy-500">Other Entity</span></div>
            </GlassCard>
          </div>

          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f7f3eb]/80 dark:bg-[#0f0d0a]/80 backdrop-blur-sm z-20">
              <Network className="w-12 h-12 text-gold-500 animate-pulse mb-4" />
              <p className="text-sm font-semibold text-gold-500">Mapping Ontologies...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <p className="text-rose-500">{error}</p>
            </div>
          ) : (
            <CytoscapeComponent
              elements={elements}
              style={{ width: '100%', height: '100%' }}
              stylesheet={stylesheet}
              layout={layoutConfig}
              minZoom={0.4}
              maxZoom={3.0}
              cy={(cy) => {
                cyRef.current = cy;
                // Remove previous listeners to prevent duplicates
                cy.removeAllListeners();
                cy.on('tap', 'node', (evt) => {
                  const node = evt.target;
                  handleEntityTap(node.id(), node.data('label'));
                });
                cy.on('tap', (evt) => {
                  if (evt.target === cy) setSelectedEntity(null);
                });
              }}
            />
          )}
        </div>

        {/* Right Sidebar: Entity Details */}
        {selectedEntity && (
          <div className="absolute right-0 top-0 bottom-0 w-80 shadow-2xl border-l border-sandy-500/10 flex flex-col bg-[#f7f3eb]/95 dark:bg-[#0f0d0a]/95 backdrop-blur-md animate-in slide-in-from-right-8 duration-300 z-50">
            <div className="p-4 border-b border-sandy-500/10 flex items-center justify-between">
              <h3 className="font-serif font-bold text-gold-500">Entity Details</h3>
              <button onClick={() => setSelectedEntity(null)} className="p-2 hover:bg-sandy-500/10 rounded-full transition-colors">
                <X className="w-4 h-4 text-sandy-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sandy-500">{selectedEntity.type}</span>
                <h2 className="text-2xl font-serif font-bold mt-1 text-[var(--foreground)]">{selectedEntity.name}</h2>
              </div>
              
              {selectedEntity.properties?.definition && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-2">Definition</h4>
                  <p className="text-sm leading-relaxed opacity-90">{selectedEntity.properties.definition}</p>
                </div>
              )}

              {selectedEntity.properties?.dosage && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-2">Dosage</h4>
                  <p className="text-sm leading-relaxed opacity-90">{selectedEntity.properties.dosage}</p>
                </div>
              )}

              {selectedEntity.connections && selectedEntity.connections.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-3">Direct Relationships</h4>
                  <div className="space-y-3">
                    {selectedEntity.connections.map((conn: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl border border-sandy-500/10 bg-sandy-500/5">
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <span className="font-bold text-gold-500">{conn.relationship}</span>
                          <span className="text-sandy-500">&rarr;</span>
                        </div>
                        <p className="font-semibold text-sm">{conn.node}</p>
                        <p className="text-[10px] text-sandy-500 mt-1">{conn.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}