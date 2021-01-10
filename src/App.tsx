import { useReducer } from 'react';
import { reducer, initialState, Action, digit, CalculatorState } from './action';
import './App.css';


const button_order = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

function cancelLabel({register, operand, operator}: CalculatorState): string {
  if (register.isEmpty() && !operand.isEmpty()) return 'C';
  if (operand.isEmpty()) return 'AC';
  else return 'C';
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      { /* placeholder until we implement interactivity */}
      <div id="output">
        { state.operand.isEmpty() && !state.register.isEmpty() ? state.register.toString() : state.operand.toString() }
      </div>
      <div id="input">
        <div id="operands">
          <div id="cancel" onClick={() => dispatch(Action.Cancel) }>{ cancelLabel(state) }</div>
          <div id="negate" title="negate" onClick={() => dispatch(Action.Negate) }>~</div>
          <div id="percent" onClick={() => dispatch(Action.Percent) }>%</div>

          {
            button_order.map(n => <div className="number"
                                       key={n}
                                       onClick={() => dispatch(Action.Operand(n as digit))}>
                                         {n}
                                  </div>)
          }

          <div id="dot" onClick={() => dispatch(Action.Operand('.'))}>.</div>
        </div>

        <div id="operators">
          <div id="divide" onClick={() => dispatch(Action.Divide)}>÷</div>
          <div id="multiply" onClick={() => dispatch(Action.Multiply)}>×</div>
          <div id="subtract" onClick={() => dispatch(Action.Subtract)}>−</div>
          <div id="add" onClick={() => dispatch(Action.Add)}>+</div>
          <div id="equals" onClick={() => dispatch(Action.Evaluate)}>=</div>
        </div>
      </div>
    </>
  );
}

export default App;
