// MODULES
import React, { useState, useEffect, useRef } from 'react';

import './index.css';

function APathfinding() {
  const [arr, setArr] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [key, setKey] = useState('');
  const [currentParentNode, setCurrentParentNode] = useState({});
  const [startNode, setStartNode] = useState({});
  const [endNode, setEndNode] = useState({});
  //const [neighbours, setNeighbours] = useState([]);
  const colors = {
    black: 'black',
    white: 'white',
    startColor: 'blue',
    endColor: 'red',
    neighbourColor: 'green',
    pathColor: 'orange',
  };

  const container = useRef();

  useEffect(() => {
    const _arr = [];
    for (let i = 0; i < 600; i++) {
      _arr[i] = {
        width: 40,
        height: 40,
        fCost: null,
        gCost: null,
        hCost: null,
        x: null,
        y: null,
        color: 'white',
        class: '',
        index: i,
        id: i + 1,
      };
    }

    setArr(_arr);

    document.addEventListener('keydown', (e) => {
      setKey(e.key);
    });

    document.addEventListener('keyup', (e) => {
      setKey('');
    });

    window.addEventListener('load', () => {
      const childrenLength = container.current.children.length;

      for (let i = 0; i < childrenLength; i++) {
        if (container.current && container.current.children) {
          const currentChildren = container.current.children[i];

          const currentIndex = Number(currentChildren.getAttribute('index'));

          const { x, y, width, height } =
            currentChildren.getBoundingClientRect();

          _arr[currentIndex].x = x;
          _arr[currentIndex].y = y;
          _arr[currentIndex].width = width;
          _arr[currentIndex].height = height;
        }
      }

      setArr(_arr);
    });

    return () => {};
  }, []);

  // finds neighbour nodes
  function findNeighbours({ startNode, currentParentNode, arr }) {
    if (!startNode || !currentParentNode || !arr) {
      throw new Error('Missing arguments in findNeighbours');
    }

    const { x, y, width, height } = currentParentNode;

    function isNeighbour({ current, i, j }) {
      if (
        !current ||
        i === undefined ||
        i === null ||
        j === null ||
        j === undefined
      ) {
        throw new Error('Missing arguments in isNeighbour');
      }

      if (current.color === 'black') {
        return null;
      }

      if (currentParentNode.id === endNode?.id) {
        console.log('Destination has been reached');
        return;
      }

      const nodesNavigation = {
        0: {
          0: current.x === x - width && current.y === y - height,
          1: current.x === x && current.y === y - height,
          2: current.x === x + width && current.y === y - height,
        },
        1: {
          0: current.x === x - width && current.y === y,
          //1: property 1 doesnt exist because that would be the selected current parent node.
          2: current.x === x + width && current.y === y,
        },
        2: {
          0: current.x === x - width && current.y === y + height,
          1: current.x === x && current.y === y + height,
          2: current.x === x + width && current.y === y + height,
        },
      };

      return nodesNavigation[i][j];
    }

    const neighbours = [];

    // The neighbour on the upper left

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const neighbour = arr.find((current) => {
          if (isNeighbour({ current, i, j })) {
            return current;
          }

          return null;
        });

        if (neighbour) {
          let startNodeSubstractionX = neighbour.x - startNode.x;
          let startNodeSubstractionY = neighbour.y - startNode.y;

          // make all the substraction values positive
          if (startNodeSubstractionX < 0) {
            startNodeSubstractionX = startNodeSubstractionX * -1;
          }

          if (startNodeSubstractionY < 0) {
            startNodeSubstractionY = startNodeSubstractionY * -1;
          }

          if (startNodeSubstractionX && startNodeSubstractionY) {
            // the ones on the corner

            neighbour.gCost = Math.floor(
              Math.sqrt(
                startNodeSubstractionX * startNodeSubstractionX +
                  startNodeSubstractionY * startNodeSubstractionY
              )
            );
          } else {
            if (!startNodeSubstractionX) {
              neighbour.gCost = startNodeSubstractionY;
            } else {
              neighbour.gCost = startNodeSubstractionX;
            }
          }

          let endNodeSubstractionX = neighbour.x - endNode.x;
          let endNodeSubstractionY = neighbour.y - endNode.y;

          if (endNodeSubstractionX < 0) {
            endNodeSubstractionX = endNodeSubstractionX * -1;
          }

          if (endNodeSubstractionY < 0) {
            endNodeSubstractionY = endNodeSubstractionY * -1;
          }

          if (endNodeSubstractionX && endNodeSubstractionY) {
            neighbour.hCost = Math.floor(
              Math.sqrt(
                endNodeSubstractionX * endNodeSubstractionX +
                  endNodeSubstractionY * endNodeSubstractionY
              )
            );
          } else {
            if (!endNodeSubstractionX) {
              neighbour.hCost = endNodeSubstractionY;
            } else {
              neighbour.hCost = endNodeSubstractionX;
            }
          }

          // Pathfinding navigation value;
          neighbour.fCost = neighbour.gCost + neighbour.hCost;
        }

        const updatedNeighbour = {
          ...neighbour,
          color: colors.neighbourColor,
          gCost: neighbour?.gCost,
          fCost: neighbour?.fCost,
          hCost: neighbour?.hCost,
        };

        neighbours.push(updatedNeighbour);
      }
    }

    return neighbours;
  }

  function renderGrid() {
    return arr.map((current, index) => {
      return (
        <div
          onScroll={(e) => {
            console.log(e);
          }}
          onMouseUp={() => {
            setMouseDown(false);
          }}
          onMouseDown={() => {
            setMouseDown(true);
          }}
          onMouseEnter={() => {
            if (mouseDown) {
              const _arr = [...arr];

              if (_arr[index].color === 'black') {
                _arr[index].color = colors.white;
              } else if (_arr[index].color === 'white') {
                _arr[index].color = colors.black;
              }

              setArr(_arr);

              //_arr = [...arr];
            }
          }}
          onClick={() => {
            let _arr = [...arr];

            switch (key) {
              case 's':
              case 'S':
                _arr = arr.map((el, i) => {
                  const currentEl = { ...el };

                  if (currentEl.color === 'blue') {
                    currentEl.color = 'white';
                  }

                  return {
                    ...currentEl,
                  };
                });

                _arr[index].color = colors.startColor;

                setStartNode(current);
                setCurrentParentNode(current);

                setArr(_arr);

                break;
              case 'e':
              case 'E':
                _arr = arr.map((el, i) => {
                  const currentEl = { ...el };

                  if (currentEl.color === 'red') {
                    currentEl.color = 'white';
                  }

                  return {
                    ...currentEl,
                  };
                });

                _arr[index].color = colors.endColor;
                setEndNode(current);
                setArr(_arr);

                _arr = [...arr];

                break;
              default:
                if (_arr[index].color === 'black') {
                  _arr[index].color = colors.white;
                } else if (_arr[index].color === 'white') {
                  _arr[index].color = colors.black;
                }

                setArr(_arr);

                _arr = [...arr];

                break;
            }
          }}
          key={index}
          style={{
            border: '1px solid black',
            width: `${current.width}px`,
            height: `${current.height}px`,
            backgroundColor: current.color,
            position: 'relative',
            fontSize: '9px',
          }}
          className="node noselect"
          id={index + 1}
          index={index}
        >
          <div style={{ position: 'absolute', top: '0', left: '0' }}>
            {current.fCost}
          </div>

          <div style={{ position: 'absolute', bottom: '0', left: '0' }}>
            {current.gCost}
          </div>

          <div style={{ position: 'absolute', bottom: '0', right: '0' }}>
            {current.hCost}
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div
        ref={container}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '1200px',
        }}
        className="container"
      >
        {renderGrid(1000)}
      </div>

      <div
        style={{ border: '1px solid black', margin: '1rem', padding: '1rem' }}
        className="buttons-area"
      >
        <button
          onClick={() => {
            if (
              !Object.entries(startNode).length ||
              !Object.entries(endNode).length
            ) {
              alert('Please Choose a Star and an End First');
              return;
            }

            function findMin(numArr) {
              if (!numArr) {
                throw new Error(
                  'Number Array is not specified in findMin function'
                );
              }

              let lowestInt = 0;
              let highestInt = Number.MAX_SAFE_INTEGER;

              for (let i = 0; i < numArr.length; i++) {
                if (numArr[i]) {
                  let previousNum = numArr[i];

                  while (highestInt > previousNum) {
                    highestInt = previousNum;
                    lowestInt = highestInt;
                  }
                }
              }

              return lowestInt;
            }

            const neighbours = findNeighbours({
              startNode,
              currentParentNode,
              arr,
            });

            const closestFCost = findMin(
              neighbours.map((currentNeighbour) => currentNeighbour.fCost)
            );

            const newCurrentParentNode = neighbours.find(
              (currentNeighbour, index) =>
                currentNeighbour.fCost === closestFCost
            );

            setCurrentParentNode(newCurrentParentNode);

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

            setArr(updatedArr);
          }}
          style={{ margin: '0 1rem' }}
        >
          Start
        </button>
        <button>Stop</button>

        <div></div>
      </div>
    </>
  );
}

export default APathfinding;
