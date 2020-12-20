import './App.css';

function App() {
  const button_order = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

  return (
    <>
      { /* placeholder until we implement interactivity */}
      <div id="output">0</div>
      <div id="input">
        <div id="operands">
          <div id="cancel">AC</div>
          <div id="negate">~</div>
          <div id="percent">%</div>

          {
            button_order.map(n => <div className="number" key={n}>{n}</div>)
          }

          <div id="dot">.</div>
        </div>

        <div id="operators">
          <div id="divide">÷</div>
          <div id="multiply">×</div>
          <div id="subtract">-</div>
          <div id="add">+</div>
          <div id="equals">=</div>
        </div>
      </div>
    </>
  );
}

export default App;
