/*
Most of the symbols in this module really should not be exported.
But there is no way to implement unit tests for private functions and classes
without using a module like rewire, which comes with its own complexity.
*/

export interface IAction { }

class ActionWithValue<T> implements IAction {
    constructor(public readonly value: T) { }
}

export type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | '.';
export class Operand extends ActionWithValue<digit> {}

export class Action implements IAction {
    private constructor(private readonly s: string) { }

    toString() { return this.s; }

    static Add = new Action('add');
    static Subtract = new Action('subtract');
    static Multiply = new Action('multiply');
    static Divide = new Action('divide');
    static Evaluate = new Action('evaluate');
    static Cancel = new Action('cancel');
    static Percent = new Action('percent');
    static Negate = new Action('negate');

    static Operand(value: digit): Operand {
        return new Operand(value);
    }
}


export class Buffer {
    static MAX_LENGTH = 16;

    constructor(private buffer: string = '') {}

    toString(): string {
        return this.buffer.length === 0 ? '0' : this.buffer;
    }

    toNumber(): number { return parseFloat(this.buffer); }

    concat(s: string | digit): void {
        if (!this.isFull()) {
            this.buffer += s;
        }
    }

    isFull(): boolean {
        return this.buffer.length >= Buffer.MAX_LENGTH;
    }

    isEmpty(): boolean {
        return this.buffer.length === 0;
    }

    copy(): Buffer {
        return new Buffer(this.buffer);
    }
}

export type CalculatorState = {
    register: Buffer,
    operand: Buffer,
    operator: Action
}

function copy(s: CalculatorState): CalculatorState {
    const register = s.register.copy();
    const operand = s.operand.copy();
    const operator = s.operator;

    return { register, operand, operator }
}

export const initialState: CalculatorState = {
    register: new Buffer(),
    operand: new Buffer(),
    operator: Action.Evaluate
}

export function reducer(state: CalculatorState, action: IAction): CalculatorState {
    let { register, operand, operator } = copy(state);
    
    if (action instanceof Action) {
        if (action === Action.Cancel) return cancel(state);
        if (action === Action.Percent || action === Action.Negate) {
            if (operand.isEmpty()) return state;
            else {
                let n = operand.toNumber();
                n = action === Action.Percent ? n / 100 : -n;
                const o = new Buffer(n.toString());
                return { ...state, operand: o };
            }
        }

        if (register.isEmpty()) {
            register = operand.copy();
            operator = action;
            operand = new Buffer();
        } else {
            const n_register = register.toNumber();
            const n_operand = operand.toNumber();
            let result: number = NaN;

            switch (operator) {
                case Action.Add:
                    result = n_register + n_operand; break;
                case Action.Subtract:
                    result = n_register - n_operand; break;
                case Action.Multiply:
                    result = n_register * n_operand; break;
                case Action.Divide:
                    result = n_register / n_operand; break;
                case Action.Evaluate:
                    return {...state, operator: action};
                default: throw new Error('the calculator is in an invalid state');
            }

            operator = action;
            operand = new Buffer();
            register = new Buffer(result.toString())
        }
    } else if (action instanceof Operand) {
        operand.concat(action.value);
    } else {
        throw new Error('action is neither an Action nor an Operand')
    }

    return { register, operand, operator };
}

function cancel(state: CalculatorState): CalculatorState {
    let { register, operand } = state;

    if (register.isEmpty()) return { ...state, operand: new Buffer() };
    if (operand.isEmpty()) return initialState;
    return { ...state, operand: new Buffer() }
}
