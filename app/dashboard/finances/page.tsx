"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { CalendarIcon, CreditCard, DollarSign, Plus, Trash, TrendingDown, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Transaction type definition
type Transaction = {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
  description: string
  date: Date
}

// Budget type definition
type Budget = {
  id: string
  category: string
  amount: number
  spent: number
  period: "monthly" | "yearly"
}

// Mock data for transactions
const initialTransactions: Transaction[] = [
  {
    id: "1",
    amount: 2500,
    type: "income",
    category: "Salary",
    description: "Monthly salary",
    date: new Date(2023, 2, 1),
  },
  {
    id: "2",
    amount: 500,
    type: "expense",
    category: "Rent",
    description: "Monthly rent",
    date: new Date(2023, 2, 5),
  },
  {
    id: "3",
    amount: 120,
    type: "expense",
    category: "Groceries",
    description: "Weekly groceries",
    date: new Date(2023, 2, 10),
  },
  {
    id: "4",
    amount: 80,
    type: "expense",
    category: "Utilities",
    description: "Electricity bill",
    date: new Date(2023, 2, 15),
  },
  {
    id: "5",
    amount: 200,
    type: "expense",
    category: "Entertainment",
    description: "Concert tickets",
    date: new Date(2023, 2, 20),
  },
  {
    id: "6",
    amount: 300,
    type: "income",
    category: "Freelance",
    description: "Design project",
    date: new Date(2023, 2, 25),
  },
]

// Mock data for budgets
const initialBudgets: Budget[] = [
  {
    id: "1",
    category: "Groceries",
    amount: 400,
    spent: 320,
    period: "monthly",
  },
  {
    id: "2",
    category: "Entertainment",
    amount: 200,
    spent: 200,
    period: "monthly",
  },
  {
    id: "3",
    category: "Utilities",
    amount: 150,
    spent: 80,
    period: "monthly",
  },
  {
    id: "4",
    category: "Dining Out",
    amount: 300,
    spent: 150,
    period: "monthly",
  },
]

// Transaction categories
const expenseCategories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Debt",
  "Personal",
  "Entertainment",
  "Groceries",
  "Dining Out",
  "Education",
  "Clothing",
  "Gifts",
  "Travel",
  "Other",
]

const incomeCategories = ["Salary", "Freelance", "Investments", "Gifts", "Refunds", "Other"]

export default function FinancesPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [newTransactionOpen, setNewTransactionOpen] = useState(false)
  const [newBudgetOpen, setNewBudgetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  
  // New transaction form state
  const [newTransactionAmount, setNewTransactionAmount] = useState("")
  const [newTransactionType, setNewTransactionType] = useState<"income" | "expense">("expense")
  const [newTransactionCategory, setNewTransactionCategory] = useState("")
  const [newTransactionDescription, setNewTransactionDescription] = useState("")
  const [newTransactionDate, setNewTransactionDate] = useState<Date>(new Date())
  
  // New budget form state
  const [newBudgetCategory, setNewBudgetCategory] = useState("")
  const [newBudgetAmount, setNewBudgetAmount] = useState("")
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<"monthly" | "yearly">("monthly")
  
  // Filter transactions for selected month
  const filteredTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.getMonth()
    const transactionYear = transaction.date.getFullYear()
    const selectedMonthValue = selectedMonth.getMonth()
    const selectedYearValue = selectedMonth.getFullYear()
    
    return transactionMonth === selectedMonthValue && transactionYear === selectedYearValue
  })
  
  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpenses
  
  // Calculate expense by category for pie chart
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += transaction.amount
      return acc
    }, {} as Record<string, number>)
  
  const expensePieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }))
  
  // Prepare monthly data for line chart
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i)
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    
    const monthTransactions = transactions.filter(t => 
      t.date >= monthStart && t.date <= monthEnd
    )
    
    const monthIncome = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthExpenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      month: format(month, "MMM"),
      income: monthIncome,
      expenses: monthExpenses,
      savings: monthIncome - monthExpenses
    }
  })
  
  // Function to add transaction
  const handleAddTransaction = () => {
    const amount = Number.parseFloat(newTransactionAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }
    
    if (!newTransactionCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      type: newTransactionType,
      category: newTransactionCategory,
      description: newTransactionDescription || `${newTransactionType === "income" ? "Income" : "Expense"} - ${newTransactionCategory}`,
      date: newTransactionDate,
    }
    
    setTransactions([...transactions, newTransaction])
    resetNewTransactionForm()
    setNewTransactionOpen(false)
    
    toast({
      title: "Transaction added",
      description: `${newTransactionType === "income" ? "Income" : "Expense"} of $${amount.toFixed(2)} has been recorded`,
    })
    
    // Update budget if it's an expense
    if (newTransactionType === "expense") {
      const matchingBudget = budgets.find(b => b.category === newTransactionCategory)
      if (matchingBudget) {
        setBudgets(
          budgets.map(budget => 
            budget.id === matchingBudget.id
              ? { ...budget, spent: budget.spent + amount }
              : budget
          )
        )
      }
    }
  }
  
  // Function to add budget
  const handleAddBudget = () => {
    const amount = Number.parseFloat(newBudgetAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }
    
    if (!newBudgetCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }
    
    // Check if budget for this category already exists
    const existingBudget = budgets.find(b => b.category === newBudgetCategory)
    if (existingBudget) {
      toast({
        title: "Error",
        description: `A budget for ${newBudgetCategory} already exists`,
        variant: "destructive",
      })
      return
    }
    
    const newBudget: Budget = {
      id: Date.now().toString(),
      category: newBudgetCategory,
      amount,
      spent: 0,
      period: newBudgetPeriod,
    }
    
    setBudgets([...budgets, newBudget])
    resetNewBudgetForm()
    setNewBudgetOpen(false)
    
    toast({
      title: "Budget added",
      description: `Budget of $${amount.toFixed(2)} for ${newBudgetCategory} has been created`,
    })
  }
  
  // Function to delete transaction
  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    
    if (transaction && transaction.type === "expense") {
      // Update budget if it's an expense
      const matchingBudget = budgets.find(b => b.category === transaction.category)
      if (matchingBudget) {
        setBudgets(
          budgets.map(budget => 
            budget.id === matchingBudget.id
              ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
              : budget
          )
        )
      }
    }
    
    setTransactions(transactions.filter(t => t.id !== id))
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed",
    })
  }
  
  // Function to delete budget
  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id))
    
    toast({
      title: "Budget deleted",
      description: "The budget has been removed",
    })
  }
  
  // Reset new transaction form
  const resetNewTransactionForm = () => {
    setNewTransactionAmount("")
    setNewTransactionType("expense")
    setNewTransactionCategory("")
    setNewTransactionDescription("")
    setNewTransactionDate(new Date())
  }
  
  // Reset new budget form
  const resetNewBudgetForm = () => {
    setNewBudgetCategory("")
    setNewBudgetAmount("")
    setNewBudgetPeriod("monthly")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">
            Track your income, expenses, and budget
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new income or expense
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newTransactionAmount}
                      onChange={(e) => setNewTransactionAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newTransactionType}
                      onValueChange={(value) => setNewTransactionType(value as any)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTransactionCategory}
                    onValueChange={setNewTransactionCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {newTransactionType === "income"
                        ? incomeCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        : expenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newTransactionDescription}
                    onChange={(e) => setNewTransactionDescription(e.target.value)}
                    placeholder="What was this for?"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTransactionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTransactionDate ? format(newTransactionDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTransactionDate}
                        onSelect={(date) => date && setNewTransactionDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTransaction}>Add Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={newBudgetOpen} onOpenChange={setNewBudgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set a budget for a specific category
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget-category">Category</Label>
                  <Select
                    value={newBudgetCategory}
                    onValueChange={setNewBudgetCategory}
                  >
                    <SelectTrigger id="budget-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="budget-amount">Amount ($)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="budget-period">Period</Label>
                  <Select
                    value={newBudgetPeriod}
                    onValueChange={(value) => setNewBudgetPeriod(value as any)}
                  >
                    <SelectTrigger id="budget-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBudget}>Create Budget</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Income
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      For {format(selectedMonth, "MMMM yyyy")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Expenses
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      For {format(selectedMonth, "MMMM yyyy")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ${balance.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For {format(selectedMonth, "MMMM yyyy")}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Income vs. Expenses</CardTitle>
                    <CardDescription>
                      Last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        income: {
                          label: "Income",
                          color: "hsl(var(--chart-2))",
                        },
                        expenses: {
                          label: "Expenses",
                          color: "hsl(var(--chart-3))",
                        },
                        savings: {
                          label: "Savings",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <LineChart
                        accessibilityLayer
                        data={monthlyData}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <YAxis
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="var(--color-income)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="var(--color-expenses)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="savings"
                          stroke="var(--color-savings)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                      By category for {format(selectedMonth, "MMMM yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expensePieChartData.length > 0 ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <PieChart width={300} height={300}>
                          <Pie
                            data={expensePieChartData}
                            cx={150}
                            cy={150}
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          />
                          <ChartTooltip />
                        </PieChart>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No expense data for this month</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>
                    Your monthly budgets and spending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.length > 0 ? (
                      budgets.map((budget) => (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{budget.category}</span>
                              <Badge variant="outline">${budget.amount.toFixed(2)}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                budget.spent / budget.amount > 0.9
                                  ? "bg-red-500"
                                  : budget.spent / budget.amount > 0.7
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, (budget.spent / budget.amount) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No budgets created yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !selectedMonth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedMonth, "MMMM yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="month"
                        selected={selectedMonth}
                        onSelect={(date) => date && setSelectedMonth(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Your financial activity for {format(selectedMonth, "MMMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTransactions
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                              }`}>
                                {transaction.type === "income" ? (
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{transaction.category}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(transaction.date, "MMM d, yyyy")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`font-bold ${
                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                              }`}>
                                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                      <div className="flex flex-col items-center text-center">
                        <CreditCard className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No transactions</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          No transactions found for {format(selectedMonth, "MMMM yyyy")}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="budgets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Budgets</CardTitle>
                  <CardDescription>
                    Manage your spending limits by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {budgets.length > 0 ? (
                    <div className="space-y-6">
                      {budgets.map((budget) => (
                        <div key={budget.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{budget.category}</h3>
                              <p className="text-sm text-muted-foreground">
                                {budget.period === "monthly" ? "Monthly" : "Yearly"} Budget
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBudget(budget.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((budget.spent / budget.amount) * 100)}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${
                                  budget.spent / budget.amount > 0.9
                                    ? "bg-red-500"
                                    : budget.spent / budget.amount > 0.7
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(100, (budget.spent / budget.amount) * 100)}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {budget.spent < budget.amount
                                ? `$${(budget.amount - budget.spent).toFixed(2)} remaining`
                                : `$${(budget.spent - budget.amount).toFixed(2)} over budget`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                      <div className="flex flex-col items-center text-center">
                        <DollarSign className="h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No budgets</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Create a budget to track your spending
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Your financial trends over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      income: {
                        label: "Income",
                        color: "hsl(var(--chart-2))",
                      },
                      expenses: {
                        label: "Expenses",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={monthlyData}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                      <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                      <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Savings Rate</CardTitle>
                  <CardDescription>
                    Percentage of income saved each month
                  </CardDescription>\

