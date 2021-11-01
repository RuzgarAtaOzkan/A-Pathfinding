// MODULES
import React, { useState, useEffect, useRef } from 'react';

// finds neighbour nodes
function findNeighbours(currentParentNode, arr) {
  if (!currentParentNode) {
    throw new Error('Positions are not provided in findNeighbours');
  }

  // X and Y position of the given node;
  // Current parent node.
  const { x, y } = pos;

  const offsetNavigation = {
    current: null,
    currentParentNode,
    x: null,
    y: null,
    getInfo: function () {
      return {
        current: this.current,
        x: this.x,
        y: this.y,
      };
    },
    0: {
      0:
        this.getInfo().current.x ==
          this.getInfo().currentParentNode.x - this.getInfo().current.width &&
        this.getInfo().current.y ==
          this.getInfo().currentParentNode.y - this.getInfo().current.height,
      1:
        this.getInfo().current.x == this.getInfo().currentParentNode.x &&
        this.getInfo().current.y ==
          this.getInfo().currentParentNode.y - this.getInfo().current.height,
      2: this.getInfo().currentParentNode.x + this.getInfo().width,
    },
    1: { 0: null, 1: null, 2: null },
    2: { 0: null, 1: null, 2: null },
  };

  const neighbours = [];

  // The neighbour on the upper left

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const neighbour = arr.find((current, index) => {
        offsetNavigation.current = { ...current };
        offsetNavigation.x = x;
        offsetNavigation.y = y;

        if (current.x == x - current.width && current.y == y - current.height) {
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
  const [currentNode, setCurrentNode] = useState({});
  const [colors, setColors] = useState({
    black: 'black',
    white: 'white',
    startColor: 'blue',
    endColor: 'red',
  });

  const container = useRef();

  useEffect(() => {
    const _arr = [];
    for (let i = 0; i < gridCount; i++) {
      _arr[i] = {
        width: null,
        height: null,
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
          onMouseUp={() => {
            setMouseDown(false);
          }}
          onMouseDown={() => {
            setMouseDown(true);
          }}
          onMouseEnter={() => {
            if (mouseDown) {
              let _arr = [...arr];

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

                const { x, y } = _arr[index];

                const neighbours = findNeighbours({ x, y }, _arr);

                console.log(neighbours);

                setArr(_arr);

                _arr = [...arr];

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
            width: '35px',
            height: '35px',
            backgroundColor: current.color,
          }}
          className="node"
          id={index + 1}
          index={index}
        ></div>
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
        <button style={{ margin: '0 1rem' }}>Start</button>
        <button>Stop</button>

        <div></div>
      </div>
    </>
  );
}

export default APathfinding;
