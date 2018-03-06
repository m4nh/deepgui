import sys
import json
import networkx as nx
import matplotlib.pyplot as plt

filename = sys.argv[1]
data = json.load(open(filename))


class Factory(object):

    def __init__(self, json_data):
        self.json_data = json_data
        self.connections = {}
        self.nodes = {}
        self.graph = nx.DiGraph()
        for f in self.json_data['canvas']:
            if 'ports' in f:
                user_data = f['userData']
                if self.checkIfIsValidNode(user_data):
                    self.newNode(f)
            else:
                self.newConnection(f)
        self.buildGraph()

    def newConnection(self, json_data):
        connection = Connection(json_data)
        self.connections[connection.getID()] = connection

    def newNode(self, json_data):
        node = Node(json_data)
        self.nodes[node.getID()] = node

    def checkIfIsValidNode(self, data):
        return '_graph_node_' in data

    def buildGraph(self):
        for id, c in self.connections.items():
            source = c.getSource()
            target = c.getTarget()
            self.graph.add_edge(source, target)


class Connection(object):
    def __init__(self, json_data):
        self.json_data = json_data

    def getSource(self):
        return self.json_data['source']['node']

    def getTarget(self):
        return self.json_data['target']['node']

    def getID(self):
        return self.json_data['id']


class Node(object):
    def __init__(self, json_data):
        self.json_data = json_data

    def getID(self):
        return self.json_data['id']

    def isNode(self):
        return 'ports' in self.json_data

    def getPorts(self):
        return self.json_data['ports']

    def getType(self):
        return self.json_data['type']

    def getUserData(self):
        return self.json_data['userData']


factory = Factory(data)

labels = {}
for id, n in factory.nodes.items():
    labels[id] = n.getUserData()['_type_']

G = factory.graph
pos = nx.spectral_layout(G)
nx.draw(G, pos)
nx.draw_networkx_labels(G, pos, labels, font_size=16)
plt.show()

print("Nodes")

for id, n in factory.nodes.items():
    print(n.getID())

print("Connections")
for id, c in factory.connections.items():
    print(c.getID(), "==", c.getSource(), "->", c.getTarget())
