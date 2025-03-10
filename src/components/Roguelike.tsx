import React, { useState, useEffect } from 'react';

const gridSize = 10;
const initialPlayerPosition = { x: 0, y: 0 };

const Roguelike: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);

    const handleKeyPress = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                setPlayerPosition((prev) => ({
                    x: prev.x,
                    y: Math.max(0, prev.y - 1),
                }));
                break;
            case 'ArrowDown':
                setPlayerPosition((prev) => ({
                    x: prev.x,
                    y: Math.min(gridSize - 1, prev.y + 1),
                }));
                break;
            case 'ArrowLeft':
                setPlayerPosition((prev) => ({
                    x: Math.max(0, prev.x - 1),
                    y: prev.y,
                }));
                break;
            case 'ArrowRight':
                setPlayerPosition((prev) => ({
                    x: Math.min(gridSize - 1, prev.x + 1),
                    y: prev.y,
                }));
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < gridSize; y++) {
            const row = [];
            for (let x = 0; x < gridSize; x++) {
                row.push(
                    <div
                        key={`${x}-${y}`}
                        style={{
                            width: 30,
                            height: 30,
                            border: '1px solid black',
                            backgroundColor: playerPosition.x === x && playerPosition.y === y ? 'blue' : 'white',
                        }}
                    />
                );
            }
            grid.push(
                <div key={y} style={{ display: 'flex' }}>
                    {row}
                </div>
            );
        }
        return grid;
    };

    return <div>{renderGrid()}</div>;
};

export default Roguelike;