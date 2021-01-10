import { Buffer, reducer, initialState, IAction, Action, Operand, digit } from './action';

it('Adds numbers to a buffer', () => {
    const buffer = new Buffer();
    expect(buffer.toString()).toBe('0');

    buffer.concat(3);
    expect(buffer.toString()).toBe('3');

    buffer.concat(7);
    expect(buffer.toString()).toBe('37');
})

describe('the reducer', () => {
    test('Adds operands from a blank slate', () => {
        let action = Action.Operand(3);
        let state = reducer(initialState, action);
        expect(initialState.register.isEmpty()).toBe(true);
        expect(state.register.isEmpty()).toBe(true);
        expect(state.operand.toString()).toBe('3');

        action = Action.Operand(7);
        state = reducer(state, action);
        expect(state.register.isEmpty()).toBe(true);
        expect(state.operand.toString()).toBe('37');
    });

    test('Moves operand to register when given operator action', () => {
        const actionsAsString = '34+';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }
        expect(state.register.toString()).toBe('34');
        expect(state.operator).toBe(Action.Add);
        expect(state.operand.isEmpty()).toBe(true);
    });

    test('2 operands 1 operator 2 operands', () => {
        const actionsAsString = '34+91';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }
        expect(state.register.toString()).toBe('34');
        expect(state.operator).toBe(Action.Add);
        expect(state.operand.toString()).toBe('91');
    });

    test('2 operands 1 operator 2 operands then =', () => {
        const actionsAsString = '34+91=';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }
        expect(state.register.toString()).toBe('125');
        expect(state.operator).toBe(Action.Evaluate);
        expect(state.operand.isEmpty()).toBe(true);
    });

    test('2 operands 1 operator 2 operands then plus', () => {
        const actionsAsString = '34+91+';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }
        expect(state.register.toString()).toBe('125');
        expect(state.operator).toBe(Action.Add);
        expect(state.operand.isEmpty()).toBe(true);
    });
    
    test('2 operands 1 operator 2 operands then multiply', () => {
        const actionsAsString = '34+91*';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }
        expect(state.register.toString()).toBe('125');
        expect(state.operator).toBe(Action.Multiply);
        expect(state.operand.isEmpty()).toBe(true);
    });

    test('1 operand 1 operator 1 operand then equal then 1 operand', () => {
        const actionsAsString = '2+3=-';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }

        expect(state.register.toString()).toBe('5');
        expect(state.operator).toBe(Action.Subtract);
        expect(state.operand.isEmpty()).toBe(true);
    })

    test('1 operand then cancel', () => {
        const actionsAsString = '1c';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }

        expect(state).toEqual(initialState);
    });

    test('2 operands then percent', () => {
        const actionsAsString = '13%';
        const actions = toActions(actionsAsString);
        let state = initialState;
        for (const a of actions) {
            state = reducer(state, a);
        }

        expect(state.operand.toNumber()).toBeCloseTo(0.13);
        expect(state.register.isEmpty()).toBe(true);
        expect(state.operator).toBe(Action.Evaluate);
    });
});

function toActions(actions: string): IAction[] {
    const operators = '+-/*=c%';
    const numbers = '0123456789';

    const result: IAction[] = [];
    for (const s of actions) {
        if (operators.includes(s)) {
            switch (s) {
                case '+': result.push(Action.Add); break;
                case '-': result.push(Action.Subtract); break;
                case '/': result.push(Action.Divide); break;
                case '*': result.push(Action.Multiply); break;
                case '=': result.push(Action.Evaluate); break;
                case 'c': result.push(Action.Cancel); break;
                case '%': result.push(Action.Percent); break;
            }
        } else if (numbers.includes(s)) {
            const n = parseInt(s);
            const action = Action.Operand(n as digit);
            result.push(action);
        } else {
            throw new Error('invalid input');
        }
    }
    return result;
}

it('toActions with one operand', () => {
    const actionsAsString = '3';
    const actions = toActions(actionsAsString);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toHaveProperty('value');
    expect((actions[0] as Operand).value).toBe(3);
});

it('toActions with two operands', () => {
    const actionsAsString = '36';
    const actions = toActions(actionsAsString);
    expect(actions).toHaveLength(2);
    expect(actions.every(a => 'value' in a)).toBe(true);
    expect((actions[0] as Operand).value).toBe(3);
    expect((actions[1] as Operand).value).toBe(6);
})

it('toActions with 1 operand and + operator', () => {
    const actionsAsString = '1+';
    const actions = toActions(actionsAsString);
    expect(actions).toHaveLength(2);
    expect((actions[0] as Operand).value).toBe(1);
    expect(actions[1]).toBe(Action.Add);
});
