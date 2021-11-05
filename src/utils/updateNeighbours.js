export default function updateNeighbours(arr, neighbours) {
  if (!arr || !neighbours) {
    throw new Error('Arguments missing in updateNeighbours');
  }

  // update the array
  const updatedArr = arr.map((currentNode, index) => {
    let selectedNode = null;

    for (let i = 0; i < neighbours.length; i++) {
      if (currentNode.id === neighbours[i].id) {
        selectedNode = neighbours[i];

        break;
      }
    }

    if (selectedNode) {
      return {
        ...selectedNode,
      };
    } else {
      return {
        ...currentNode,
      };
    }
  });

  return updatedArr;
}
