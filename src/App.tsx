import React, { useState } from 'react';
import ContainerScene from './components/ContainerScene';
import { Container, Pallet, PackingResult, Position } from './types/types';
import { optimizeContainerPacking } from './utils/packingAlgorithm';
import './App.css';

const defaultPosition: Position = { x: 0, y: 0, z: 0 };

interface ItemDimensions {
  width: number;
  height: number;
  depth: number;
}

function App() {
  const [container, setContainer] = useState<Container>({
    dimensions: { width: 2.35, height: 2.381, depth: 12.03 },
    maxWeight: 1000
  });

  const [palletSize, setPalletSize] = useState<ItemDimensions>({
    width: 1.2,
    height: 1.5,
    depth: 0.8
  });

  const [boxSize, setBoxSize] = useState<ItemDimensions>({
    width: 0.27,
    height: 0.17,
    depth: 0.4
  });

  const [result, setResult] = useState<PackingResult | null>(null);

  const calculateOptimalPacking = () => {
    const testPallet: Pallet = {
      dimensions: { ...palletSize },
      weight: 30,
      position: { ...defaultPosition }
    };

    const result = optimizeContainerPacking(container, [testPallet], boxSize);
    setResult(result);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="input-section">
          <h2>Параметры расчета</h2>
          
          <div className="dimensions-section">
            <h2>Контейнер</h2>
            <div className="input-group">
              <label>Ширина (м)</label>
              <input
                type="number"
                value={container.dimensions.width}
                onChange={(e) => setContainer({
                  ...container,
                  dimensions: { ...container.dimensions, width: parseFloat(e.target.value) }
                })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Высота (м)</label>
              <input
                type="number"
                value={container.dimensions.height}
                onChange={(e) => setContainer({
                  ...container,
                  dimensions: { ...container.dimensions, height: parseFloat(e.target.value) }
                })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Глубина (м)</label>
              <input
                type="number"
                value={container.dimensions.depth}
                onChange={(e) => setContainer({
                  ...container,
                  dimensions: { ...container.dimensions, depth: parseFloat(e.target.value) }
                })}
                step="0.01"
              />
            </div>
          </div>

          <div className="dimensions-section">
            <h2>Паллета</h2>
            <div className="input-group">
              <label>Ширина (м)</label>
              <input
                type="number"
                value={palletSize.width}
                onChange={(e) => setPalletSize({ ...palletSize, width: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Высота (м)</label>
              <input
                type="number"
                value={palletSize.height}
                onChange={(e) => setPalletSize({ ...palletSize, height: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Глубина (м)</label>
              <input
                type="number"
                value={palletSize.depth}
                onChange={(e) => setPalletSize({ ...palletSize, depth: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
          </div>

          <div className="dimensions-section">
            <h2>Ящик</h2>
            <div className="input-group">
              <label>Ширина (м)</label>
              <input
                type="number"
                value={boxSize.width}
                onChange={(e) => setBoxSize({ ...boxSize, width: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Высота (м)</label>
              <input
                type="number"
                value={boxSize.height}
                onChange={(e) => setBoxSize({ ...boxSize, height: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Глубина (м)</label>
              <input
                type="number"
                value={boxSize.depth}
                onChange={(e) => setBoxSize({ ...boxSize, depth: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
          </div>

          <button className="calculate-button" onClick={calculateOptimalPacking}>
            Рассчитать размещение
          </button>

          {result && (
            <div className="results">
              <h2>Результаты расчета</h2>
              <p>
                <span>Количество паллет:</span>
                <span>{result.pallets.length}</span>
              </p>
              <p>
                <span>Количество ящиков:</span>
                <span>{result.boxes ? result.boxes.length : 0}</span>
              </p>
              <p>
                <span>Использовано пространства:</span>
                <span>{result.utilizationPercentage.toFixed(2)}%</span>
              </p>
              <p>
                <span>Общий вес:</span>
                <span>{result.totalWeight} кг</span>
              </p>
              <p>
                <span>Неиспользованное пространство:</span>
                <span>{result.unusedSpace.toFixed(2)} м³</span>
              </p>
            </div>
          )}
        </div>

        <div className="visualization-section">
          {result ? (
            <ContainerScene
              container={container}
              pallets={result.pallets}
              boxes={result.boxes || []}
            />
          ) : (
            <div className="empty-state">
              <p>Здесь появится визуализация размещения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
