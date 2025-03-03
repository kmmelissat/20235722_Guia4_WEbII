const initialBudget = () => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? parseFloat(localStorageBudget) : 0
}

const localStorageExpenses = () => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: "",
    currentCategory: ""
}

const saveExpensesToLocalStorage = (expenses) => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
}
export const budgetReducer = (state, action) => {
    let newState;
    switch (action.type) {
        case "add-budget":
            localStorage.setItem('budget', action.payload.budget)
            newState = { ...state, budget: action.payload.budget }
            break;
        case "show-modal":
            newState = { ...state, modal: true }
            break;
        case "close-modal":
            newState = { ...state, modal: false, editingId: "" }
            break;
        case "add-expense":
            newState = { ...state, expenses: [...state.expenses, { ...action.payload.expense, id: new Date().getTime() }], modal: false }
            saveExpensesToLocalStorage(newState.expenses)
            break;
        case "remove-expense":
            newState = { ...state, expenses: state.expenses.filter(expense => expense.id != action.payload.id) }
            saveExpensesToLocalStorage(newState.expenses)
            break;
        case "get-expense-by-id":
            newState = { ...state, editingId: action.payload.id, modal: true }
            break;
        case "update-expense":
            newState = {
                ...state,
                expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense),
                modal: false,
                editingId: ""
            }
            saveExpensesToLocalStorage(newState.expenses)
            break;
        case "add-filter-category":
            newState = { ...state, currentCategory: action.payload.categoryId }
            break;
        case "reset-app": 
            localStorage.clear();
            newState = {
                budget: 0,
                modal: false,
                expenses: [],
                editingId: "",
                currentCategory: ""
            }
            break;
        default:
            newState = state;
    }
    return newState;
}