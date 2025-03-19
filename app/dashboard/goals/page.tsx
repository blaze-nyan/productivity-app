"use client"

import { useState } from "react"
import { Goal, Plus, ChevronDown, ChevronUp, Trash2, Check, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: Date
}

interface Milestone {
  id: string
  title: string
  description: string
  dueDate?: Date
  tasks: Task[]
  completed: boolean
}

interface LongTermGoal {
  id: string
  title: string
  description: string
  category: string
  targetDate?: Date
  milestones: Milestone[]
  progress: number
}

const categories = [
  { value: "career", label: "Career" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "personal", label: "Personal" },
  { value: "relationships", label: "Relationships" },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<LongTermGoal[]>([
    {
      id: "1",
      title: "Learn Advanced JavaScript",
      description: "Master advanced JavaScript concepts and frameworks",
      category: "education",
      targetDate: new Date(2024, 11, 31),
      milestones: [
        {
          id: "m1",
          title: "Learn React fundamentals",
          description: "Understand core React concepts and build a simple app",
          dueDate: new Date(2024, 3, 30),
          completed: true,
          tasks: [
            {
              id: "t1",
              title: "Complete React basics course",
              description: "Finish the intro course on React",
              completed: true,
            },
            {
              id: "t2",
              title: "Build a todo app",
              description: "Create a simple todo app with React",
              completed: true,
            },
            {
              id: "t3",
              title: "Learn about React hooks",
              description: "Understand useState, useEffect, and custom hooks",
              completed: true,
            },
          ],
        },
        {
          id: "m2",
          title: "Master state management",
          description: "Learn Redux and Context API for state management",
          dueDate: new Date(2024, 6, 30),
          completed: false,
          tasks: [
            {
              id: "t4",
              title: "Learn Redux basics",
              description: "Understand actions, reducers, and store",
              completed: true,
            },
            {
              id: "t5",
              title: "Implement Redux in a project",
              description: "Add Redux to an existing project",
              completed: false,
            },
            {
              id: "t6",
              title: "Learn Context API",
              description: "Understand when to use Context vs Redux",
              completed: false,
            },
          ],
        },
        {
          id: "m3",
          title: "Build a full-stack application",
          description: "Create a complete application with React and Node.js",
          dueDate: new Date(2024, 9, 30),
          completed: false,
          tasks: [
            {
              id: "t7",
              title: "Design application architecture",
              description: "Plan the structure and features",
              completed: false,
            },
            {
              id: "t8",
              title: "Build backend with Node.js",
              description: "Create REST API with Express",
              completed: false,
            },
            {
              id: "t9",
              title: "Connect frontend to backend",
              description: "Implement API calls from React to Node",
              completed: false,
            },
          ],
        },
      ],
      progress: 40,
    },
    {
      id: "2",
      title: "Run a Half Marathon",
      description: "Train and complete a half marathon",
      category: "health",
      targetDate: new Date(2024, 9, 15),
      milestones: [
        {
          id: "m4",
          title: "Build base fitness",
          description: "Establish consistent running routine",
          dueDate: new Date(2024, 3, 15),
          completed: true,
          tasks: [
            {
              id: "t10",
              title: "Run 3 times per week",
              description: "Establish consistent running schedule",
              completed: true,
            },
            {
              id: "t11",
              title: "Run 5km without stopping",
              description: "Build endurance to complete 5km",
              completed: true,
            },
          ],
        },
        {
          id: "m5",
          title: "Increase distance",
          description: "Gradually increase running distance",
          dueDate: new Date(2024, 6, 15),
          completed: false,
          tasks: [
            { id: "t12", title: "Run 10km", description: "Complete a 10km run", completed: false },
            {
              id: "t13",
              title: "Incorporate strength training",
              description: "Add weekly strength workouts",
              completed: true,
            },
          ],
        },
      ],
      progress: 35,
    },
  ])

  const [newGoal, setNewGoal] = useState<Partial<LongTermGoal>>({
    title: "",
    description: "",
    category: "",
    milestones: [],
  })

  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    tasks: [],
  })

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
  })

  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({})
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({})
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [goalDate, setGoalDate] = useState<Date>()
  const [milestoneDate, setMilestoneDate] = useState<Date>()
  const [taskDate, setTaskDate] = useState<Date>()

  const toggleGoalExpand = (goalId: string) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }))
  }

  const toggleMilestoneExpand = (milestoneId: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }))
  }

  const handleAddGoal = () => {
    if (!newGoal.title) return

    const goal: LongTermGoal = {
      id: Date.now().toString(),
      title: newGoal.title || "",
      description: newGoal.description || "",
      category: newGoal.category || "personal",
      targetDate: goalDate,
      milestones: [],
      progress: 0,
    }

    setGoals((prev) => [...prev, goal])
    setNewGoal({ title: "", description: "", category: "", milestones: [] })
    setGoalDate(undefined)
    setIsAddingGoal(false)
  }

  const handleAddMilestone = () => {
    if (!newMilestone.title || !selectedGoalId) return

    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title || "",
      description: newMilestone.description || "",
      dueDate: milestoneDate,
      tasks: [],
      completed: false,
    }

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === selectedGoalId) {
          return {
            ...goal,
            milestones: [...goal.milestones, milestone],
          }
        }
        return goal
      }),
    )

    setNewMilestone({ title: "", description: "", tasks: [] })
    setMilestoneDate(undefined)
    setIsAddingMilestone(false)
  }

  const handleAddTask = () => {
    if (!newTask.title || !selectedGoalId || !selectedMilestoneId) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || "",
      description: newTask.description || "",
      dueDate: taskDate,
      completed: false,
    }

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === selectedGoalId) {
          return {
            ...goal,
            milestones: goal.milestones.map((milestone) => {
              if (milestone.id === selectedMilestoneId) {
                return {
                  ...milestone,
                  tasks: [...milestone.tasks, task],
                }
              }
              return milestone
            }),
          }
        }
        return goal
      }),
    )

    setNewTask({ title: "", description: "" })
    setTaskDate(undefined)
    setIsAddingTask(false)
  }

  const toggleTaskCompletion = (goalId: string, milestoneId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) => {
            if (milestone.id === milestoneId) {
              const updatedTasks = milestone.tasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, completed: !task.completed }
                }
                return task
              })

              // Check if all tasks are completed
              const allTasksCompleted = updatedTasks.every((task) => task.completed)

              return {
                ...milestone,
                tasks: updatedTasks,
                completed: allTasksCompleted,
              }
            }
            return milestone
          })

          // Calculate progress
          const totalMilestones = updatedMilestones.length
          const completedMilestones = updatedMilestones.filter((m) => m.completed).length
          const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
          }
        }
        return goal
      }),
    )
  }

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.filter((milestone) => milestone.id !== milestoneId),
          }
        }
        return goal
      }),
    )
  }

  const deleteTask = (goalId: string, milestoneId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  tasks: milestone.tasks.filter((task) => task.id !== taskId),
                }
              }
              return milestone
            }),
          }
        }
        return goal
      }),
    )
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      career: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      education: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      finance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      personal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      relationships: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Long-Term Goals</h1>
          <p className="text-muted-foreground">Set big goals and break them down into achievable steps</p>
        </div>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Long-Term Goal</DialogTitle>
              <DialogDescription>Create a new goal with a clear title, description, and target date.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Goal Title
                </label>
                <Input
                  id="title"
                  placeholder="What do you want to achieve?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal in detail..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="targetDate" className="text-sm font-medium">
                  Target Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {goalDate ? format(goalDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={goalDate} onSelect={setGoalDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Goals</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Goal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No goals yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">Create your first long-term goal to get started</p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{goal.title}</CardTitle>
                      <CardDescription className="mt-1">{goal.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(goal.category)}>
                        {categories.find((c) => c.value === goal.category)?.label || goal.category}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => toggleGoalExpand(goal.id)}>
                        {expandedGoals[goal.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>Progress: {goal.progress}%</div>
                      {goal.targetDate && <div>Target: {format(goal.targetDate, "MMM d, yyyy")}</div>}
                    </div>
                    <Progress value={goal.progress} className="mt-2" />
                  </div>
                </CardHeader>
                {expandedGoals[goal.id] && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Milestones</h3>
                        <Dialog
                          open={isAddingMilestone && selectedGoalId === goal.id}
                          onOpenChange={(open) => {
                            setIsAddingMilestone(open)
                            if (open) setSelectedGoalId(goal.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="mr-2 h-3 w-3" />
                              Add Milestone
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Add New Milestone</DialogTitle>
                              <DialogDescription>Break down your goal into achievable milestones.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="milestone-title" className="text-sm font-medium">
                                  Milestone Title
                                </label>
                                <Input
                                  id="milestone-title"
                                  placeholder="What's the next significant step?"
                                  value={newMilestone.title}
                                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="milestone-description" className="text-sm font-medium">
                                  Description
                                </label>
                                <Textarea
                                  id="milestone-description"
                                  placeholder="Describe this milestone..."
                                  value={newMilestone.description}
                                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="milestone-date" className="text-sm font-medium">
                                  Due Date
                                </label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {milestoneDate ? format(milestoneDate, "PPP") : "Select a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <CalendarComponent
                                      mode="single"
                                      selected={milestoneDate}
                                      onSelect={setMilestoneDate}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddingMilestone(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddMilestone}>Add Milestone</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {goal.milestones.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No milestones yet. Add one to break down your goal.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {goal.milestones.map((milestone) => (
                            <div key={milestone.id} className="rounded-lg border p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${milestone.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                                  >
                                    {milestone.completed && <Check className="h-3 w-3" />}
                                  </div>
                                  <div>
                                    <h4
                                      className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                                    >
                                      {milestone.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                    {milestone.dueDate && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Due: {format(milestone.dueDate, "MMM d, yyyy")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleMilestoneExpand(milestone.id)}
                                  >
                                    {expandedMilestones[milestone.id] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteMilestone(goal.id, milestone.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {expandedMilestones[milestone.id] && (
                                <div className="mt-3 pl-7">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-medium">Tasks</h5>
                                    <Dialog
                                      open={isAddingTask && selectedMilestoneId === milestone.id}
                                      onOpenChange={(open) => {
                                        setIsAddingTask(open)
                                        if (open) {
                                          setSelectedGoalId(goal.id)
                                          setSelectedMilestoneId(milestone.id)
                                        }
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="h-7 text-xs">
                                          <Plus className="mr-1 h-3 w-3" />
                                          Add Task
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[450px]">
                                        <DialogHeader>
                                          <DialogTitle>Add New Task</DialogTitle>
                                          <DialogDescription>
                                            Break down your milestone into specific tasks.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div className="grid gap-2">
                                            <label htmlFor="task-title" className="text-sm font-medium">
                                              Task Title
                                            </label>
                                            <Input
                                              id="task-title"
                                              placeholder="What needs to be done?"
                                              value={newTask.title}
                                              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            />
                                          </div>
                                          <div className="grid gap-2">
                                            <label htmlFor="task-description" className="text-sm font-medium">
                                              Description
                                            </label>
                                            <Textarea
                                              id="task-description"
                                              placeholder="Describe this task..."
                                              value={newTask.description}
                                              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            />
                                          </div>
                                          <div className="grid gap-2">
                                            <label htmlFor="task-date" className="text-sm font-medium">
                                              Due Date
                                            </label>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  className="w-full justify-start text-left font-normal"
                                                >
                                                  <Calendar className="mr-2 h-4 w-4" />
                                                  {taskDate ? format(taskDate, "PPP") : "Select a date"}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                  mode="single"
                                                  selected={taskDate}
                                                  onSelect={setTaskDate}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                                            Cancel
                                          </Button>
                                          <Button onClick={handleAddTask}>Add Task</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>

                                  {milestone.tasks.length === 0 ? (
                                    <div className="text-center py-2 text-xs text-muted-foreground">
                                      No tasks yet. Add one to get started.
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {milestone.tasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="flex items-start justify-between rounded border-l-2 border-l-primary/50 bg-muted/50 p-2"
                                        >
                                          <div className="flex items-start gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5 rounded-full"
                                              onClick={() => toggleTaskCompletion(goal.id, milestone.id, task.id)}
                                            >
                                              <div
                                                className={`h-4 w-4 rounded-full border ${task.completed ? "bg-primary border-primary" : "border-muted-foreground"}`}
                                              >
                                                {task.completed && (
                                                  <Check className="h-3 w-3 text-primary-foreground" />
                                                )}
                                              </div>
                                            </Button>
                                            <div>
                                              <h6
                                                className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                                              >
                                                {task.title}
                                              </h6>
                                              {task.description && (
                                                <p className="text-xs text-muted-foreground">{task.description}</p>
                                              )}
                                              {task.dueDate && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  Due: {format(task.dueDate, "MMM d, yyyy")}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => deleteTask(goal.id, milestone.id, task.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value} className="space-y-4 mt-4">
            {goals.filter((goal) => goal.category === category.value).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No {category.label} goals yet</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Create your first {category.label.toLowerCase()} goal to get started
                </p>
                <Button
                  onClick={() => {
                    setNewGoal({ ...newGoal, category: category.value })
                    setIsAddingGoal(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add {category.label} Goal
                </Button>
              </div>
            ) : (
              goals
                .filter((goal) => goal.category === category.value)
                .map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{goal.title}</CardTitle>
                          <CardDescription className="mt-1">{goal.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(goal.category)}>
                            {categories.find((c) => c.value === goal.category)?.label || goal.category}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => toggleGoalExpand(goal.id)}>
                            {expandedGoals[goal.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div>Progress: {goal.progress}%</div>
                          {goal.targetDate && <div>Target: {format(goal.targetDate, "MMM d, yyyy")}</div>}
                        </div>
                        <Progress value={goal.progress} className="mt-2" />
                      </div>
                    </CardHeader>
                    {/* Milestone content would be repeated here */}
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

