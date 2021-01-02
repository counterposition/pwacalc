import './App.css';

namespace Action {
  interface IAction {}

  class ActionWithValue<T> implements IAction {
    constructor(public readonly value: T) {}
  }

  type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  class Operand extends ActionWithValue<digit> {
    constructor(readonly value: digit) {
      super(value);
    }
  }

  class Action implements IAction {
    private constructor(private readonly s: string) {}

    public toString() { return this.s; }

    public static Add = new Action('add');
    public static Subtract = new Action('subtract');
    public static Multiply = new Action('multiply');
    public static Divide = new Action('divide');
    public static Evaluate = new Action('evaluate');

    public static Operand(value: digit): Operand {
      return new Operand(value);
    }
  }

  // FIX THIS: state should not be of type any
  function reducer(state: any, action: IAction) {
    if (action instanceof Action) {
        // do stuff
    } else if (action instanceof Operand) {
        const v = action.value;
        // do some stuff with v
    } else {
      throw new Error('action is neither an Action nor an Operand')
    }
  }
}

const button_order = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

function App() {

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
          <div id="subtract">−</div>
          <div id="add">+</div>
          <div id="equals">=</div>
        </div>
      </div>
    </>
  );
}

export default App;
