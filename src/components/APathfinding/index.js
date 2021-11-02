// MODULES
import React, { useState, useEffect, useRef } from 'react';

import './index.css';

// finds neighbour nodes
function findNeighbours({ currentParentNode, arr }) {
  if (!currentParentNode || !arr) {
    throw new Error('Missing arguments in findNeighbours');
  }

  const { x, y, width, height } = currentParentNode;

  function isNeigbour(current, { i, j }) {
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
      const neighbour = arr.find((current, index) => {
        if (isNeigbour(current, { i, j })) {
          return current;
        }

        return null;
      });

      neighbours.push(neighbour);
    }
  }

  return neighbours;
}

function APathfinding({ gridCount }) {
  const [arr, setArr] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [key, setKey] = useState('');
  const [currentParentNode, setCurrentParentNode] = useState({});
  const [neighbours, setNeighbours] = useState([]);
  const [colors, setColors] = useState({
    black: 'black',
    white: 'white',
    startColor: 'blue',
    endColor: 'red',
    neighbourColor: 'green',
    pathColor: 'ocean',
  });

  const container = useRef();

  useEffect(() => {
    const _arr = [];
    for (let i = 0; i < gridCount; i++) {
      _arr[i] = {
        width: 40,
        height: 40,
        fCost: null,
        gCost: null,
        hCost: null,
        x: null,
        y: null,
        color: 'white',
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

              if (_arr[index].color == 'black') {
                _arr[index].color = colors.white;
              } else if (_arr[index].color == 'white') {
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
                /*

                */
                //
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

                setArr(_arr);

                _arr = [...arr];

                break;
              default:
                if (_arr[index].color === 'black') {
                  _arr[index].color = colors.white;
                } else if (_arr[index].color === 'white') {
                  _arr[index].color = colors.black;
                }

                console.log(_arr[index]);
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
            color: `${current.color === 'white' ? 'black' : 'white'}`,
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
            const neighbours = findNeighbours({
              currentParentNode,
              arr,
            });

            setNeighbours([...neighbours]);
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
